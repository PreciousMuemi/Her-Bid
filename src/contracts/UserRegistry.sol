// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    struct Contract {
        string title;
        string description;
        uint256 budget;
        uint256 deadline;
        string[] skillsRequired;
        address issuer;
        bool isActive;
    }

    Contract[] public contracts;

    constructor() {}

    function createContract(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _deadline,
        string[] memory _skillsRequired
    ) public {
        contracts.push(Contract({
            title: _title,
            description: _description,
            budget: _budget,
            deadline: _deadline,
            skillsRequired: _skillsRequired,
            issuer: msg.sender,
            isActive: true
        }));
    }

    function acceptBid(uint256 contractIndex, uint256 bidIndex) public {
        require(contractIndex < contracts.length, "Invalid contract index");
        require(msg.sender == contracts[contractIndex].issuer, "Only issuer can accept bids");
        require(bidIndex < contracts[contractIndex].bids.length, "Invalid bid index");
        
        contracts[contractIndex].acceptedBid = bidIndex;
        contracts[contractIndex].status = "active";
    }

    function getContractCount() public view returns (uint256) {
        return contracts.length;
    }

    function getContractDetails(uint256 index) public view returns (
        string memory,
        string memory,
        uint256,
        uint256,
        string[] memory,
        address,
        bool
    ) {
        Contract memory c = contracts[index];
        return (
            c.title,
            c.description,
            c.budget,
            c.deadline,
            c.skillsRequired,
            c.issuer,
            c.isActive
        );
    }
}
