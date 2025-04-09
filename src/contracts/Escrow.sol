// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public issuer;
    address public freelancer;
    uint256 public amount;
    bool public fundsReleased;
    bool public inDispute;

    constructor(address _freelancer) payable {
        issuer = msg.sender;
        freelancer = _freelancer;
        amount = msg.value;
        fundsReleased = false;
        inDispute = false;
    }

    function releaseFunds() public {
        require(msg.sender == issuer, "Only issuer can release funds");
        require(!inDispute, "Cannot release during dispute");
        payable(freelancer).transfer(amount);
        fundsReleased = true;
    }

    function initiateDispute() public {
        require(msg.sender == issuer || msg.sender == freelancer, "Unauthorized");
        inDispute = true;
    }

    function resolveDispute(bool payFreelancer) public {
        require(inDispute, "No active dispute");
        if(payFreelancer) {
            payable(freelancer).transfer(amount);
        } else {
            payable(issuer).transfer(amount);
        }
        fundsReleased = true;
    }
}
