// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";
import "@ganache/console.log/console.sol";

contract Bank is Ownable{
   
    address public creator;
    Token public token;
    uint256 public lockPeriod;
    uint256 public rewardPool;
    uint256 public totalStaked; 
 
    uint256 public rewardDistributed;



    uint256 public R1;
    uint256 public R2;
    uint256 public R3;

    uint256 public LastTime;

    bool private hasExecuted;

    struct User {
        uint256 depositAmount;
        uint256 TimeOfDeposit;
    }

    mapping(address => User) public users;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount, uint256 reward);
    event WithdrawBank(uint256 amount);

    modifier onlyCreator() {
        require(msg.sender == creator, "Only contract creator can call this function");
        _;
    }

    constructor(
        Token _token,
        uint256 _lockPeriod,
        uint256 _rewardPool
    ) {
        creator = msg.sender;
        token = _token;
        lockPeriod = _lockPeriod;
        rewardPool = _rewardPool;

        R1 = rewardPool * 20 / 100;
        R2 = rewardPool * 30 / 100;
        R3 = rewardPool * 50 / 100;

    }

    /**
     * @dev Initialize the reward pool by transferring tokens to the contract.
     * This function can only be called once by the contract creator.
     */
    function InitAddPoolInBank() public onlyCreator {
        require(!hasExecuted, "Just once.");
        
        require(token.transferFrom(msg.sender, address(this), rewardPool), "Failed to transfer tokens");
        
        hasExecuted = true;
    }

    /**
     * @dev We can re-pool the reward pool by transferring tokens to the contract.
     * @param amount The amount of tokens to transfer.
     */
    function RePool(uint256 amount) public onlyCreator {

        require(token.transferFrom(msg.sender, address(this), amount), "Failed to transfer tokens");
        rewardPool = amount;
    }

    /**
     * @dev Deposit tokens into the bank. Users can deposit only once.
     * @param amount The amount of tokens to deposit.
     */
    function deposit(uint256 amount) external {

        require(users[msg.sender].depositAmount == 0, "User already deposited");
        require(token.transferFrom(msg.sender, address(this), amount), "Failed to transfer tokens");
        users[msg.sender].depositAmount = amount;
        users[msg.sender].TimeOfDeposit = block.timestamp;

        LastTime = block.timestamp;

        totalStaked += amount;
        emit Deposit(msg.sender, amount);
    }

   /**
     * @dev Withdraw deposited tokens along with the reward, if applicable.
     * Users can withdraw only after a specified lock period.
     */
    function withdraw() external {
        require(users[msg.sender].depositAmount > 0, "User hasn't deposited");
        require(block.timestamp >= users[msg.sender].TimeOfDeposit + (lockPeriod * 2), "Tokens are locked, transaction refused");

        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = users[msg.sender].depositAmount + reward;

        totalStaked = totalStaked - users[msg.sender].depositAmount;
        delete users[msg.sender];

        require(token.transfer(msg.sender, totalAmount), "Failed to transfer tokens");
        rewardDistributed += reward; 


        emit Withdraw(msg.sender, users[msg.sender].depositAmount, reward);
    }

    /**
     * @dev Calculate the reward for a user based on their deposit amount and the current reward pool distribution.
     * @param user The user's address.
     * @return The reward amount.
     */
    function calculateReward(address user) private returns (uint256) {
        uint256 _totalStaked = getTotalStaked();
        uint256 userDeposit = users[user].depositAmount;

        if (block.timestamp >= users[user].TimeOfDeposit + (lockPeriod * 4)) {

            uint256 reward = R3 * userDeposit / _totalStaked;
            R3 = R3 - reward;
            reward = reward + (R1 * userDeposit / _totalStaked) + (R2 * userDeposit / _totalStaked);
            //reward = reward + (R1 + R2) * userDeposit / _totalStaked;
            R1 = R1 - (R1 * userDeposit / _totalStaked);
            R2 = R2 - (R2 * userDeposit / _totalStaked);

            return reward;
        } else if (block.timestamp >= users[user].TimeOfDeposit + (lockPeriod * 3)) {

            uint256 reward = R2 * userDeposit / _totalStaked;
            R2 = R2 - reward;
            reward = reward + (R1 * userDeposit / _totalStaked);
            R1 = R1 - (R1 * userDeposit / _totalStaked);
            return reward;

        } else if (block.timestamp >= users[user].TimeOfDeposit + (lockPeriod * 2)) {

            uint256 reward = R1 * userDeposit / _totalStaked;
            R1 = R1 - reward;

            return reward;

        }else {

            return 0;
        }
    }

    /**
     * @dev Get the total staked amount in the bank.
     * @return The total staked amount.
     */
    function getTotalStaked() public view returns (uint256) {
        return totalStaked;
    }

    /**
     * @dev Get the current reward pool distribution.
     * @return The rewards R1, R2, and R3.
     */
    function getPool() public view returns (uint256,uint256,uint256) {
        return (R1,R2,R3);
    }

    /**
     * @dev Get the total reward distributed to users.
     * @return The total reward distributed.
     */
    function getrewardDistributed() public view returns (uint256) {
        return rewardDistributed;
    }

    /**
     * @dev Get the deposit details of a user.
     * @param user The user's address.
     * @return usercaract The User struct containing depositAmount and TimeOfDeposit.
     */
    function ReturnUser(address user) view external returns (User memory usercaract){
        usercaract = users[user];
        return usercaract;
    }


    /**
     * @dev Withdraw remaining reward from the bank.
     * This function can only be called by the contract creator after a specified lock period.
     */
     function withdrawBank() public onlyCreator {

        require(block.timestamp >= LastTime + (lockPeriod * 4), "T0 + 4T not reached yet.");

        uint256 Remainingreward = R1 + R2 + R3;
        require(token.transferFrom(address(token),address(this), Remainingreward), "Token transfer failed");


        R1 = 0;
        R2 = 0; 
        R3 = 0;
        
        emit WithdrawBank(Remainingreward);
    }


    /**
     * @dev Burn remaining reward from the bank.
     * This function can only be called by the contract creator after a specified lock period.
     */
    function BurnPool() public onlyCreator {

        require(block.timestamp >= LastTime + (lockPeriod * 5), "T0 + 5T not reached yet.");

        uint256 Remainingreward = R1 + R2 + R3;
        token.burn(address(this), Remainingreward);


        R1 = 0;
        R2 = 0; 
        R3 = 0;
        
        emit WithdrawBank(Remainingreward);
    }

}
