}// scripts/deploy_flamebank.js
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const ARTIFACT_REL_PATH = 'artifacts/contracts/Flamebank.sol/Flamebank.json';
const NFT_ADDR_FILE = 'nft_address.txt';
const OUT_FILE = 'flamebank_address.txt';
const VERSION_FILE = 'version.txt';

async function main() {
  try {
    if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) throw new Error('.env missing RPC_URL or PRIVATE_KEY');

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    if (!fs.existsSync(NFT_ADDR_FILE)) throw new Error(`${NFT_ADDR_FILE} not found — deploy the NFT first.`);

    const nftAddress = fs.readFileSync(NFT_ADDR_FILE, 'utf8').trim();
    const artifactPath = path.join(process.cwd(), ARTIFACT_REL_PATH);
    if (!fs.existsSync(artifactPath)) throw new Error(`Artifact not found at ${artifactPath}. Compile with "npx hardhat compile"`);

    const compiled = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const factory = new ethers.ContractFactory(compiled.abi, compiled.bytecode, wallet);

    const version = fs.existsSync(VERSION_FILE) ? parseInt(fs.readFileSync(VERSION_FILE, 'utf8')) + 1 : 1;

    console.log(`Deploying Flamebank contract (version ${version}) with NFT at ${nftAddress}...`);
    const contract = await factory.deploy(nftAddress, version);
    await contract.waitForDeployment();

    const address = contract.target ?? contract.address ?? null;
    if (!address) throw new Error('Could not determine deployed contract address');

    fs.writeFileSync(OUT_FILE, address, 'utf8');
    fs.writeFileSync(VERSION_FILE, String(version), 'utf8');
    console.log(`Flamebank deployed at: ${address}`);
    console.log(`Address written to ${OUT_FILE} and version to ${VERSION_FILE}`);
  } catch (err) {
    console.error('deploy_flamebank.js error:', err);
    process.exit(1);
  }
}

main();