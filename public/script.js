document.getElementById("transferForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const sourceChain = document.getElementById("source-chain").value;
    const destinationChain = document.getElementById("destination-chain").value;
    const statusElement = document.getElementById("transaction-status");
    const statusUpdates = document.getElementById("status-updates");

    if (!amount || amount <= 0) {
        statusElement.textContent = "Please enter a valid amount.";
        statusElement.classList.add("error");
        return;
    }

    statusElement.textContent = "Transaction in progress...";
    statusElement.classList.remove("success", "error");
    statusUpdates.innerHTML = ""; // Clear previous updates

    try {
        const response = await fetch("/transfer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, sourceChain, destinationChain })
        });

        const data = await response.json();
        if (response.ok) {
            statusElement.textContent = `Transaction Successful! Tx Hash: ${data.transactionHash}`;
            statusElement.classList.add("success");
        } else {
            statusElement.textContent = `Error: ${data.message || "Transaction failed."}`;
            statusElement.classList.add("error");
        }
    } catch (error) {
        statusElement.textContent = "Network error. Please try again.";
        statusElement.classList.add("error");
    }
});

// Listen for real-time transaction updates
const eventSource = new EventSource("/events");
eventSource.onmessage = function (event) {
    const statusUpdates = document.getElementById("status-updates");
    const newStatus = document.createElement("li");
    newStatus.textContent = event.data;
    statusUpdates.appendChild(newStatus);
};
