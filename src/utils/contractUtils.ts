
import { ethers } from "ethers";
import { toast } from "sonner";

// ABI for SimpleStorage contract
const simpleStorageAbi = [
  {
    "inputs": [],
    "name": "get",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "x", "type": "uint256"}],
    "name": "set",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "data", "type": "uint256"}
    ],
    "name": "DataStored",
    "type": "event"
  }
];

// Get contract address from environment variable or use fallback
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export const getSimpleStorageContract = (provider: ethers.providers.Web3Provider) => {
  try {
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, simpleStorageAbi, signer);
  } catch (error) {
    console.error("Error creating contract instance:", error);
    toast.error("Failed to connect to contract");
    return null;
  }
};

export const getStoredValue = async (provider: ethers.providers.Web3Provider): Promise<number | null> => {
  try {
    const contract = getSimpleStorageContract(provider);
    if (!contract) return null;
    
    const value = await contract.get();
    return value.toNumber();
  } catch (error) {
    console.error("Error fetching stored value:", error);
    toast.error("Failed to fetch stored value");
    return null;
  }
};

export const setStoredValue = async (
  provider: ethers.providers.Web3Provider,
  value: number
): Promise<boolean> => {
  try {
    const contract = getSimpleStorageContract(provider);
    if (!contract) return false;
    
    const tx = await contract.set(value);
    toast.info("Transaction submitted, waiting for confirmation...");
    
    await tx.wait();
    toast.success("Value successfully updated");
    return true;
  } catch (error) {
    console.error("Error setting stored value:", error);
    toast.error("Failed to update value");
    return false;
  }
};
