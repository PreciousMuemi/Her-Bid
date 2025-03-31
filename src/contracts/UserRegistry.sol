
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    struct UserProfile {
        string businessName;
        string email;
        string industry;
        string skills;
        uint256 createdAt;
    }
    
    mapping(address => UserProfile) public users;
    mapping(address => bool) public registeredUsers;
    
    event UserRegistered(address userAddress, string businessName);
    
    function registerUser(
        string memory businessName,
        string memory email,
        string memory industry,
        string memory skills
    ) external {
        require(!registeredUsers[msg.sender], "Already registered");
        
        users[msg.sender] = UserProfile(
            businessName,
            email,
            industry,
            skills,
            block.timestamp
        );
        
        registeredUsers[msg.sender] = true;
        
        emit UserRegistered(msg.sender, businessName);
    }
    
    function verifyUser(address userAddress) external view returns (bool) {
        return registeredUsers[userAddress];
    }
    
    function getUserProfile(address userAddress) external view 
        returns (string memory, string memory, string memory, string memory) {
        require(registeredUsers[userAddress], "User not registered");
        
        UserProfile memory profile = users[userAddress];
        return (
            profile.businessName,
            profile.email,
            profile.industry,
            profile.skills
        );
    }
}
