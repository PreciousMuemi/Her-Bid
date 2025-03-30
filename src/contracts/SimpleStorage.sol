
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    event DataStored(address indexed sender, uint256 data);

    function set(uint256 x) public {
        storedData = x;
        emit DataStored(msg.sender, x);
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
