// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Metadata {
    function getName() external pure returns (string memory) {
        return "CoolGuy";
    }

    function getColor() external pure returns (uint8, uint8, uint8) {
        return (15, 23, 43);
    }
}