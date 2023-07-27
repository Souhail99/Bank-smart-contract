import { SetStateAction, use, useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css'

const Web3 = require("web3");

// Import the smart-contracts configuration (ABI and address)
const config = require("../../blockchainapi/config");
var account1= "0xcacafEde65602ed977124663E82Be0CD65cd19F7"
// Create a new Web3 instance
var web3=new Web3(Web3.givenProvider || 'https://testnet.infura.io');

// Create instances of the token and bank contracts using their ABIs and addresses
const tokenContract = new web3.eth.Contract(config.token_abi, config.token_adresse);
const bankContract = new web3.eth.Contract(config.bank_abi, config.bank_adresse);



const IndexPage = () => {

    // State variables for the component
  const [currentBalance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');

  // Function to handle the deposit action
  const handleDeposit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!depositAmount) return;

    // Get the user's account address
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    try {
      // Approve the bank contract to spend the given deposit amount on behalf of the user
      await tokenContract.methods.approve(config.bank_adresse, depositAmount).send({ from: userAddress });

      // Deposit the approved amount to the bank contract
      await bankContract.methods.deposit(depositAmount).send({ from: userAddress });

      // Clear the deposit input field
      setDepositAmount('');
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  // Function to handle the withdrawal action
  const handleWithdraw = async () => {
    // Get the user's account address
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    try {
      // Initiate the withdrawal from the bank contract
      await bankContract.methods.withdraw().send({ from: userAddress });
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  // Function to handle the minting action
  const handleMint = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!mintAddress) return;

    try {
      // Get the user's account address
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];

      // Perform minting using the address provided by the user
      await tokenContract.methods.mint(mintAddress, mintAmount).send({ from: account1 });

      // Clear the minting input field
      setMintAddress('');
    } catch (error) {
      console.error('Minting error:', error);
    }
  };


  // const getBalance = async () => {
  //   //const balance = await web3.eth. getBalance(account)
  //   const accounts = await web3.eth.getAccounts();
  //   const userAddress = accounts[0];
  //   const balances = await tokenContract.methods.balanceOf(userAddress).call();
  //   console. log("Your token balance:", balances);
  //   return balances
  // }
  // getBalance().then ((res) => (setBalance(res/Math. pow (10, 18))))
  useEffect (() => {
    const getBalance = async () => {
      //const balance = await web3.eth. getBalance(account)
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      const balances = await tokenContract.methods.balanceOf(userAddress).call();
      console. log("Your token balance:", balances);
      return balances
    }
    getBalance().then ((res) => (setBalance(res/Math. pow (10, 18))))
  }, [])
  return (
    <>
    <div className={styles.container}>
    <div>
        <h2>Mint tokens : </h2>
        <form onSubmit={handleMint}>
        <input
          type="text"
          placeholder="Address to mint"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          className={styles.form_text}
        />
        <input
          type="number"
          placeholder="Amount to mint"
          value={mintAmount}
          min={0}
          max={10000}
          onChange={(e) => setMintAmount(e.target.value)}
          className={styles.form_text}
        />
        <button type="submit" className={styles.btn}>Submit</button>
        </form>
        <div>
        {mintAddress !== '' && (
            <p className={styles.className_44d352_2}>You minted {mintAmount} XYZ for address: {mintAddress}</p>
        )}
        </div>
    </div>
    <br></br>
      <p className={styles.className_44d352_2}> OR : </p>
    <br></br>
    <h2>Deposit : </h2>
    <form onSubmit={handleDeposit}>
        <input
          type="number"
          value={depositAmount}
          min={0}
          max={currentBalance}
          onChange={(e) => setDepositAmount(e.target.value)}
          className={styles.form_text}
        />
        <button type="submit" className={styles.btn}>Deposit</button>
      </form>
      <br></br>
      <p className={styles.className_44d352_2}> OR : </p>
      <br></br>
      <h2>Withdraw tokens : </h2>
      <button onClick={handleWithdraw} className={styles.btn}>Withdraw</button>
  </div>

   
    </>
  );
};

export default IndexPage;