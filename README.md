# 🌍 Web3 Union - The Future of Money Transfers

This project is a way to transfer USDC between blockchains 🌐💸 Instead of relying on traditional banking, we use **Circle's Cross-Chain Transfer Protocol (CCTP)** to move **USDC across different blockchains** instantly and securely.
<img width="1040" alt="web3union" src="https://github.com/user-attachments/assets/0f762286-4423-4778-a9fd-4d3a97356fc4" />

---

## 🔥 What is CCTP?
**Circle’s Cross-Chain Transfer Protocol (CCTP)** is a game-changer for moving **USDC across different blockchains**. Unlike traditional bridges that lock tokens on one chain and mint them on another, **CCTP burns USDC on the source chain and issues new USDC on the destination chain**. This makes transfers **safer, faster, and more capital-efficient**! 🔄

### 🛠️ How It Works
1️⃣ **User initiates a transfer** 📝

2️⃣ **Smart contract burns USDC** on **Avalanche Fuji** 🔥

3️⃣ **Circle provides an attestation** (proof of burn) ✅

4️⃣ **New USDC is minted** on **Ethereum Sepolia** ✨

5️⃣ **Funds arrive at the destination wallet** 🎉

---

## 🎯 Features
✅ Transfers USDC from **Avalanche Fuji** to **Ethereum Sepolia**
✅ Uses **Thirdweb SDK** for blockchain interactions
✅ Implements **real-time transaction status updates** using SSE
✅ Backend powered by **Node.js and Express**
✅ Sleek and simple **frontend with HTML, CSS, and JavaScript**

---

## 🚀 Getting Started

### 📦 Prerequisites
Ensure you have the following installed:
- **Node.js** (>=16.x) 🖥️
- **NPM or Yarn** 📦
- **Metamask Wallet** (for testing transactions) 🔐

### ⚙️ Setup
1️⃣ **Clone the repository**
   ```sh
   git clone https://github.com/your-repo/web3-union.git
   cd web3-union
   ```

2️⃣ **Install dependencies**
   ```sh
   npm install
   ```

3️⃣ **Set up environment variables**
   Create a `.env` file in the root directory and add:
   ```sh
   PRIVATE_KEY=your_private_key
   SECRET_KEY=your_secret_key
   PORT=3000
   ```
   - Replace `your_private_key` with your wallet’s **private key** 🔑
   - Replace `your_secret_key` with your **Thirdweb secret key** 🛠️

4️⃣ **Start the server**
   ```sh
   npm start
   ```

5️⃣ **Open the frontend**
   - Navigate to `http://localhost:3000` in your browser 🌍
   - Enter the USDC amount and initiate the transfer 💸
   - Watch **real-time updates** on the transaction status! 📡

---

## 📂 Project Structure
```
├── public/                 # Frontend files
│   ├── index.html          # Main UI
│   ├── style.css           # Stylesheet
│   ├── script.js           # Frontend logic
├── server.js               # Express backend
├── .env                    # Environment variables
├── package.json            # Dependencies & scripts
└── README.md               # Project documentation
```

---

## 🛠️ Technologies Used
- **Node.js + Express** (Backend) 🖥️
- **Thirdweb SDK** (Blockchain interactions) 🔗
- **SSE (Server-Sent Events)** (Real-time updates) 📡
- **Circle CCTP API** (USDC cross-chain transfers) 🔄
- **HTML, CSS, JavaScript** (Frontend) 🎨

---

## 📜 License
This project is open-source and available under the **MIT License**.

🎉 Feel free to modify, extend, and share! Happy coding! 🚀

