// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./stickykeys.eth/ERC1155MinterBurnerPauser.sol";

contract Bloom is ERC1155MinterBurnerPauser {
    address payable private _treasurer;
    uint256 private _fee;
    string private _name;
    string private _symbol;

    constructor(
        address payable treasurer_,
        uint256 fee_,
        string memory uri,
        string memory name_,
        string memory symbol_
    ) ERC1155MinterBurnerPauser(uri) {
        _treasurer = treasurer_;
        _fee = fee_;
        _name = name_;
        _symbol = symbol_;
    }

    function version() external pure override returns (string memory) {
        return "1.0.0";
    }

    /**
     * @notice Returns the name of this token collection.
     * @return String.
     */
    function name() external view returns (string memory) {
        return _name;
    }

    /**
     * @notice Returns the symbol of this token collection.
     * @return String.
     */
    function symbol() external view returns (string memory) {
        return _symbol;
    }

    /**
     * @notice Returns the treasurer account.
     * @dev All ETH paid via `purchase` gets immediately transfered to this
     * account.
     * @return Ethereum account address.
     */
    function treasurer() external view returns (address) {
        return _treasurer;
    }

    /**
     * @notice Returns the fee for token purchases.
     * @dev Fee is the minimum amount of ETH required to execute `purchase`.
     * @return Amount in wei.
     */
    function fee() external view returns (uint256) {
        return _fee;
    }

    /**
     * @notice Sets the treasurer account
     * @dev All ETH paid via `purchase` gets immediately transfered to this
     * account.
     *
     * @custom:warning
     * ===============
     * Treasurer is a trusted address and
     * does not operate with a withdrawl model. Be careful when setting this to
     * a contract account.
     *
     * @custom:require Only authorized accounts can execute this method.
     * @param nextTreasurer Payable account to replace the current treasurer.
     */
    function setTreasurer(address payable nextTreasurer) public onlyAuthorized {
        _treasurer = nextTreasurer;
    }

    /**
     * @notice Sets the fee for token purchases.
     * @custom:require Only authorized accounts can execute this method.
     * @param nextFee Amount of wei to replace the current fee.
     */
    function setFee(uint256 nextFee) public onlyAuthorized {
        _fee = nextFee;
    }

    /**
     * @notice Purchases an NFT of the given id.
     * @dev Requires an ETH payment then transfers those funds to the treasurer
     * before minting 1 token with id `id` assigned to account `to`.
     *
     * @custom:warning
     * ===============
     * Treasurer is a trusted address and
     * does not operate with a withdrawl model. All ETH paid gets immediately
     * sent to the treasurer account via `transfer`.
     *
     * @custom:require ETH payment (`msg.value`) of at least the `_fee` amount.
     * @param to Account to send minted NFT to.
     * @param id Id of NFT to mint.
     */
    function purchase(address to, uint256 id) public payable {
        require(msg.value >= _fee, "Bloom: 402");
        _treasurer.transfer(msg.value);
        _mint(to, id, 1, "");
    }
}