// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./HederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract EscrowContract is HederaTokenService {
    // Milestone status
    enum Status { Created, Funded, Completed, Released, Disputed, Resolved }
    
    // Milestone structure
    struct Milestone {
        string description;
        uint256 amount;
        address payable recipient;
        Status status;
        uint256 deadline;
        bool exists;
    }
    
    // Contract variables
    address public owner;
    address public tokenAddress;
    mapping(uint256 => Milestone) public milestones;
    uint256 public milestoneCount;
    
    // Events
    event MilestoneCreated(uint256 id, string description, uint256 amount, address recipient, uint256 deadline);
    event MilestoneFunded(uint256 id, uint256 amount);
    event MilestoneCompleted(uint256 id);
    event MilestoneReleased(uint256 id, uint256 amount, address recipient);
    event MilestoneDisputed(uint256 id);
    event MilestoneResolved(uint256 id, bool fundReleased);
    
    // Constructor
    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }
    
    // Create a new milestone
    function createMilestone(
        string memory description,
        uint256 amount,
        address payable recipient,
        uint256 durationDays
    ) public returns (uint256) {
        require(msg.sender == owner, "Only owner can create milestones");
        
        uint256 id = milestoneCount++;
        uint256 deadline = block.timestamp + (durationDays * 1 days);
        
        milestones[id] = Milestone({
            description: description,
            amount: amount,
            recipient: recipient,
            status: Status.Created,
            deadline: deadline,
            exists: true
        });
        
        emit MilestoneCreated(id, description, amount, recipient, deadline);
        return id;
    }
    
    // Fund a milestone with tokens
    function fundMilestone(uint256 id, uint256 amount) public {
        require(milestones[id].exists, "Milestone does not exist");
        require(milestones[id].status == Status.Created, "Milestone is not in Created status");
        
        // Transfer tokens from sender to this contract
        int response = HederaTokenService.transferToken(tokenAddress, msg.sender, address(this), amount);
        
        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to transfer tokens");
        }
        
        milestones[id].status = Status.Funded;
        emit MilestoneFunded(id, amount);
    }
    
    // Mark milestone as completed (by recipient)
    function completeMilestone(uint256 id) public {
        require(milestones[id].exists, "Milestone does not exist");
        require(milestones[id].status == Status.Funded, "Milestone is not funded");
        require(msg.sender == milestones[id].recipient, "Only recipient can mark as completed");
        
        milestones[id].status = Status.Completed;
        emit MilestoneCompleted(id);
    }
    
    // Release funds for a milestone (by owner)
    function releaseFunds(uint256 id) public {
        require(msg.sender == owner, "Only owner can release funds");
        require(milestones[id].exists, "Milestone does not exist");
        require(milestones[id].status == Status.Completed, "Milestone is not completed");
        
        Milestone storage milestone = milestones[id];
        
        // Transfer tokens from contract to recipient
        int response = HederaTokenService.transferToken(
            tokenAddress, 
            address(this), 
            milestone.recipient, 
            milestone.amount
        );
        
        if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to transfer tokens");
        }
        
        milestone.status = Status.Released;
        emit MilestoneReleased(id, milestone.amount, milestone.recipient);
    }
    
    // Dispute a milestone (by owner)
    function disputeMilestone(uint256 id) public {
        require(msg.sender == owner, "Only owner can dispute");
        require(milestones[id].exists, "Milestone does not exist");
        require(milestones[id].status == Status.Completed, "Milestone is not completed");
        
        milestones[id].status = Status.Disputed;
        emit MilestoneDisputed(id);
    }
    
    // Resolve a dispute (by owner)
    function resolveDispute(uint256 id, bool releaseFunds) public {
        require(msg.sender == owner, "Only owner can resolve disputes");
        require(milestones[id].exists, "Milestone does not exist");
        require(milestones[id].status == Status.Disputed, "Milestone is not disputed");
        
        Milestone storage milestone = milestones[id];
        
        if (releaseFunds) {
            // Transfer tokens from contract to recipient
            int response = HederaTokenService.transferToken(
                tokenAddress, 
                address(this), 
                milestone.recipient, 
                milestone.amount
            );
            
            if (response != HederaResponseCodes.SUCCESS) {
                revert("Failed to transfer tokens");
            }
            
            milestone.status = Status.Released;
        } else {
            // Return tokens to owner
            int response = HederaTokenService.transferToken(
                tokenAddress, 
                address(this), 
                payable(owner), 
                milestone.amount
            );
            
            if (response != HederaResponseCodes.SUCCESS) {
                revert("Failed to transfer tokens");
            }
            
            milestone.status = Status.Resolved;
        }
        
        emit MilestoneResolved(id, releaseFunds);
    }
}
