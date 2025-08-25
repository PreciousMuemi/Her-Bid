
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { toast } from "react-hot-toast";
import { executeMoveFunction, callMoveFunction, validateSuiAddress } from './suiUtils';

// Get package and module info from environment variables
const USER_REGISTRY_PACKAGE = import.meta.env.VITE_USER_REGISTRY_PACKAGE || "";
const USER_REGISTRY_MODULE = "user_registry";
// Check if a user exists using Sui client
export const checkUserExistsSui = async (client: SuiClient, address: string): Promise<boolean> => {
  try {
    if (!USER_REGISTRY_PACKAGE) {
      console.warn("User registry package ID not configured");
      return false;
    }

    const validAddress = validateSuiAddress(address);
    
    const result = await callMoveFunction(
      client,
      validAddress,
      USER_REGISTRY_PACKAGE,
      USER_REGISTRY_MODULE,
      "user_exists",
      [validAddress]
    );
    
    // Parse the result to get the boolean value
    if (result.results && result.results[0] && result.results[0].returnValues) {
      const returnValue = result.results[0].returnValues[0];
      return returnValue[0] === 1; // Move returns 1 for true, 0 for false
    }
    
    return false;
  } catch (error) {
    console.error("Error checking user existence (Sui):", error);
    toast.error("Failed to verify user account");
    throw error;
  }
};

// Register user using Sui client
export const registerUserSui = async (
  client: SuiClient,
  keypair: Ed25519Keypair,
  formData: { businessName: string; email: string; industry: string; skills: string }
): Promise<boolean> => {
  try {
    if (!USER_REGISTRY_PACKAGE) {
      console.warn("User registry package ID not configured");
      toast.error("User registry not configured");
      return false;
    }

    const result = await executeMoveFunction(
      client,
      keypair,
      USER_REGISTRY_PACKAGE,
      USER_REGISTRY_MODULE,
      "register_user",
      [
        formData.businessName,
        formData.email,
        formData.industry,
        formData.skills
      ]
    );
    
    if (result.effects?.status?.status === 'success') {
      toast.success("User registered successfully");
      return true;
    } else {
      console.error("Registration failed:", result.effects?.status?.error);
      toast.error("Failed to register user");
      return false;
    }
  } catch (error) {
    console.error("Error registering user (Sui):", error);
    toast.error("Failed to register user");
    throw error;
  }
};

// Get user profile using Sui client
export const getUserProfileSui = async (
  client: SuiClient,
  address: string
): Promise<{
  businessName: string;
  email: string;
  industry: string;
  skills: string;
} | null> => {
  try {
    if (!USER_REGISTRY_PACKAGE) {
      console.warn("User registry package ID not configured");
      return null;
    }

    const validAddress = validateSuiAddress(address);
    
    const result = await callMoveFunction(
      client,
      validAddress,
      USER_REGISTRY_PACKAGE,
      USER_REGISTRY_MODULE,
      "get_user_profile",
      [validAddress]
    );
    
    // Parse the result to get the user profile
    if (result.results && result.results[0] && result.results[0].returnValues) {
      const returnValues = result.results[0].returnValues;
      
      if (returnValues.length >= 4) {
        return {
          businessName: returnValues[0][1], // Assuming string values are at index 1
          email: returnValues[1][1],
          industry: returnValues[2][1],
          skills: returnValues[3][1]
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user profile (Sui):", error);
    toast.error("Failed to get user profile");
    throw error;
  }
};

// Check if a user is verified using Sui client
export const checkUserVerifiedSui = async (client: SuiClient, address: string): Promise<boolean> => {
  try {
    if (!USER_REGISTRY_PACKAGE) {
      console.warn("User registry package ID not configured");
      return false;
    }

    const validAddress = validateSuiAddress(address);
    
    const result = await callMoveFunction(
      client,
      validAddress,
      USER_REGISTRY_PACKAGE,
      USER_REGISTRY_MODULE,
      "is_user_verified",
      [validAddress]
    );
    
    // Parse the result to get the boolean value
    if (result.results && result.results[0] && result.results[0].returnValues) {
      const returnValue = result.results[0].returnValues[0];
      return returnValue[0] === 1; // Move returns 1 for true, 0 for false
    }
    
    return false;
  } catch (error) {
    console.error("Error checking user verification (Sui):", error);
    toast.error("Failed to check user verification status");
    throw error;
  }
};

// Verify a user using Sui client (admin function)
export const verifyUserSui = async (
  client: SuiClient,
  adminKeypair: Ed25519Keypair,
  userAddress: string
): Promise<boolean> => {
  try {
    if (!USER_REGISTRY_PACKAGE) {
      console.warn("User registry package ID not configured");
      toast.error("User registry not configured");
      return false;
    }

    const validAddress = validateSuiAddress(userAddress);
    
    const result = await executeMoveFunction(
      client,
      adminKeypair,
      USER_REGISTRY_PACKAGE,
      USER_REGISTRY_MODULE,
      "verify_user",
      [validAddress]
    );
    
    if (result.effects?.status?.status === 'success') {
      toast.success("User verified successfully");
      return true;
    } else {
      console.error("Verification failed:", result.effects?.status?.error);
      toast.error("Failed to verify user");
      return false;
    }
  } catch (error) {
    console.error("Error verifying user (Sui):", error);
    toast.error("Failed to verify user");
    throw error;
  }
};