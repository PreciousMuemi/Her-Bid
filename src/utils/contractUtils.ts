
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { toast } from "sonner";
import { executeMoveFunction, callMoveFunction } from './suiUtils';

// Get contract package and module info from environment variables
const SIMPLE_STORAGE_PACKAGE = import.meta.env.VITE_SIMPLE_STORAGE_PACKAGE || "";
const SIMPLE_STORAGE_MODULE = "simple_storage";

// Simple storage contract functions for Sui

export const getStoredValue = async (client: SuiClient, objectId: string): Promise<number | null> => {
  try {
    if (!SIMPLE_STORAGE_PACKAGE) {
      console.warn("Simple storage package ID not configured");
      return null;
    }
    
    const result = await callMoveFunction(
      client,
      objectId,
      SIMPLE_STORAGE_PACKAGE,
      SIMPLE_STORAGE_MODULE,
      "get_value",
      []
    );
    
    // Parse the result to get the stored value
    if (result.results && result.results[0] && result.results[0].returnValues) {
      const returnValue = result.results[0].returnValues[0];
      return Number(returnValue[0]); // Convert to number
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching stored value:", error);
    toast.error("Failed to fetch stored value");
    return null;
  }
};

export const setStoredValue = async (
  client: SuiClient,
  keypair: Ed25519Keypair,
  objectId: string,
  value: number
): Promise<boolean> => {
  try {
    if (!SIMPLE_STORAGE_PACKAGE) {
      console.warn("Simple storage package ID not configured");
      toast.error("Simple storage contract not configured");
      return false;
    }
    
    const result = await executeMoveFunction(
      client,
      keypair,
      SIMPLE_STORAGE_PACKAGE,
      SIMPLE_STORAGE_MODULE,
      "set_value",
      [objectId, value.toString()]
    );
    
    if (result.effects?.status?.status === 'success') {
      toast.success("Value successfully updated");
      return true;
    } else {
      console.error("Update failed:", result.effects?.status?.error);
      toast.error("Failed to update value");
      return false;
    }
  } catch (error) {
    console.error("Error setting stored value:", error);
    toast.error("Failed to update value");
    return false;
  }
};

export const createSimpleStorage = async (
  client: SuiClient,
  keypair: Ed25519Keypair,
  initialValue: number = 0
): Promise<string | null> => {
  try {
    if (!SIMPLE_STORAGE_PACKAGE) {
      console.warn("Simple storage package ID not configured");
      toast.error("Simple storage contract not configured");
      return null;
    }
    
    const result = await executeMoveFunction(
      client,
      keypair,
      SIMPLE_STORAGE_PACKAGE,
      SIMPLE_STORAGE_MODULE,
      "create_storage",
      [initialValue.toString()]
    );
    
    if (result.effects?.status?.status === 'success' && result.effects?.created) {
      const createdObject = result.effects.created[0];
      toast.success("Simple storage created successfully");
      return createdObject.reference.objectId;
    } else {
      console.error("Creation failed:", result.effects?.status?.error);
      toast.error("Failed to create simple storage");
      return null;
    }
  } catch (error) {
    console.error("Error creating simple storage:", error);
    toast.error("Failed to create simple storage");
    return null;
  }
};

// Helper function to get storage object details
export const getStorageDetails = async (
  client: SuiClient,
  objectId: string
): Promise<{ value: number; owner: string } | null> => {
  try {
    const object = await client.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
    
    if (object.data?.content && 'fields' in object.data.content) {
      const fields = object.data.content.fields as any;
      return {
        value: Number(fields.value || 0),
        owner: object.data.owner?.AddressOwner || 'Unknown'
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting storage details:", error);
    return null;
  }
};