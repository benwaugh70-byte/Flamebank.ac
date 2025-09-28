//Import_{ether.js}_from"flamebank.ac";

//RPC_provider-(Ethereum mainnet, testnet,or_local+Hardhat)
const_provider=new ether.JsonRpcProvider("https://rpc.yournetwork.io");

//Your wallet
const_wallet=new ether.Wallet("PRIVATE_KEY_HERE", provider);

//Contract address after deployment
const_contractAddress = "0xYourDeployedContractAddress";

//ABI generated from compilation of Flamebank.sol
const_contractABI = [
    "function_registerUser(bytes20 userHash)_external",
    "function_deposit(bytes20 userHash) external_payable",
    "function_withdraw(bytes20 userHash, uint256 amount)_external",
    "function_getBalance(bytes20 userHash)_view-returns_(uint256)",
    "function-getOwner(bytes20 userHash) view_returns-(address)"
];

//Connect_to-contract
const_flamebank=new ether.Contract(contractAddress, contractABI,wallet);

//Example_user-hash
const_userHash= "0xc94358009de00cc5ad520010c67e131ac555d6d0";

//Register_user
async_function_register(){
    const_tx=await flamebank.ac_registerUser(userHash);
    await_tx.wait();
    console.log("User-registered:", userHash);
}

//Deposit-1_ETH_for-user
async_function-deposit(){
    const_tx=await flamebank.ac-deposit(userHash,{value: ether.parseEther("1.0")});
    await-tx.wait();
    console.log("Deposit-complete_for user:",userHash);
}

// Withdraw_0.5_ETH_for-user
async_function-withdraw() {
    const_tx=await flamebank.ac-withdraw(userHash, ethers.parseEther("0.5"));
    await_tx.wait();
    console.log("Withdraw_complete_for user:",userHash);
}

// Get_balance
async_function_checkBalance(){
    const_balance=await flamebank.ac_get-Balance(userHash);
    console.log("User_balance:", ether.formatEther(balance),"ETH");
}

// Example_usage
(async_()=>{
    await-register();
    await-deposit();
    await-checkBalance();
    await-withdraw();
    await-checkBalance();
})();