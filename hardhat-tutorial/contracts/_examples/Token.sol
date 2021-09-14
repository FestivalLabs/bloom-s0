// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Token
 * @author stickykeys.eth
 * @notice Val's token contract
 */
contract Token {
    string public name;
    string public symbol;

    // units are in wei
    uint256 public totalSupply = 21000000000000000000000000;

    address public owner;

    mapping(address => uint256) public balances;

    constructor(string memory inputName, string memory inputSymbol) {
        name = inputName;
        symbol = inputSymbol;
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * @notice Sends the specified amount of tokens to the given recipient
     * @dev Sender must have the balance they are trying to transfer.
     * Emits an event describing the amount transferred.
     * @param to Address of the recipient
     * @param amount Amount of tokens to transfer
     */
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

}
