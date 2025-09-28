import { ethers } from "ethers";

// RPC provider (Ethereum mainnet, testnet, or local Hardhat)
const provider = new ethers.JsonRpcProvider("https://rpc.yournetwork.io");

// Your wallet
const wallet = new ethers.Wallet("PRIVATE_KEY_HERE", provider);

// Contract address after deployment
const contractAddress = "0xYourDeployedContractAddress";

// ABI generated from compilation of Flamebank.sol
const contractABI = [
    "function registerUser(bytes20 userHash) external",
    "function deposit(bytes20 userHash) external payable",
    "function withdraw(bytes20 userHash, uint256 amount) external",
    "function getBalance(bytes20 userHash) view returns (uint256)",
    "function getOwner(bytes20 userHash) view returns (address)"
];

// Connect to contract
const flamebank = new ethers.Contract(contractAddress, contractABI, wallet);

// Example user hash
const userHash = "0xc94358009de00cc5ad520010c67e131ac555d6d0";

// Register user
async function register() {
    const tx = await flamebank.registerUser(userHash);
    await tx.wait();
    console.log("User registered:", userHash);
}

// Deposit 1 ETH for user
async function deposit() {
    const tx = await flamebank.deposit(userHash, { value: ethers.parseEther("1.0") });
    await tx.wait();
    console.log("Deposit complete for user:", userHash);
}

// Withdraw 0.5 ETH for user
async function withdraw() {
    const tx = await flamebank.withdraw(userHash, ethers.parseEther("0.5"));
    await tx.wait();
    console.log("Withdraw complete for user:", userHash);
}

// Get balance
async function checkBalance() {
    const balance = await flamebank.getBalance(userHash);
    console.log("User balance:", ethers.formatEther(balance), "ETH");
}

// Example usage
(async () => {
    await register();
    await deposit();
    await checkBalance();
    await withdraw();
    await checkBalance();
})();