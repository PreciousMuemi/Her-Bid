import { 
  SuiClient, 
  getFullnodeUrl,
  SuiTransactionBlockResponse,
  SuiObjectData
} from '@mysten/sui.js/client';
import { 
  Ed25519Keypair,
  fromB64
} from '@mysten/sui.js/keypairs/ed25519';
import { 
  TransactionBlock,
  normalizeSuiAddress
} from '@mysten/sui.js/transactions';
import { 
  requestSuiFromFaucetV0,
  getFaucetHost
} from '@mysten/sui.js/faucet';

// Helper function to initialize a Sui client
export const initializeSuiClient = (network: 'devnet' | 'testnet' | 'mainnet' = 'devnet') => {
  try {
    const rpcUrl = getFullnodeUrl(network);
    return new SuiClient({ url: rpcUrl });
  } catch (error) {
    console.error("Error initializing Sui client:", error);
    throw error;
  }
};

// Helper function to create a new Sui account
export const createSuiAccount = () => {
  try {
    const keypair = new Ed25519Keypair();
    const address = keypair.getPublicKey().toSuiAddress();
    
    return {
      address,
      keypair,
      privateKey: keypair.export().privateKey,
      publicKey: keypair.getPublicKey().toBase64()
    };
  } catch (error) {
    console.error("Error creating Sui account:", error);
    throw error;
  }
};

// Helper function to restore account from private key
export const restoreAccountFromPrivateKey = (privateKeyB64: string) => {
  try {
    const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyB64));
    const address = keypair.getPublicKey().toSuiAddress();
    
    return {
      address,
      keypair,
      privateKey: privateKeyB64,
      publicKey: keypair.getPublicKey().toBase64()
    };
  } catch (error) {
    console.error("Error restoring account from private key:", error);
    throw error;
  }
};

// Get account balance
export const getSuiBalance = async (client: SuiClient, address: string): Promise<string> => {
  try {
    const balanceResult = await client.getBalance({
      owner: address,
    });
    
    // Convert from MIST to SUI (1 SUI = 10^9 MIST)
    const suiBalance = (parseInt(balanceResult.totalBalance) / 1000000000).toString();
    return suiBalance;
  } catch (error) {
    console.error("Error getting SUI balance:", error);
    throw error;
  }
};

// Transfer SUI between accounts
export const transferSui = async (
  client: SuiClient,
  senderKeypair: Ed25519Keypair,
  recipientAddress: string,
  amount: number // Amount in SUI
): Promise<string> => {
  try {
    const tx = new TransactionBlock();
    const amountInMist = Math.floor(amount * 1000000000); // Convert SUI to MIST
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amountInMist)]);
    tx.transferObjects([coin], tx.pure(recipientAddress));

    const result = await client.signAndExecuteTransactionBlock({
      signer: senderKeypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });

    return result.digest;
  } catch (error) {
    console.error("Error transferring SUI:", error);
    throw error;
  }
};

// Request SUI from faucet (devnet/testnet only)
export const requestSuiFromFaucet = async (
  address: string,
  network: 'devnet' | 'testnet' = 'devnet'
): Promise<string> => {
  try {
    const faucetHost = getFaucetHost(network);
    const response = await requestSuiFromFaucetV0({
      host: faucetHost,
      recipient: address,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.transferredGasObjects?.[0]?.id || "success";
  } catch (error) {
    console.error("Error requesting SUI from faucet:", error);
    throw error;
  }
};

// Deploy a Move package
export const deployMovePackage = async (
  client: SuiClient,
  senderKeypair: Ed25519Keypair,
  compiledModules: number[],
  dependencies: string[]
): Promise<string> => {
  try {
    const tx = new TransactionBlock();
    const [upgradeCap] = tx.publish({
      modules: compiledModules,
      dependencies,
    });
    
    tx.transferObjects([upgradeCap], tx.pure(senderKeypair.getPublicKey().toSuiAddress()));

    const result = await client.signAndExecuteTransactionBlock({
      signer: senderKeypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    // Find the package ID from the results
    const packageId = result.objectChanges?.find(
      (change) => change.type === 'published'
    )?.packageId;

    if (!packageId) {
      throw new Error("Failed to get package ID from deployment");
    }

    return packageId;
  } catch (error) {
    console.error("Error deploying Move package:", error);
    throw error;
  }
};

// Execute a Move function
export const executeMoveFunction = async (
  client: SuiClient,
  senderKeypair: Ed25519Keypair,
  packageId: string,
  moduleName: string,
  functionName: string,
  args: any[],
  typeArgs: string[] = []
): Promise<SuiTransactionBlockResponse> => {
  try {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageId}::${moduleName}::${functionName}`,
      arguments: args.map(arg => tx.pure(arg)),
      typeArguments: typeArgs,
    });

    const result = await client.signAndExecuteTransactionBlock({
      signer: senderKeypair,
      transactionBlock: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    return result;
  } catch (error) {
    console.error("Error executing Move function:", error);
    throw error;
  }
};

// Call a Move function (dry run - no state changes)
export const callMoveFunction = async (
  client: SuiClient,
  senderAddress: string,
  packageId: string,
  moduleName: string,
  functionName: string,
  args: any[],
  typeArgs: string[] = []
) => {
  try {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${packageId}::${moduleName}::${functionName}`,
      arguments: args.map(arg => tx.pure(arg)),
      typeArguments: typeArgs,
    });

    const result = await client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: senderAddress,
    });

    return result;
  } catch (error) {
    console.error("Error calling Move function:", error);
    throw error;
  }
};

// Get objects owned by an address
export const getOwnedObjects = async (
  client: SuiClient,
  address: string,
  objectType?: string
): Promise<SuiObjectData[]> => {
  try {
    const response = await client.getOwnedObjects({
      owner: address,
      filter: objectType ? { StructType: objectType } : undefined,
      options: {
        showContent: true,
        showType: true,
      },
    });

    return response.data.map(obj => obj.data!).filter(Boolean);
  } catch (error) {
    console.error("Error getting owned objects:", error);
    throw error;
  }
};

// Helper function to normalize and validate Sui addresses
export const validateSuiAddress = (address: string): string => {
  try {
    return normalizeSuiAddress(address);
  } catch (error) {
    throw new Error(`Invalid Sui address: ${address}`);
  }
};

// Helper function to format SUI amounts (convert MIST to SUI)
export const formatSuiAmount = (amountInMist: string | number): string => {
  const amount = typeof amountInMist === 'string' ? parseInt(amountInMist) : amountInMist;
  return (amount / 1000000000).toFixed(6); // 6 decimal places for SUI
};

// Helper function to parse SUI amounts (convert SUI to MIST)
export const parseSuiAmount = (amountInSui: string | number): number => {
  const amount = typeof amountInSui === 'string' ? parseFloat(amountInSui) : amountInSui;
  return Math.floor(amount * 1000000000); // Convert to MIST
};

// Get transaction details
export const getTransactionDetails = async (
  client: SuiClient,
  digest: string
): Promise<SuiTransactionBlockResponse> => {
  try {
    const result = await client.getTransactionBlock({
      digest,
      options: {
        showEffects: true,
        showInput: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
    });

    return result;
  } catch (error) {
    console.error("Error getting transaction details:", error);
    throw error;
  }
};

// Constants for common Sui values
export const SUI_CONSTANTS = {
  MIST_PER_SUI: 1000000000,
  SUI_FRAMEWORK_ADDRESS: '0x2',
  SUI_SYSTEM_ADDRESS: '0x3',
  SUI_TYPE: '0x2::sui::SUI',
  CLOCK_OBJECT_ID: '0x6',
  SUI_SYSTEM_STATE_OBJECT_ID: '0x5',
};

// Helper to get current epoch
export const getCurrentEpoch = async (client: SuiClient): Promise<string> => {
  try {
    const systemState = await client.getLatestSuiSystemState();
    return systemState.epoch;
  } catch (error) {
    console.error("Error getting current epoch:", error);
    throw error;
  }
};
