
// Uncomment the following three lines to make the test work (using your addresses provided by Ganache), and comment out the following three lines.
//var account1= "0xcacafEde65602ed977124663E82Be0CD65cd19F7"
//var user1= "0xc8616ee3AD058f921aFa56251ef5FF1f1Df84A79"
//var user2= "0x4b7A28f9E6db2Ee7f7A8075d308Dae57717B1736"
// Uncomment the following three lines to make the test work during migration (deployement) on a network like Sepolia (using your addresses), and comment out the previous three lines.
var account1= "0xAf8F72618E39F5747B5065c1b93E34f70E193393"
var user1= "0x5e93b8E9A69996a41F912B48f2Cf671450EF2226"
var user2= "0xF9ACb7dC7e034b8353680DF71aF8Dc1dB9c7030A"

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); // Adjust the provider URL if needed

// Smart-Contracts
var Token = artifacts.require("Token.sol");
var Bank = artifacts.require("Bank.sol");

// Check Equality
var assert = require('assert');


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {

		await deployInit(deployer, network, accounts);

    // To do the test in the PDF file :
    await MakeATest(deployer, network, accounts);
		
    });
};


// Part : to advance the time

advanceTime = (time) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [time],
      id: new Date().getTime()
    }, (err, result) => {
      if (err) { return reject(err) }
      return resolve(result)
    })
  })
}

advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: new Date().getTime()
    }, (err, result) => {
      if (err) { return reject(err) }
      const newBlockHash = web3.eth.getBlock('latest').hash

      return resolve(newBlockHash)
    })
  })
}


advanceTimeAndBlock = async (time) => {
  await advanceTime(time)
  await advanceBlock()
  return Promise.resolve(web3.eth.getBlock('latest'))
}


// Part : Deployement



async function deployInit(deployer, network, accounts) {

  try{

    // Deploy the Token contract
    token = await Token.new({from:account1});
    console.log("Token : " + token.address);

    // await token.addUser(user1, {from:account});
    // await token.addUser(user2, {from:account});

    // Mint tokens for users
    await token.mint(user1, 1000, {from:account1});
    await token.mint(user2, 4000, {from:account1});
    console.log("Mint is good");

    // Deploy the Bank contract with the Token contract as an argument
    bank = await Bank.new(token.address,  60, 1000, {from:account1});
    console.log("Bank : " + bank.address);
    
    // Add the Bank contract as a bank of the Token contract
    await token.addBank(bank.address, {from:account1});

    // Initialize pools in the Bank contract
    await bank.InitAddPoolInBank({from:account1});
    //await token.mint(bank.address, 1000, {from:account1});
    console.log("Bank control the token");

  }
  catch(e)
  {
    console.log(e)
  }

}


async function MakeATest(deployer, network, accounts) {

  // Deploy contracts and initialize data
  await deployInit(deployer, network, accounts);
  
  // Display addresses of deployed Token and Bank contracts 
  console.log("\n" + "====== Recap Addresse ======" + "\n")

	console.log("Token  : " + token.address)
	console.log("Bank : " + bank.address)

  // Display initial token balances of Bank and users
  console.log("\n" + "====== Recap Balance ======" + "\n")

  const initialBankBalance = (await token.balanceOf(bank.address))/10**18;
  const initialUser1Balance = (await token.balanceOf(user1))/10**18;
  const initialUser2Balance = (await token.balanceOf(user2))/10**18;
  console.log("Bank Balance  : " + initialBankBalance)
	console.log("User1 Balance  : " + initialUser1Balance)
  console.log("User2 Balance  : " + initialUser2Balance)

  // Display the owner's token balance
  const owner = (await token.balanceOf(account1))/10**18;
  console.log("Owner Balance  : " + owner)

  // Display deposit amounts for User1 and User2
  console.log("\n" + "====== Recap Deposit ======" + "\n")

  const depositAmount1 = 1000;
  const depositAmount2 = 4000;
  console.log("Deposit amount for user1  : " + depositAmount1)
	console.log("Deposit amount for user2  : " + depositAmount2)

  // Deposit tokens for User1 and User2
	console.log("\n" + "====== Deposit ======" + "\n")

  await token.approve(bank.address, depositAmount1, { from: user1 });
  await bank.deposit(depositAmount1, { from: user1 });

  await token.approve(bank.address, depositAmount2, { from: user2 });
  await bank.deposit(depositAmount2, { from: user2 });

  // Display token balances of Bank and users after the deposit
  console.log("\n" + "====== Recap Balance After Deposit ======" + "\n")

  const BankBalance2 = (await token.balanceOf(bank.address))/10**18;
  const User1Balance2 = (await token.balanceOf(user1))/10**18;
  const User2Balance2 = (await token.balanceOf(user2))/10**18;
  console.log("Bank Balance  : " + BankBalance2)
	console.log("User1 Balance  : " + User1Balance2)
  console.log("User2 Balance  : " + User2Balance2)

  // Check equality of deposit amounts and total Bank balance
  console.log("\n" + "====== Check Equality ======" + "\n")

  var User1 = await bank.ReturnUser(user1, { from: account1 });
  var User2 = await bank.ReturnUser(user2, { from: account1 });

  var StructUser1 = JSON.parse(JSON.stringify(User1));
  var StructUser2 = JSON.parse(JSON.stringify(User2));

  console.log("User1 : ",User1);
  console.log("User2 : ", User2);
  console.log("StructUser1: ", StructUser1);
  console.log("StructUser2 : ", StructUser2);

  assert.equal(
    parseInt(StructUser1[0], 10),
    depositAmount1,
    "User1 deposit failed"
  );
  assert.equal(
    parseInt(StructUser2[0], 10),
    depositAmount2,
    "User2 deposit failed"
  );
  assert.equal(
    BankBalance2,
    initialBankBalance + depositAmount1 + depositAmount2,
    "Bank balance incorrect"
  );
  
  // Display initial reward pool values
  console.log("\n" + "====== Recap Rewards ======" + "\n")

  const PoolBegin = await bank.getPool({ from: account1 });
 
  const R1Value = PoolBegin['0'].words?.[0];
  const R2Value = PoolBegin['1'].words?.[0]; 
  const R3Value = PoolBegin['2'].words?.[0]; 

  console.log('R1 Pool value:', R1Value);
  console.log('R2 Pool value:', R2Value);
  console.log('R3 Pool value:', R3Value);
  
  // Withdraw and get rewards for User 1
  console.log("\n" + "====== Part : Withdraw And Rewards for User 1 ======" + "\n")

  const lockPeriod = await bank.lockPeriod();
  console.log("lockPeriod :", lockPeriod.words?.[0]);
  
  
  var blockNumber = await web3.eth.getBlockNumber();
  var block = await web3.eth.getBlock(blockNumber);
  var blockTimestamp = block.timestamp;
  console.log('Block Timestamp:', blockTimestamp);

  await advanceTimeAndBlock(120);

  blockNumber = await web3.eth.getBlockNumber();
  block = await web3.eth.getBlock(blockNumber);
  blockTimestamp = block.timestamp;
  console.log('Block Timestamp After Delay', blockTimestamp);

  const tx = await bank.withdraw({ from: user1 });
  console.log("Transaction withdraw :", tx);
  const user1WithdrawEvent = tx.logs.find((log) => log.event === "Withdraw");
  const user1Reward = user1WithdrawEvent.args.reward.toNumber();

   
  const totalStaked1 = await bank.getTotalStaked();
  console.log("totalStaked after withdraw of user1",totalStaked1.words?.[0]);


  // Withdraw and get rewards for User 2
  console.log("\n" + "====== Part : Withdraw And Rewards for User 2 ======" + "\n")

  blockNumber = await web3.eth.getBlockNumber();
  block = await web3.eth.getBlock(blockNumber);
  blockTimestamp = block.timestamp;
  console.log('Block Timestamp:', blockTimestamp);


  await advanceTimeAndBlock(60);

  blockNumber = await web3.eth.getBlockNumber();
  block = await web3.eth.getBlock(blockNumber);
  blockTimestamp = block.timestamp;
  console.log('Block Timestamp After Delay:', blockTimestamp);

  const tx2 = await bank.withdraw({ from: user2 });
  console.log("Transaction withdraw :", tx2);
  const user2WithdrawEvent = tx2.logs.find((log) => log.event === "Withdraw"); 
  const user2Reward = user2WithdrawEvent.args.reward.toNumber();

  // Display reward pool values after withdrawals
  console.log("\n" + "====== Recap Rewards ======" + "\n")

  const PoolEnd = await bank.getPool({ from: account1 });
 
  const R1Value_End = PoolEnd['0'].words?.[0];
  const R2Value_End = PoolEnd['1'].words?.[0]; 
  const R3Value_End = PoolEnd['2'].words?.[0]; 
  const totalStaked2 = await bank.getTotalStaked();

  console.log("totalStaked after withdraw of user2",totalStaked2.words?.[0]);
  console.log("user1Reward",user1Reward);
  console.log("user1Reward",user2Reward);
  console.log('R1 Pool value:', R1Value_End);
  console.log('R2 Pool value:', R2Value_End);
  console.log('R3 Pool value:', R3Value_End);
  
  // Display balances of Bank, User1, and User2 after withdrawals and rewards
  console.log("\n" + "====== Recap Balance Withdraw And Rewards ======" + "\n")
 
  const BankBalance_End = (await token.balanceOf(bank.address))/10**18;
  const User1Balance_End = (await token.balanceOf(user1))/10**18;
  const User2Balance_End = (await token.balanceOf(user2))/10**18;
  console.log("Bank Balance  : " + BankBalance_End);
	console.log("User1 Balance  : " + User1Balance_End);
  console.log("User2 Balance  : " + User2Balance_End);

  // Wait for some time and withdraw the remaining rewards from the Bank contract by the owner
  console.log("\n" + "====== End with the bank which withdraw the the remaining reward and Recap ======" + "\n")
  
  blockNumber = await web3.eth.getBlockNumber();
  block = await web3.eth.getBlock(blockNumber);
  blockTimestamp = block.timestamp;
  console.log('Block Timestamp:', blockTimestamp);


  await advanceTimeAndBlock(60);

  blockNumber = await web3.eth.getBlockNumber();
  block = await web3.eth.getBlock(blockNumber);
  blockTimestamp = block.timestamp;
  console.log('Block Timestamp After Delay:', blockTimestamp);
  
  // Calculate the remaining rewards and call withdrawBank function
  await token.approve(bank.address, R1Value_End + R2Value_End + R3Value_End, { from: account1 });
  const txF = await bank.withdrawBank({ from: account1 });
  console.log("Transaction withdrawBank:", txF);

  // Wait for the transaction to be mined and check if it was successful
  const receipt = await web3.eth.getTransactionReceipt(txF.tx);
  if (receipt.status) {
    console.log("Transaction successful");
  } else {
    console.log("Transaction failed");
  }

  // Another end where the bank owner removes tokens from the contract
  // console.log("\n" + "====== Another End with the bank owner remove tokens from the contract and Recap ======" + "\n")
  
  // blockNumber = await web3.eth.getBlockNumber();
  // block = await web3.eth.getBlock(blockNumber);
  // blockTimestamp = block.timestamp;
  // console.log('Block Timestamp:', blockTimestamp);


  // await advanceTimeAndBlock(120);

  // blockNumber = await web3.eth.getBlockNumber();
  // block = await web3.eth.getBlock(blockNumber);
  // blockTimestamp = block.timestamp;
  // console.log('Block Timestamp After Delay:', blockTimestamp);
  // await bank.BurnPool({ from: account1 });

  // Display balances after the owner withdraws the remaining rewards from the Bank contract
  console.log("\n" + "====== Recap Balance Withdraw And Rewards ======" + "\n")
  

  const BalanceOfOwner = (await token.balanceOf(account1))/10**18;
  console.log("Owner's balance :",BalanceOfOwner);
  const BankBalance_End_AfterBankW = (await token.balanceOf(bank.address))/10**18;
  const User1Balance_End_AfterBankW = (await token.balanceOf(user1))/10**18;
  const User2Balance_End_AfterBankW = (await token.balanceOf(user2))/10**18;
  console.log("Bank Balance  : " + BankBalance_End_AfterBankW);
	console.log("User1 Balance  : " + User1Balance_End_AfterBankW);
  console.log("User2 Balance  : " + User2Balance_End_AfterBankW);

  // Display reward pool values after the owner withdraws the remaining rewards from the Bank contract
  console.log("\n" + "====== Recap Pool after withdraw from the Bank ======" + "\n")

  const PoolEnd_Bank = await bank.getPool({ from: account1 });
 
  const R1Value_End_Bank = PoolEnd_Bank['0'].words?.[0];
  const R2Value_End_Bank = PoolEnd_Bank['1'].words?.[0]; 
  const R3Value_End_Bank = PoolEnd_Bank['2'].words?.[0]; 

  console.log('R1 Pool value:', R1Value_End_Bank);
  console.log('R2 Pool value:', R2Value_End_Bank);
  console.log('R3 Pool value:', R3Value_End_Bank);

}
