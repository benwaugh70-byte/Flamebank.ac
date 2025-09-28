// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Flamebank {

    // Store balances linked to unique user hashes
    mapping(bytes20 => uint256) private balances;

    // Store wallet address associated with hash
    mapping(bytes20 => address) private owners;

    // Events for tracking deposits and withdrawals
    event Registered(bytes20 indexed userHash, address indexed wallet);
    event Deposit(bytes20 indexed userHash, uint256 amount);
    event Withdraw(bytes20 indexed userHash, uint256 amount);

    // Register a user hash with wallet
    function registerUser(bytes20 userHash) external {
        require(owners[userHash] == address(0), "User already registered");
        owners[userHash] = msg.sender;
        balances[userHash] = 0;
        emit Registered(userHash, msg.sender);
    }

    // Deposit Ether for a specific user hash
    function deposit(bytes20 userHash) external payable {
        require(owners[userHash] != address(0), "User not registered");
        balances[userHash] += msg.value;
        emit Deposit(userHash, msg.value);
    }

    // Withdraw Ether for the sender linked to a hash
    function withdraw(bytes20 userHash, uint256 amount) external {
        require(owners[userHash] == msg.sender, "Unauthorized");
        require(balances[userHash] >= amount, "Insufficient balance");
        balances[userHash] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(userHash, amount);
    }

    // Query balance for a user hash
    function getBalance(bytes20 userHash) external view returns (uint256) {
        return balances[userHash];
    }

    // Get owner wallet of a hash
    function getOwner(bytes20 userHash) external view returns (address) {
        return owners[userHash];
    }
}// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Flamebank {

    struct User {
        address wallet;
        uint256 balance;
        bytes32 nfcId;   // NFC-linked card ID
    }

    mapping(bytes20 => User) private users;  // user hash → User struct

    event Registered(bytes20 indexed userHash, address indexed wallet, bytes32 nfcId);
    event Deposit(bytes20 indexed userHash, uint256 amount);
    event Withdraw(bytes20 indexed userHash, uint256 amount);
    event NFCLinked(bytes20 indexed userHash, bytes32 nfcId);

    // Register a user with optional NFC card
    function registerUser(bytes20 userHash, bytes32 nfcId) external {
        require(users[userHash].wallet == address(0), "User already exists");
        users[userHash] = User(msg.sender, 0, nfcId);
        emit Registered(userHash, msg.sender, nfcId);
    }

    // Deposit Ether
    function deposit(bytes20 userHash) external payable {
        require(users[userHash].wallet != address(0), "User not registered");
        users[userHash].balance += msg.value;
        emit Deposit(userHash, msg.value);
    }

    // Withdraw Ether
    function withdraw(bytes20 userHash, uint256 amount) external {
        require(users[userHash].wallet == msg.sender, "Unauthorized");
        require(users[userHash].balance >= amount, "Insufficient funds");
        users[userHash].balance -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(userHash, amount);
    }

    // Link/Update NFC card
    function linkNFC(bytes20 userHash, bytes32 nfcId) external {
        require(users[userHash].wallet == msg.sender, "Unauthorized");
        users[userHash].nfcId = nfcId;
        emit NFCLinked(userHash, nfcId);
    }

    // Get balance
    function getBalance(bytes20 userHash) external view returns (uint256) {
        return users[userHash].balance;
    }

    // Get NFC card ID
    function getNFC(bytes20 userHash) external view returns (bytes32) {
        return users[userHash].nfcId;
    }

    // Get owner wallet
    function getOwner(bytes20 userHash) external view returns (address) {
        return users[userHash].wallet;
    }
}