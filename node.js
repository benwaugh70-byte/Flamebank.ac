import { ethers } from "ethers";
const provider = new ethers.JsonRpcProvider("https://flamebank.ac");
const wallet = new ethers.Wallet("PRIVATE_KEY_HERE", provider);
const contractAddress = "0xYourDeployedContractAddress";
const contractABI = [
    "function registerUser(bytes20 userHash, bytes32 nfcId) external",
    "function deposit(bytes20 userHash) external payable",
    "function withdraw(bytes20 userHash, uint256 amount) external",
    "function linkNFC(bytes20 userHash, bytes32 nfcId) external",
    "function getBalance(bytes20 userHash) view returns (uint256)"    "function getNFC(bytes20 userHash) view
returns (bytes32)",
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
npm install ethers dotenv
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://rpc.yournetwork.io
flamebank/
├─ scripts/
│  └─ deploy_and_register.js
├–Flamebank.sol
│ 
├─ .env
└─ package.json
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// --- Setup provider and wallet ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// --- Load compiled contract ABI & bytecode ---
const compiled = JSON.parse(fs.readFileSync(path.join('artifacts', 'Flamebank.json')));
const { abi, bytecode } = compiled;

// --- Deploy Contract ---
async function deployContract() {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);
    return contract;
}

// --- Generate user hash & NFC ID ---
function generateUserData() {
    const hashBytes = ethers.randomBytes(20); // SHA1-length hash
    const nfcBytes = ethers.randomBytes(16); // 16-byte NFC
    return {
        userHash: ethers.hexlify(hashBytes),
        nfcId: ethers.hexlify(nfcBytes)
    };
}

// --- Register user on-chain ---
async function registerUser(contract, userHash, nfcId) {
    const tx = await contract.registerUser(userHash, nfcId);
    await tx.wait();
    console.log(`User ${userHash} registered with NFC ${nfcId}`);
}

// --- Off-chain ledger integration ---
const offChainLedger = {}; // Replace with your DB in production
function syncLedger(userHash, walletAddress, nfcId, fiatBalance = 0) {
    offChainLedger[userHash] = {
        wallet: walletAddress,
        nfcId,
        fiatBalance
    };
    console.log(`Ledger synced: ${userHash}`);
}

// --- Main execution ---
(async () => {
    const contract = await deployContract();

    // Example: create 3 beta users
    for (let i = 0; i < 3; i++) {
        const { userHash, nfcId } = generateUserData();
        await registerUser(contract, userHash, nfcId);
        syncLedger(userHash, wallet.address, nfcId, 1000000); // AUD 1,000,000 placeholder
    }

    // Save off-chain ledger to JSON for reference
    fs.writeFileSync('ledger.json', JSON.stringify(offChainLedger, null, 2));
    console.log("Beta users deployed and ledger saved!");
})();
}
}