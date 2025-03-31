// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./HederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract ConsortiumContract is HederaTokenService {
    // Member structure
    struct Member {
        address account;
        string name;
        string businessType;
        uint256 reputationScore;
        bool exists;
    }
    
    // Proposal structure
    struct Proposal {
        string description;
        uint256 amount;
        address payable recipient;
        uint256 approvalCount;
        mapping(address => bool) approvals;
        bool executed;
        bool exists;
    }
    
    // Contract variables
    string public consortiumName;
    address public tokenAddress;
    address[] public memberList;
    mapping(address => Member) public members;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public requiredApprovals;
    
    // Events
    event MemberAdded(address indexed account, string name);
    event MemberRemoved(address indexed account);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 amount);
    event ProposalApproved(uint256 indexed proposalId, address indexed approver);
    event ProposalExecuted(uint256 indexed proposalId);
    
    // Constructor
    constructor(string memory _name, address _tokenAddress, uint256 _requiredApprovals) {
        consortiumName = _name;
        tokenAddress = _tokenAddress;
        requiredApprovals = _requiredApprovals;
        
        // Add creator as first member
        addMember(msg.sender, "Founder", "Administrator");
    }
    
    // Add a new member
    function addMember(address _account, string memory _name, string memory _businessType) public {
        require(!members[_account].exists, "Member already exists");
        
        // First member can be added without approval, others need approval
        if (memberList.length > 0) {
            require(members[msg.sender].exists, "Only members can add new members");
        }
        
        members[_account] = Member({
            account: _account,
            name: _name,
            businessType: _businessType,
            reputationScore: 100,
            exists: true
        });
        
        memberList.push(_account);
        emit MemberAdded(_account, _name);
    }
    
    // Remove a member
    function removeMember(address _account) public {
        require(members[msg.sender].exists, "Only members can remove members");
        require(members[_account].exists, "Member does not exist");
        require(_account != msg.sender, "Cannot remove yourself");
        
        // Remove from mapping
        delete members[_account];
        
        // Remove from array
        for (uint i = 0; i < memberList.length; i++) {
            if (memberList[i] == _account) {
                memberList[i] = memberList[memberList.length - 1];
                memberList.pop();
                break;
            }
        }
        
        emit MemberRemoved(_account);
    }
    
    // Create a new proposal
    function createProposal(string memory _description, uint256 _amount, address payable _recipient) public returns (uint256) {
        require(members[msg.sender].exists, "Only members can create proposals");
        
        uint256 proposalId = proposalCount++;
        Proposal storage newProposal = proposals[proposalId];
        
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.recipient = _recipient;
        newProposal.approvalCount = 0;
        newProposal.executed = false;
        newProposal.exists = true;
        
        emit ProposalCreated(proposalId, _description, _amount);
        return proposalId;
    }
    
    // Approve a proposal
    function approveProposal(uint256 _proposalId) public {
        require(members[msg.sender].exists, "Only members can approve proposals");
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(!proposals[_proposalId].approvals[msg.sender], "Already approved this proposal");
        
        Proposal storage proposal = proposals[_proposalId];
        proposal.approvals[msg.sender] = true;
        proposal.approvalCount++;
        
        emit ProposalApproved(_proposalId, msg.sender);
        
        // Execute automatically if enough approvals
        if (proposal.approvalCount >= requiredApprovals) {
            executeProposal(_proposalId);
        }
    }
    
    // Execute a proposal
    function executeProposal(uint256 _proposalId) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].executed, "Proposal already executed");
        require(proposals[_proposalId].approvalCount >= requiredApprovals, "Not enough approvals");
        
        Proposal storage proposal = proposals[_proposalId];
        proposal.executed = true;
        
        // Transfer tokens from contract to recipient
        int response = HederaTokenService.transferToken(
            tokenAddress, 
            address(this), 
            proposal.recipient, 
            proposal.amount
        );
        
        if (response != HederaResponseCodes.SUCCESS
All feedback is reviewed by the team.
continue
I'll continue with the ConsortiumContract implementation and provide the remaining components for your HerBid platform:

if (response != HederaResponseCodes.SUCCESS) {
            revert("Failed to transfer tokens");
        }
        
        emit ProposalExecuted(_proposalId);
    }
    
    // Update member reputation score
    function updateReputation(address _member, uint256 _newScore) public {
        require(members[msg.sender].exists, "Only members can update reputation");
        require(members[_member].exists, "Member does not exist");
        require(_newScore >= 0 && _newScore <= 1000, "Score must be between 0 and 1000");
        
        members[_member].reputationScore = _newScore;
    }
    
    // Get member count
    function getMemberCount() public view returns (uint256) {
        return memberList.length;
    }
    
    // Get all members
    function getAllMembers() public view returns (address[] memory) {
        return memberList;
    }
}
