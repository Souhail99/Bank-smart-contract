# Bank Smart Contract and Web App - User Guide

This guide provides instructions on how to set up and use the Bank Smart Contract and Web App. The project includes a Solidity smart contract for a token and a bank, along with a Next.js web app that interacts with the smart contracts. You can find the full code and smart contracts in the [GitHub repository](https://github.com/Souhail99/Bank-smart-contract).

## Prerequisites
Before getting started, ensure that you have the following software installed on your machine:

- Node.js (LTS version or higher)
- npm (Node Package Manager)
- Truffle Suite (for running tests and interacting with smart contracts)

## Installation
1. Clone the Repository:
```bash
git clone https://github.com/Souhail99/Bank-smart-contract.git
```
1. Change Directory:
```bash
cd Bank-smart-contract
```
2. Install Dependencies:
```bash
npm install
```

3. Start the Web App:
```bash
npm run dev
```
The web app should now be running at http://localhost:3000.

## Using the Web App

The web app is an interface for interacting with the Bank Smart Contract and the Token Smart Contract. Here's how to use the main features:

### Connect Wallet

Click on the "Connect Wallet" button to connect your Ethereum wallet (e.g., MetaMask). Make sure you have a compatible wallet installed in your browser.

### Deposit

1. Enter the amount of tokens you want to deposit in the "Deposit" section.
2. Click the "Deposit" button to initiate the deposit transaction.
3. Confirm the transaction in your wallet to complete the deposit.

### Withdraw

1. Click the "Withdraw" button to initiate the withdrawal of your tokens.
2. Confirm the transaction in your wallet to complete the withdrawal.

### Mint Tokens

1. Enter the recipient's address and the amount of tokens to be minted in the "Mint tokens" section.
2. Click the "Submit" button to initiate the minting transaction.
3. Confirm the transaction in your wallet to complete the minting.

### View Token Balance

Your token balance is displayed at the top of the web app.
It is automatically updated after each deposit, withdrawal, or minting transaction.

### After migrations

Modify the contract addresses in the ***config.js*** file:
Ensure you update the addresses of the "Token" and "Bank" contracts in the config.js file located in the blockchainapi folder. Replace the current addresses with the new addresses of the contracts deployed on the test network (e.g., Ganache or another Ethereum test network).

Currently, the addresses correspond to deployed contracts (in the file 1_initial_migration.js in migration, only the ***deployInit*** function was executed for contract deployment). However, you can interact with the contracts (especially for minting, see section ***Smart-contracts: RePool and Mint***).


# Running Smart Contract Tests

1. Change Directory:
```bash
cd Origintrail
```
2. Compile Smart-contracts:
```bash
truffle compile
```
3. Migrate and view the addresses in the terminal:
```bash
truffle migrate --network sepolia
```
In our test, the lock period is 60 seconds, and the pool contains 1000 XYZ tokens :
```javascript
bank = await Bank.new(token.address,  60, 1000, {from:account1});
```
We perform the test of the example provided in the technical assessment.

**Don't forget to launch Ganache before running the migration. Don't forget to update the truffle-config in the Origintrail folder to add your mnemonic and Infura key.**

# Smart-contracts : RePool and Mint

For testing purposes and to make your life easier, there is a function called ***RePool*** that allows you to add tokens to the rewards pool and avoid deploying contracts for each test. Additionally, for testing convenience, the ***mint*** function is not restricted to OnlyOwner, making it easier to perform tests.
