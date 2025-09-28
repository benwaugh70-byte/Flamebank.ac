import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider("https://rpc.yournetwork.io");
const wallet = new ethers.Wallet("PRIVATE_KEY_HERE", provider);
const contractAddress = "0xYourDeployedContractAddress";
const contractABI = [
    "function registerUser(bytes20 userHash, bytes32 nfcId) external",
    "function deposit(bytes20 userHash) external payable",
    "function withdraw(bytes20 userHash, uint256 amount) external",
    "function linkNFC(bytes20 userHash, bytes32 nfcId) external",
    "function getBalance(bytes20 userHash) view returns (uint256)",
    "function getNFC(bytes20 userHash) view returns (bytes32)",
    "function getOwner(bytes20 userHash) view returns (address)"
];

const flamebank = new ethers.Contract(contractAddress, contractABI, wallet);

// Example user hash and NFC ID
const userHash = "0xc94358009de00cc5ad520010c67e131ac555d6d0";
const nfcId = ethers.hexlify(ethers.randomBytes(16)); // Random 16-byte NFC ID

// Register user with NFC card
async function registerWithNFC() {
    const tx = await flamebank.registerUser(userHash, nfcId);
    await tx.wait();
    console.log("User registered with NFC:", nfcId);
}

// Deposit 1 ETH
async function deposit() {
    const tx = await flamebank.deposit(userHash, { value: ethers.parseEther("1.0") });
    await tx.wait();
    console.log("Deposit complete");
}

// Link new NFC card (e.g., replacing old card)
async function linkNewNFC() {
    const newNfc = ethers.hexlify(ethers.randomBytes(16));
    const tx = await flamebank.linkNFC(userHash, newNfc);
    await tx.wait();
    console.log("New NFC linked:", newNfc);
}

// Check balance
async function checkBalance() {
    const balance = await flamebank.getBalance(userHash);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
}

// Check NFC
async function checkNFC() {
    const currentNfc = await flamebank.getNFC(userHash);
    console.log("Current NFC ID:", currentNfc);
}

// Usage example
(async () => {
    await registerWithNFC();
    await deposit();
    await checkBalance();
    await linkNewNFC();
    await checkNFC();
})();userHash -> walletAddress, NFC ID, ACH info, fiat balance