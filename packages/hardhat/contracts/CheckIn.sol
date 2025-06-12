//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface IBatchRegistry {
    function checkIn() external;
}

import "@openzeppelin/contracts/access/Ownable.sol";

contract CheckIn is Ownable {
    IBatchRegistry public batchRegistry;

    constructor(address _batchRegistry) Ownable(msg.sender) {
        batchRegistry = IBatchRegistry(_batchRegistry);
    }

    function checkInToBatch() external onlyOwner {
        batchRegistry.checkIn();
    }
}
