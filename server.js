import express from 'express';
import bodyParser from "body-parser";
import { config } from 'dotenv';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { Networks } from "./const/chains.js";
import path from 'path';
import { fileURLToPath } from 'url';

config(); // Load environment variables from .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // For parsing application/json


app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files (HTML, JS, CSS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Private key and secret key
const privateKey = process.env.PRIVATE_KEY;
const secretKey = process.env.SECRET_KEY;
/*const amountToTransfer = 0.1; // Amount to transfer in USDC
const sourceChain = "avalanche-fuji"; // Change to the desired source chain
const destinationChain = "sepolia"; // Change to the desired destination chain
*/

let clients = [];

// SSE endpoint for real-time updates
app.get("/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);

    req.on("close", () => {
        clients = clients.filter(client => client !== res);
    });
});

function sendUpdate(message) {
    clients.forEach(client => client.write(`data: ${message}\n\n`));
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
// API endpoint to initiate transfer
app.post('/transfer', async (req, res) => {
  
    const amount = req.body['amount'];
    const sourceChain = "avalanche-fuji"
    const destinationChain = "sepolia";


    const sourceChainObject = Networks[sourceChain];
    const destinationChainObject = Networks[destinationChain];

    // Initialize SDK for source and destination chains
    const sourceChainSDK = ThirdwebSDK.fromPrivateKey(privateKey, sourceChainObject.network, {
        secretKey,
    });
    const destinationChainSDK = ThirdwebSDK.fromPrivateKey(privateKey, destinationChainObject.network, {
        secretKey,
    });

    const destinationAddress = await destinationChainSDK.wallet.getAddress();

    sendUpdate(
        `Transferring ${amount} USDC from ${sourceChainObject.name} to ${destinationChainObject.name}`
    );
    sendUpdate(`Wallet Address: ${destinationAddress}`);

    const TOKEN_MESSENGER_CONTRACT_ADDRESS = sourceChainObject.tokenMessengerContract;
    const USDC_CONTRACT_ADDRESS = sourceChainObject.usdcContract;
    const MESSAGE_TRANSMITTER_CONTRACT_ADDRESS = destinationChainObject.messageTransmitterContract;
    const DESTINATION_DOMAIN = destinationChainObject.domain;

    const ethTokenMessengerContract = await sourceChainSDK.getContract(TOKEN_MESSENGER_CONTRACT_ADDRESS);
    const usdcEthContract = await sourceChainSDK.getContract(USDC_CONTRACT_ADDRESS);
    const messageTransmitterContract = await destinationChainSDK.getContract(MESSAGE_TRANSMITTER_CONTRACT_ADDRESS);

    const destinationAddressInBytes32 = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [destinationAddress]
    );

    const amountInUSDC = amount;
   

    // STEP 1: Approve messenger contract to withdraw from active wallet address
    sendUpdate(`Approving USDC transfer on ${sourceChainObject.name}...`);
    const approveMessengerWithdraw = await usdcEthContract.call("approve", [
        TOKEN_MESSENGER_CONTRACT_ADDRESS,
        amountInUSDC,
    ]);
    sendUpdate(`Approved - txHash: ${approveMessengerWithdraw.receipt.transactionHash}`);

    // STEP 2: Burn USDC
    sendUpdate(`Depositing USDC to Token Messenger contract on ${sourceChainObject.name}...`);
    const burnUSDC = await ethTokenMessengerContract.call("depositForBurn", [
        amountInUSDC,
        DESTINATION_DOMAIN,
        destinationAddressInBytes32,
        USDC_CONTRACT_ADDRESS,
    ]);
    sendUpdate(`Deposited - txHash: ${burnUSDC.receipt.transactionHash}`);


    // STEP 3: Retrieve message bytes from logs
    const transactionReceipt = burnUSDC.receipt;
    const eventTopic = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MessageSent(bytes)"));
    const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
    const messageBytes = ethers.utils.defaultAbiCoder.decode(["bytes"], log.data)[0];
    const messageHash = ethers.utils.keccak256(messageBytes);

    // STEP 4: Fetch attestation signature
    let attestationResponse = { status: "pending" };
    while (attestationResponse.status !== "complete") {
        const response = await fetch(
            `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
        );
        attestationResponse = await response.json();
        sendUpdate(`Attestation Status: ${attestationResponse.status || "sent"}`);
        await new Promise((r) => setTimeout(r, 2000));
    }

    const attestationSignature = attestationResponse.attestation;

    // STEP 5: Receive the funds on the destination chain and address
    const receiveTx = await messageTransmitterContract.call(
        "receiveMessage",
        [messageBytes, attestationSignature]
    );
    sendUpdate(`Transaction complete - txHash: ${receiveTx.receipt.transactionHash}`);

    res.status(200).json({
        message: "Transfer complete",
        transactionHash: receiveTx.receipt.transactionHash,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});