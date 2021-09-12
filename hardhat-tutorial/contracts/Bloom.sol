// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinter.sol";

contract Bloom is ERC1155PresetMinter {
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
    ) ERC1155PresetMinter(uri) {
        _treasurer = treasurer_;
        _fee = fee_;
        _name = name_;
        _symbol = symbol_;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }

    function treasurer() external view returns (address) {
        return _treasurer;
    }

    function fee() external view returns (uint256) {
        return _fee;
    }

    function setTreasurer(address payable nextTreasurer) public onlyAuthorized {
        _treasurer = nextTreasurer;
    }

    function setFee(uint256 nextFee) public onlyAuthorized {
        _fee = nextFee;
    }

    function purchase(address to, uint256 id) public payable {
        require(msg.value >= _fee, "Bloom: 402");
        _treasurer.transfer(msg.value);
        _mint(to, id, 1, "");
    }
}