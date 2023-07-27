// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Token
 * @dev A basic ERC20 token contract with additional functionalities.
 */
contract Token is ERC20 {


  address public creator;
  address public bank;

  event DenyTransfer(address recipient, uint256 amount);
  event DenyTransferFrom(address sender, address recipient, uint256 amount);

    /**
     * @dev Contract constructor.
     * Sets the initial token supply and mints tokens to the contract creator and the contract itself.
     */
    constructor() ERC20("Token", "XYZ") {
          creator = msg.sender;
          uint256 billion = 10000 * (10**9);
          uint256 TotalSupply = billion * (10**18);
          _mint(msg.sender, TotalSupply);
          _mint(address(this), TotalSupply);
    }


    modifier onlyOwner() {
        require(msg.sender == creator || msg.sender == bank, "Only creator and the bank can call this function");
        _;
    }

    /**
     * @dev Hook that is called after any token transfer.
     * @param from The address from which tokens are transferred.
     * @param to The address to which tokens are transferred.
     * @param amount The amount of tokens being transferred.
     */
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20) {
        //require(whitelist[msg.sender], "You need to be whitelisted");
        super._afterTokenTransfer(from, to, amount * (10 ** 18));
    }

    /**
     * @dev Mints tokens to the specified address.
     * @param to The address to which tokens are minted.
     * @param amount The amount of tokens to be minted.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        //require(amount <= 500, "Do not cheat");
        _mint(to, amount * (10 ** 18));
    }

    /**
     * @dev Burns tokens from the specified address.
     * @param account The address from which tokens are burned.
     * @param amount The amount of tokens to be burned.
     */
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount * (10 ** 18));
    }

    /**
     * @dev Overrides ERC20 transfer function to restrict transfers to only the contract owner.
     * @param recipient The address to which tokens are transferred.
     * @param amount The amount of tokens to be transferred.
     * @return A boolean value indicating whether the transfer was successful or not.
     */
    function transfer(address recipient, uint256 amount) public override onlyOwner returns (bool) {
        _transfer(msg.sender, recipient, amount * (10 ** 18));
        emit DenyTransfer(recipient, amount * (10 ** 18));
        return true;
    }

    /**
     * @dev Overrides ERC20 transferFrom function to restrict transfers from only the contract owner.
     * @param sender The address from which tokens are transferred.
     * @param recipient The address to which tokens are transferred.
     * @param amount The amount of tokens to be transferred.
     * @return A boolean value indicating whether the transfer was successful or not.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override onlyOwner returns (bool) {
        _transfer(sender, recipient, amount * (10 ** 18));
        emit DenyTransferFrom(sender, recipient, amount * (10 ** 18));
        return true;
    }

    /**
     * @dev Adds the bank address which will be allowed to perform certain actions.
     * @param _addressToKing The address of the bank to be added.
     */
    function addBank(address _addressToKing) public onlyOwner {
        bank = _addressToKing;
    }

}