import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  getFullnodeUrl, 
  SuiClient,
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
import { toast } from "sonner";

type SuiContextType = {
  client: SuiClient | null;
  isConnected: boolean;
  accountAddress: string;
  keypair: Ed25519Keypair | null;
  balance: string | null;
  connectToSui: (network?: 'devnet' | 'testnet' | 'mainnet') => Promise<boolean>;
  disconnectFromSui: () => void;
  refreshBalance: () => Promise<void>;
  
  // Wallet connection functions
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  requestFromFaucet: (address?: string) => Promise<string>;

  // Account management
  createAccount: () => Promise<{ address: string, privateKey: string }>;
  
  // Token operations  
  transferSui: (toAddress: string, amount: number) => Promise<string>;
  
  // Contract operations (Move modules)
  deployContract: (compiledModules: number[], dependencies: string[]) => Promise<string>;
  executeContract: (packageId: string, moduleName: string, functionName: string, args: any[], typeArgs?: string[]) => Promise<string>;
  callContract: (packageId: string, moduleName: string, functionName: string, args: any[], typeArgs?: string[]) => Promise<any>;
  
  // Escrow-specific functions
  createEscrow: (senderAddress: string, receiverAddresses: string[], amount: number) => Promise<string>;
  depositFunds: (escrowId: string, amount: number) => Promise<string>;
  releaseFunds: (escrowId: string) => Promise<string>;
};

const SuiContext = createContext<SuiContextType | undefined>(undefined);

export const SuiProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<SuiClient | null>(null);
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [keypair, setKeypair] = useState<Ed25519Keypair | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load wallet connection from localStorage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem("suiAccount");
    const storedPrivateKey = localStorage.getItem("suiPrivateKey");
    
    if (storedAddress && storedPrivateKey) {
      setAccountAddress(storedAddress);
      setIsConnected(true);
      
      try {
        const restoredKeypair = Ed25519Keypair.fromSecretKey(fromB64(storedPrivateKey));
        setKeypair(restoredKeypair);
        // Initialize client and fetch balance
        initializeClient();
        fetchBalance(storedAddress);
      } catch (error) {
        console.error("Error restoring keypair:", error);
        // Clear invalid stored data
        localStorage.removeItem("suiAccount");
        localStorage.removeItem("suiPrivateKey");
      }
    } else {
      // Initialize client even without account
      initializeClient();
    }
  }, []);

  const initializeClient = (network: 'devnet' | 'testnet' | 'mainnet' = 'devnet') => {
    try {
      const rpcUrl = getFullnodeUrl(network);
      const suiClient = new SuiClient({ url: rpcUrl });
      setClient(suiClient);
      return suiClient;
    } catch (error) {
      console.error("Error initializing Sui client:", error);
      return null;
    }
  };

  const connectToSui = async (network: 'devnet' | 'testnet' | 'mainnet' = 'devnet'): Promise<boolean> => {
    try {
      const suiClient = initializeClient(network);
      if (!suiClient) {
        toast.error("Failed to initialize Sui client");
        return false;
      }

      // Generate a new keypair if one doesn't exist
      if (!keypair) {
        const newKeypair = new Ed25519Keypair();
        const address = newKeypair.getPublicKey().toSuiAddress();
        
        setKeypair(newKeypair);
        setAccountAddress(address);
        setIsConnected(true);
        
        // Store in localStorage
        localStorage.setItem("suiAccount", address);
        localStorage.setItem("suiPrivateKey", newKeypair.export().privateKey);
        
        // Get initial balance
        await fetchBalance(address);
        
        toast.success(`Connected to Sui ${network}`);
        return true;
      } else {
        setIsConnected(true);
        await fetchBalance(accountAddress);
        toast.success(`Connected to Sui ${network}`);
        return true;
      }
    } catch (error) {
      console.error("Error connecting to Sui:", error);
      toast.error("Failed to connect to Sui");
      return false;
    }
  };

  const disconnectFromSui = () => {
    localStorage.removeItem("suiAccount");
    localStorage.removeItem("suiPrivateKey");
    localStorage.removeItem("isAuthenticated");
    setAccountAddress("");
    setKeypair(null);
    setBalance(null);
    setIsConnected(false);
    toast.info("Disconnected from Sui");
  };

  // Wallet connection functions (for browser wallet integration)
  const connectWallet = async (): Promise<boolean> => {
    try {
      // Check if Sui Wallet is available
      if (typeof window !== 'undefined' && (window as any).suiWallet) {
        const wallet = (window as any).suiWallet;
        
        try {
          const accounts = await wallet.requestPermissions();
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setAccountAddress(address);
            localStorage.setItem("suiAccount", address);
            setIsConnected(true);
            
            // Get balance
            await fetchBalance(address);
            
            toast.success("Connected to Sui Wallet successfully");
            return true;
          }
        } catch (walletError) {
          console.error("Sui Wallet connection failed:", walletError);
        }
      }
      
      // Fallback to generating a new keypair
      toast.info("No Sui Wallet found, generating new account...");
      return await connectToSui();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
      return false;
    }
  };

  const disconnectWallet = () => {
    disconnectFromSui();
  };

  // Fetch account balance
  const fetchBalance = async (address: string) => {
    try {
      if (!client) {
        setBalance("0");
        return "0";
      }
      
      const balanceResult = await client.getBalance({
        owner: address,
      });
      
      // Convert from MIST to SUI (1 SUI = 10^9 MIST)
      const suiBalance = (parseInt(balanceResult.totalBalance) / 1000000000).toString();
      setBalance(suiBalance);
      return suiBalance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0");
      return "0";
    }
  };

  // Refresh the current account balance
  const refreshBalance = async () => {
    if (!accountAddress) {
      throw new Error("No account connected");
    }
    await fetchBalance(accountAddress);
  };

  // Request SUI from faucet (devnet/testnet only)
  const requestFromFaucet = async (address?: string): Promise<string> => {
    try {
      const targetAddress = address || accountAddress;
      if (!targetAddress) {
        throw new Error("No address provided");
      }

      const faucetHost = getFaucetHost('devnet');
      const response = await requestSuiFromFaucetV0({
        host: faucetHost,
        recipient: targetAddress,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      // Refresh balance after faucet request
      if (targetAddress === accountAddress) {
        setTimeout(() => refreshBalance(), 2000); // Wait 2 seconds for transaction to process
      }

      toast.success("Successfully requested SUI from faucet");
      return response.transferredGasObjects?.[0]?.id || "success";
    } catch (error) {
      console.error("Error requesting from faucet:", error);
      toast.error("Failed to request from faucet");
      throw error;
    }
  };

  // Create a new account
  const createAccount = async () => {
    try {
      const newKeypair = new Ed25519Keypair();
      const address = newKeypair.getPublicKey().toSuiAddress();
      
      return {
        address,
        privateKey: newKeypair.export().privateKey
      };
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  // Transfer SUI to another address
  const transferSui = async (toAddress: string, amount: number): Promise<string> => {
    try {
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount * 1000000000)]); // Convert SUI to MIST
      tx.transferObjects([coin], tx.pure(toAddress));

      const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      });

      // Refresh balance after transfer
      await refreshBalance();
      
      return result.digest;
    } catch (error) {
      console.error("Error transferring SUI:", error);
      throw error;
    }
  };

  // Deploy a Move contract (package)
  const deployContract = async (compiledModules: number[], dependencies: string[]): Promise<string> => {
    try {
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      const tx = new TransactionBlock();
      const [upgradeCap] = tx.publish({
        modules: compiledModules,
        dependencies,
      });
      tx.transferObjects([upgradeCap], tx.pure(accountAddress));

      const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
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

      // Refresh balance after deployment
      await refreshBalance();
      
      return packageId;
    } catch (error) {
      console.error("Error deploying contract:", error);
      throw error;
    }
  };

  // Execute a Move function (state-changing)
  const executeContract = async (
    packageId: string, 
    moduleName: string, 
    functionName: string, 
    args: any[], 
    typeArgs: string[] = []
  ): Promise<string> => {
    try {
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: args.map(arg => tx.pure(arg)),
        typeArguments: typeArgs,
      });

      const result = await client.signAndExecuteTransactionBlock({
        signer: keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
        },
      });

      // Refresh balance after execution
      await refreshBalance();
      
      return result.digest;
    } catch (error) {
      console.error("Error executing contract function:", error);
      throw error;
    }
  };

  // Call a Move function (view-only)
  const callContract = async (
    packageId: string, 
    moduleName: string, 
    functionName: string, 
    args: any[], 
    typeArgs: string[] = []
  ) => {
    try {
      if (!client) {
        throw new Error("Client not initialized");
      }

      const tx = new TransactionBlock();
      tx.moveCall({
        target: `${packageId}::${moduleName}::${functionName}`,
        arguments: args.map(arg => tx.pure(arg)),
        typeArguments: typeArgs,
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: accountAddress,
      });

      return result;
    } catch (error) {
      console.error("Error calling contract function:", error);
      throw error;
    }
  };

  // Escrow-specific functions (these would interact with a deployed Move escrow module)
  const createEscrow = async (senderAddress: string, receiverAddresses: string[], amount: number): Promise<string> => {
    try {
      // This is a placeholder - you would need to deploy an escrow Move module first
      // For now, we'll create a simple transaction as an example
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      toast.info("Creating escrow contract...");
      
      // In a real implementation, this would call a Move function like:
      // await executeContract(ESCROW_PACKAGE_ID, "escrow", "create_escrow", [receiverAddresses, amount]);
      
      // For now, return a mock transaction digest
      return "escrow_created_placeholder";
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw error;
    }
  };

  const depositFunds = async (escrowId: string, amount: number): Promise<string> => {
    try {
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      toast.info("Depositing funds to escrow...");
      
      // In a real implementation, this would call a Move function like:
      // await executeContract(ESCROW_PACKAGE_ID, "escrow", "deposit_funds", [escrowId, amount]);
      
      return "funds_deposited_placeholder";
    } catch (error) {
      console.error("Error depositing funds:", error);
      throw error;
    }
  };

  const releaseFunds = async (escrowId: string): Promise<string> => {
    try {
      if (!client || !keypair) {
        throw new Error("Client or keypair not initialized");
      }

      toast.info("Releasing funds from escrow...");
      
      // In a real implementation, this would call a Move function like:
      // await executeContract(ESCROW_PACKAGE_ID, "escrow", "release_funds", [escrowId]);
      
      return "funds_released_placeholder";
    } catch (error) {
      console.error("Error releasing funds:", error);
      throw error;
    }
  };

  // Context value
  const value = {
    client,
    accountAddress,
    keypair,
    balance,
    isConnected,
    connectToSui,
    disconnectFromSui,
    refreshBalance,
    connectWallet,
    disconnectWallet,
    requestFromFaucet,
    createAccount,
    transferSui,
    deployContract,
    executeContract,
    callContract,
    createEscrow,
    depositFunds,
    releaseFunds
  };

  return (
    <SuiContext.Provider value={value}>
      {children}
    </SuiContext.Provider>
  );
};

export const useSui = () => {
  const context = useContext(SuiContext);
  if (context === undefined) {
    throw new Error("useSui must be used within a SuiProvider");
  }
  return context;
};
