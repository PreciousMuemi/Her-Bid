
import { ethers } from "ethers";
import { Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, ContractId } from "@hashgraph/sdk";
import { toast } from "sonner";

// ABI for UserRegistry contract
const userRegistryAbi = [
  {
    "inputs": [
      {"internalType": "string", "name": "businessName", "type": "string"},
      {"internalType": "string", "name": "email", "type": "string"},
      {"internalType": "string", "name": "industry", "type": "string"},
      {"internalType": "string", "name": "skills", "type": "string"}
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "verifyUser",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "getUserProfile",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "string", "name": "", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "userAddress", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "businessName", "type": "string"}
    ],
    "name": "UserRegistered",
    "type": "event"
  }
];

// Get contract address from environment variable
const USER_REGISTRY_CONTRACT = import.meta.env.VITE_USER_REGISTRY_CONTRACT || "0x0000000000000000000000000000000000000000";

// Check if a user exists using Ethereum provider
export const checkUserExistsEth = async (provider: ethers.providers.Web3Provider, address: string): Promise<boolean> => {
  try {
    const contract = new ethers.Contract(USER_REGISTRY_CONTRACT, userRegistryAbi, provider);
    return await contract.verifyUser(address);
  } catch (error) {
    console.error("Error checking user existence (ETH):", error);
    toast.error("Failed to verify user account");
    throw error;
  }
};

// Register user using Ethereum provider
export const registerUserEth = async (
  provider: ethers.providers.Web3Provider,
  formData: { businessName: string; email: string; industry: string; skills: string }
): Promise<boolean> => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(USER_REGISTRY_CONTRACT, userRegistryAbi, signer);
    
    const tx = await contract.registerUser(
      formData.businessName,
      formData.email,
      formData.industry,
      formData.skills
    );
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error registering user (ETH):", error);
    toast.error("Failed to register user");
    throw error;
  }
};

// Check if a user exists using Hedera client
export const checkUserExistsHedera = async (client: Client, accountId: string): Promise<boolean> => {
  try {
    const contractId = ContractId.fromString(USER_REGISTRY_CONTRACT.replace('0x', ''));
    
    // Convert Hedera account ID to EVM address if needed
    const evmAddress = accountId.startsWith('0x') ? accountId : await convertHederaToEVMAddress(accountId);
    
    const query = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction("verifyUser", new ContractFunctionParameters().addAddress(evmAddress));
    
    const response = await query.execute(client);
    return response.getBool(0);
  } catch (error) {
    console.error("Error checking user existence (Hedera):", error);
    toast.error("Failed to verify user account");
    throw error;
  }
};

// Register user using Hedera client
export const registerUserHedera = async (
  client: Client, 
  accountId: string,
  formData: { businessName: string; email: string; industry: string; skills: string }
): Promise<boolean> => {
  try {
    const contractId = ContractId.fromString(USER_REGISTRY_CONTRACT.replace('0x', ''));
    
    // Convert Hedera account ID to EVM address if needed
    const evmAddress = accountId.startsWith('0x') ? accountId : await convertHederaToEVMAddress(accountId);
    
    const transaction = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(300000)
      .setFunction(
        "registerUser", 
        new ContractFunctionParameters()
          .addString(formData.businessName)
          .addString(formData.email)
          .addString(formData.industry)
          .addString(formData.skills)
      );
    
    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    return receipt.status.toString() === "SUCCESS";
  } catch (error) {
    console.error("Error registering user (Hedera):", error);
    toast.error("Failed to register user");
    throw error;
  }
};

// Helper function to convert Hedera account ID to EVM address
export const convertHederaToEVMAddress = async (accountId: string): Promise<string> => {
  try {
    // This is a placeholder - in a real app you would:
    // 1. Use the Mirror Node API to get the EVM address of a Hedera account
    // 2. OR use SDK utility functions like AccountId.fromString(accountId).toSolidityAddress()
    
    const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`);
    if (!response.ok) throw new Error("Failed to fetch account information");
    
    const data = await response.json();
    return data.evm_address || `0x${accountId.replace(/\D/g, '')}`;
  } catch (error) {
    console.error("Error converting Hedera ID to EVM address:", error);
    throw error;
  }
};

// Helper function to convert EVM address to Hedera account ID
export const convertEVMToHederaId = async (evmAddress: string): Promise<string> => {
  try {
    const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts?evm_address=${evmAddress}`);
    if (!response.ok) throw new Error("Failed to fetch account information");
    
    const data = await response.json();
    if (data.accounts && data.accounts.length > 0) {
      return data.accounts[0].account;
    }
    
    throw new Error("No Hedera account found for this EVM address");
  } catch (error) {
    console.error("Error converting EVM address to Hedera ID:", error);
    throw error;
  }
};
