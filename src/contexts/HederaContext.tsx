
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  Client, AccountId, PrivateKey, TokenCreateTransaction, TokenAssociateTransaction, 
  TransferTransaction, ContractCreateFlow, ContractExecuteTransaction, ContractCallQuery, 
  ContractFunctionParameters, ContractId, TokenId, TokenSupplyType, TokenType, 
  AccountBalanceQuery, AccountCreateTransaction, Hbar, TransactionReceiptQuery
} from "@hashgraph/sdk";
import { toast } from "sonner";
import { ethers } from "ethers";

type HederaContextType = {
  client: Client | null;
  isConnected: boolean;
  accountId: string;
  privateKey: string | null;
  balance: string | null;
  connectToHedera: (operatorId?: string, operatorKey?: string) => Promise<boolean>;
  disconnectFromHedera: () => void;
  refreshBalance: () => Promise<void>;
  
  // MetaMask connection
  ethAddress: string;
  ethProvider: ethers.providers.Web3Provider | null;
  connectMetaMask: () => Promise<boolean>;
  disconnectMetaMask: () => void;
  sendHbarToMetaMask: (toAddress: string, amount: number) => Promise<string>;

  // Account creation
  createAccount: (initialBalance: number) => Promise<{ accountId: string, privateKey: string }>;

  // Token operations
  createToken: (name: string, symbol: string, initialSupply: number) => Promise<string>;
  associateToken: (tokenId: string, accountId?: string) => Promise<string>;
  transferTokens: (tokenId: string, receiverId: string, amount: number) => Promise<string>;
  
  // Contract operations
  deployContract: (bytecode: string, gas?: number) => Promise<string>;
  executeContract: (contractId: string, functionName: string, params: any[], payableAmount?: number) => Promise<string>;
  callContract: (contractId: string, functionName: string, params: any[]) => Promise<any>;
};

const HederaContext = createContext<HederaContextType | undefined>(undefined);

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // MetaMask states
  const [ethAddress, setEthAddress] = useState<string>("");
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Load wallet connection from localStorage on mount
  useEffect(() => {
    const storedAccountId = localStorage.getItem("hederaAccount");
    const storedEthAddress = localStorage.getItem("metamaskAddress");
    
    if (storedAccountId) {
      setAccountId(storedAccountId);
      setIsConnected(true);
      // Try to get balance
      fetchBalance(storedAccountId);
    }
    
    if (storedEthAddress) {
      setEthAddress(storedEthAddress);
      // Try to initialize ethProvider if MetaMask is available
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setEthProvider(provider);
      }
    }
  }, []);

  const connectToHedera = async (operatorId?: string, operatorKey?: string): Promise<boolean> => {
    try {
      // Try to use provided credentials or environment variables
      const accountId = operatorId || import.meta.env.VITE_ACCOUNT_ID;
      const privateKey = operatorKey || import.meta.env.VITE_PRIVATE_KEY;
      const network = import.meta.env.VITE_NETWORK || "testnet";

      if (!accountId || !privateKey) {
        toast.error("Hedera credentials are required but not provided");
        return false;
      }

      // Initialize client based on network setting
      const hederaClient = network === "mainnet"
        ? Client.forMainnet()
        : Client.forTestnet();
      
      hederaClient.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
      
      setClient(hederaClient);
      setAccountId(accountId);
      setPrivateKey(privateKey);
      setIsConnected(true);
      
      // Get initial balance
      await fetchBalance(accountId);
      
      toast.success(`Connected to Hedera ${network}`);
      return true;
    } catch (error) {
      console.error("Error connecting to Hedera:", error);
      toast.error("Failed to connect to Hedera");
      return false;
    }
  };

  const disconnectFromHedera = () => {
    localStorage.removeItem("hederaAccount");
    localStorage.removeItem("isAuthenticated");
    setClient(null);
    setAccountId("");
    setPrivateKey(null);
    setBalance(null);
    setIsConnected(false);
    toast.info("Disconnected from Hedera");
  };

  // MetaMask connection functions
const connectMetaMask = async (): Promise<boolean> => {
    console.log("Attempting to connect to MetaMask...");
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask first.");
        return false;
      }

      // First, try to switch to Hedera network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x128" }], // Hedera testnet in hex
        });
      } catch (switchError: any) {
        // This error code means the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "Hedera Testnet",
                  chainId: "0x128",
                  nativeCurrency: {
                    name: "HBAR",
                    symbol: "HBAR",
                    decimals: 18,
                  },
                  rpcUrls: ["https://testnet.hashio.io/api"],
                  blockExplorerUrls: ["https://hashscan.io/testnet"],
                },
              ],
            });
          } catch (addError) {
            console.error("Error adding Hedera network to MetaMask:", addError);
            toast.error("Failed to add Hedera network to MetaMask");
            return false;
          }
        } else {
          console.error("Error switching to Hedera network:", switchError);
          toast.error("Failed to switch to Hedera network");
          return false;
        }
      }

      // Create Ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      setEthProvider(provider);
      
      // Connect to account
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];
      
      setEthAddress(selectedAccount);
      localStorage.setItem("metamaskAddress", selectedAccount);
      
      try {
        // Try to get Hedera Account ID from Mirror Node API
        const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts?evm-address=${selectedAccount}`);
        const data = await response.json();
        
        if (data && data.accounts && data.accounts.length > 0) {
          const hederaAccountId = data.accounts[0].account;
          setAccountId(hederaAccountId);
          localStorage.setItem("hederaAccount", hederaAccountId);
          setIsConnected(true);
          
          // Get balance
          await fetchBalance(hederaAccountId);
          
          toast.success("Connected to MetaMask successfully");
          return true;
        } else {
          console.log("No Hedera account found for this EVM address. Will be auto-created on first transaction.");
          
          // We'll use the EVM address as a placeholder
          setAccountId(`EVM: ${selectedAccount}`);
          localStorage.setItem("hederaAccount", `EVM: ${selectedAccount}`);
          setIsConnected(true);
          
          toast.success("Connected to MetaMask successfully");
          return true;
        }
      } catch (error) {
        console.error("Error fetching account from mirror node:", error);
        // Continue even if mirror node fails - account might be auto-created later
        setAccountId(`EVM: ${selectedAccount}`);
        localStorage.setItem("hederaAccount", `EVM: ${selectedAccount}`);
        setIsConnected(true);
        return true;
      }
    } catch (error) {
      console.error("Error connecting MetaMask wallet:", error);
      console.log("Ethereum object:", window.ethereum);
      toast.error("Failed to connect MetaMask wallet: " + error.message);
      return false;
    }
  };

  const disconnectMetaMask = () => {
    localStorage.removeItem("metamaskAddress");
    localStorage.removeItem("hederaAccount");
    localStorage.removeItem("isAuthenticated");
    setEthAddress("");
    setEthProvider(null);
    setAccountId("");
    setBalance(null);
    setIsConnected(false);
    toast.info("Disconnected from MetaMask");
  };

  // Initialize client on component mount
  useEffect(() => {
    initializeClient();
  }, []);

  // Initialize Hedera client
  const initializeClient = () => {
    try {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      const network = import.meta.env.VITE_NETWORK || "testnet";

      if (!operatorId || !operatorKey) {
        console.warn("Environment variables for Hedera are missing");
        return;
      }

      const newClient = network === "mainnet" 
        ? Client.forMainnet() 
        : Client.forTestnet();
      
      newClient.setOperator(
        AccountId.fromString(operatorId),
        PrivateKey.fromString(operatorKey)
      );

      setClient(newClient);
      setPrivateKey(operatorKey);
      
      // Don't auto-connect, let the user explicitly connect
      // through MetaMask or other method
    } catch (error) {
      console.error("Error initializing Hedera client:", error);
    }
  };

  // Fetch account balance
  const fetchBalance = async (id: string) => {
    try {
      // Skip if using EVM address without known Hedera account yet
      if (id.startsWith("EVM:")) {
        setBalance("0");
        return "0";
      }
      
      // Initialize client
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        console.warn("Environment variables for Hedera are missing");
        setBalance("0");
        return "0";
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      const balanceQuery = await new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(id))
        .execute(tempClient);
      setBalance(balanceQuery.hbars.toString());
      return balanceQuery.hbars.toString();
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  };

  // Refresh the current account balance
  const refreshBalance = async () => {
    if (!accountId) {
      throw new Error("Client not initialized or not connected");
    }
    await fetchBalance(accountId);
  };

  // Create a new account
  const createAccount = async (initialBalance: number) => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    try {
      // Generate a new ECDSA key pair
      const newPrivateKey = PrivateKey.generateECDSA();
      const newPublicKey = newPrivateKey.publicKey;

      const transaction = await new AccountCreateTransaction()
        .setInitialBalance(new Hbar(initialBalance))
        .setKey(newPublicKey)
        .setAlias(newPublicKey.toEvmAddress())
        .setMaxAutomaticTokenAssociations(10)
        .execute(client);

      const receipt = await transaction.getReceipt(client);
      const newAccountId = receipt.accountId?.toString() || "";

      return {
        accountId: newAccountId,
        privateKey: newPrivateKey.toString()
      };
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  // Send HBAR to a MetaMask wallet
  const sendHbarToMetaMask = async (toAddress: string, amount: number) => {
    if (!client) {
      // Try to initialize client with env variables
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      try {
        const transferHbarTransaction = new TransferTransaction()
          .addHbarTransfer(AccountId.fromString(operatorId), new Hbar(-amount))
          .addHbarTransfer(AccountId.fromEvmAddress(0, 0, toAddress), new Hbar(amount))
          .freezeWith(tempClient);

        const transferHbarTransactionSigned = await transferHbarTransaction.sign(PrivateKey.fromString(operatorKey));
        const transferHbarTransactionResponse = await transferHbarTransactionSigned.execute(tempClient);
        
        // Get the transaction receipt and check for child receipts (for auto-created accounts)
        const transactionReceipt = await new TransactionReceiptQuery()
          .setTransactionId(transferHbarTransactionResponse.transactionId)
          .setIncludeChildren(true)
          .execute(tempClient);

        // If there's a child receipt, a new account was created
        if (transactionReceipt.children && transactionReceipt.children.length > 0) {
          const childReceipt = transactionReceipt.children[0];
          if (childReceipt.accountId) {
            const newAccountId = childReceipt.accountId.toString();
            console.log(`New account created: ${newAccountId}`);
            
            // Update our state if this was our own account
            if (ethAddress === toAddress) {
              setAccountId(newAccountId);
              localStorage.setItem("hederaAccount", newAccountId);
            }
          }
        }

        // Refresh balance after transfer
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return transactionReceipt.status.toString();
      } catch (error) {
        console.error("Error transferring HBAR:", error);
        throw error;
      }
    } else {
      try {
        const operatorId = import.meta.env.VITE_ACCOUNT_ID;
        const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
        
        if (!operatorId || !operatorKey) {
          throw new Error("Hedera credentials are required");
        }
        
        const transferHbarTransaction = new TransferTransaction()
          .addHbarTransfer(AccountId.fromString(operatorId), new Hbar(-amount))
          .addHbarTransfer(AccountId.fromEvmAddress(0, 0, toAddress), new Hbar(amount))
          .freezeWith(client);

        const transferHbarTransactionSigned = await transferHbarTransaction.sign(PrivateKey.fromString(operatorKey));
        const transferHbarTransactionResponse = await transferHbarTransactionSigned.execute(client);
        
        // Get the transaction receipt and check for child receipts (for auto-created accounts)
        const transactionReceipt = await new TransactionReceiptQuery()
          .setTransactionId(transferHbarTransactionResponse.transactionId)
          .setIncludeChildren(true)
          .execute(client);

        // If there's a child receipt, a new account was created
        if (transactionReceipt.children && transactionReceipt.children.length > 0) {
          const childReceipt = transactionReceipt.children[0];
          if (childReceipt.accountId) {
            const newAccountId = childReceipt.accountId.toString();
            console.log(`New account created: ${newAccountId}`);
            
            // Update our state if this was our own account
            if (ethAddress === toAddress) {
              setAccountId(newAccountId);
              localStorage.setItem("hederaAccount", newAccountId);
            }
          }
        }

        // Refresh balance after transfer
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return transactionReceipt.status.toString();
      } catch (error) {
        console.error("Error transferring HBAR:", error);
        throw error;
      }
    }
  };

  // Create a token (fungible by default)
  const createToken = async (name: string, symbol: string, initialSupply: number) => {
    // Try to initialize client with env variables if not set
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      try {
        const transaction = await new TokenCreateTransaction()
          .setTokenName(name)
          .setTokenSymbol(symbol)
          .setTokenType(TokenType.FungibleCommon)
          .setDecimals(2)
          .setInitialSupply(initialSupply)
          .setTreasuryAccountId(AccountId.fromString(operatorId))
          .setSupplyType(TokenSupplyType.Infinite)
          .setSupplyKey(PrivateKey.fromString(operatorKey))
          .setAdminKey(PrivateKey.fromString(operatorKey))
          .freezeWith(tempClient);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(tempClient);
        const receipt = await txResponse.getReceipt(tempClient);
        
        const tokenIdStr = receipt.tokenId?.toString() || "";
        
        // Refresh balance after token creation
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return tokenIdStr;
      } catch (error) {
        console.error("Error creating token:", error);
        throw error;
      }
    } else {
      // Use the existing client and credentials
      try {
        const operatorId = import.meta.env.VITE_ACCOUNT_ID;
        const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
        
        if (!operatorId || !operatorKey) {
          throw new Error("Hedera credentials are required");
        }
        
        const transaction = await new TokenCreateTransaction()
          .setTokenName(name)
          .setTokenSymbol(symbol)
          .setTokenType(TokenType.FungibleCommon)
          .setDecimals(2)
          .setInitialSupply(initialSupply)
          .setTreasuryAccountId(AccountId.fromString(operatorId))
          .setSupplyType(TokenSupplyType.Infinite)
          .setSupplyKey(PrivateKey.fromString(operatorKey))
          .setAdminKey(PrivateKey.fromString(operatorKey))
          .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        const tokenIdStr = receipt.tokenId?.toString() || "";
        
        // Refresh balance after token creation
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return tokenIdStr;
      } catch (error) {
        console.error("Error creating token:", error);
        throw error;
      }
    }
  };

  // Associate a token with an account (defaults to current account if not specified)
  const associateToken = async (tokenId: string, accountToAssociate?: string) => {
    // Prepare client
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      const targetAccountId = accountToAssociate || accountId;
      
      if (!targetAccountId) {
        throw new Error("No account specified for token association");
      }
      
      try {
        const transaction = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(targetAccountId))
          .setTokenIds([TokenId.fromString(tokenId)])
          .freezeWith(tempClient);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(tempClient);
        const receipt = await txResponse.getReceipt(tempClient);
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error associating token:", error);
        throw error;
      }
    } else {
      // Use the existing client
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorKey) {
        throw new Error("Hedera private key is required");
      }
      
      const targetAccountId = accountToAssociate || accountId;
      
      if (!targetAccountId) {
        throw new Error("No account specified for token association");
      }
      
      try {
        const transaction = await new TokenAssociateTransaction()
          .setAccountId(AccountId.fromString(targetAccountId))
          .setTokenIds([TokenId.fromString(tokenId)])
          .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error associating token:", error);
        throw error;
      }
    }
  };

  // Transfer tokens to another account
  const transferTokens = async (tokenId: string, receiverId: string, amount: number) => {
    // Prepare client
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      try {
        const transaction = await new TransferTransaction()
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(operatorId), -amount)
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(receiverId), amount)
          .freezeWith(tempClient);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(tempClient);
        const receipt = await txResponse.getReceipt(tempClient);
        
        // Refresh balance after transfer
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error transferring tokens:", error);
        throw error;
      }
    } else {
      // Use existing client
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }

      try {
        const transaction = await new TransferTransaction()
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(operatorId), -amount)
          .addTokenTransfer(TokenId.fromString(tokenId), AccountId.fromString(receiverId), amount)
          .freezeWith(client);

        const signTx = await transaction.sign(PrivateKey.fromString(operatorKey));
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        // Refresh balance after transfer
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error transferring tokens:", error);
        throw error;
      }
    }
  };

  // Deploy a smart contract
  const deployContract = async (bytecode: string, gas: number = 100000) => {
    // Prepare client
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      try {
        // Clean bytecode if needed
        let cleanedBytecode = bytecode;
        if (bytecode.startsWith("0x")) {
          cleanedBytecode = bytecode.slice(2);
        }
        
        const contractCreate = new ContractCreateFlow()
          .setGas(gas)
          .setBytecode(cleanedBytecode);
        
        const txResponse = await contractCreate.execute(tempClient);
        const receipt = await txResponse.getReceipt(tempClient);
        
        const contractIdStr = receipt.contractId?.toString() || "";
        
        // Refresh balance after contract deployment
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return contractIdStr;
      } catch (error) {
        console.error("Error deploying contract:", error);
        throw error;
      }
    } else {
      // Use existing client
      try {
        // Clean bytecode if needed
        let cleanedBytecode = bytecode;
        if (bytecode.startsWith("0x")) {
          cleanedBytecode = bytecode.slice(2);
        }
        
        const contractCreate = new ContractCreateFlow()
          .setGas(gas)
          .setBytecode(cleanedBytecode);
        
        const txResponse = await contractCreate.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        const contractIdStr = receipt.contractId?.toString() || "";
        
        // Refresh balance after contract deployment
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return contractIdStr;
      } catch (error) {
        console.error("Error deploying contract:", error);
        throw error;
      }
    }
  };

  // Execute a contract function (state-changing)
  const executeContract = async (contractId: string, functionName: string, params: any[], payableAmount: number = 0) => {
    // Prepare client
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));

      try {
        // Convert params to ContractFunctionParameters
        let functionParams = new ContractFunctionParameters();
        
        // Add parameters based on their type
        params.forEach((param) => {
          if (typeof param === 'string') {
            // Check if it's an address (starts with 0x)
            if (param.startsWith('0x') && param.length === 42) {
              functionParams = functionParams.addAddress(param);
            } else {
              functionParams = functionParams.addString(param);
            }
          } else if (typeof param === 'number') {
            // Determine the appropriate integer type based on size
            if (param <= 2147483647) { // Max int32
              functionParams = functionParams.addUint32(param);
            } else {
              functionParams = functionParams.addUint256(param);
            }
          } else if (typeof param === 'boolean') {
            functionParams = functionParams.addBool(param);
          } else if (Array.isArray(param)) {
            // Handle arrays based on their content type
            if (param.length > 0) {
              if (typeof param[0] === 'string') {
                functionParams = functionParams.addStringArray(param);
              } else if (typeof param[0] === 'number') {
                functionParams = functionParams.addUint256Array(param);
              }
            }
          } else if (param instanceof Uint8Array) {
            functionParams = functionParams.addBytes(param);
          }
        });

        const transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(contractId))
          .setGas(100000)
          .setFunction(functionName, functionParams);
        
        // Add payable amount if specified
        if (payableAmount > 0) {
          transaction.setPayableAmount(new Hbar(payableAmount));
        }
        
        const txResponse = await transaction.execute(tempClient);
        const receipt = await txResponse.getReceipt(tempClient);
        
        // Refresh balance after contract execution
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error executing contract function:", error);
        throw error;
      }
    } else {
      // Use existing client
      try {
        // Convert params to ContractFunctionParameters
        let functionParams = new ContractFunctionParameters();
        
        // Add parameters based on their type
        params.forEach((param) => {
          if (typeof param === 'string') {
            // Check if it's an address (starts with 0x)
            if (param.startsWith('0x') && param.length === 42) {
              functionParams = functionParams.addAddress(param);
            } else {
              functionParams = functionParams.addString(param);
            }
          } else if (typeof param === 'number') {
            // Determine the appropriate integer type based on size
            if (param <= 2147483647) { // Max int32
              functionParams = functionParams.addUint32(param);
            } else {
              functionParams = functionParams.addUint256(param);
            }
          } else if (typeof param === 'boolean') {
            functionParams = functionParams.addBool(param);
          } else if (Array.isArray(param)) {
            // Handle arrays based on their content type
            if (param.length > 0) {
              if (typeof param[0] === 'string') {
                functionParams = functionParams.addStringArray(param);
              } else if (typeof param[0] === 'number') {
                functionParams = functionParams.addUint256Array(param);
              }
            }
          } else if (param instanceof Uint8Array) {
            functionParams = functionParams.addBytes(param);
          }
        });

        const transaction = new ContractExecuteTransaction()
          .setContractId(ContractId.fromString(contractId))
          .setGas(100000)
          .setFunction(functionName, functionParams);
        
        // Add payable amount if specified
        if (payableAmount > 0) {
          transaction.setPayableAmount(new Hbar(payableAmount));
        }
        
        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        
        // Refresh balance after contract execution
        if (accountId) {
          await fetchBalance(accountId);
        }
        
        return receipt.status.toString();
      } catch (error) {
        console.error("Error executing contract function:", error);
        throw error;
      }
    }
  };

  // Call a contract function (view-only)
  const callContract = async (contractId: string, functionName: string, params: any[]) => {
    // Prepare client
    if (!client) {
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Hedera credentials are required");
      }
      
      const tempClient = Client.forTestnet();
      tempClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));

      try {
        // Convert params to ContractFunctionParameters
        let functionParams = new ContractFunctionParameters();
        
        // Add parameters based on their type (same logic as executeContract)
        params.forEach(param => {
          if (typeof param === 'string') {
            // Check if it's an address (starts with 0x)
            if (param.startsWith('0x') && param.length === 42) {
              functionParams = functionParams.addAddress(param);
            } else {
              functionParams = functionParams.addString(param);
            }
          } else if (typeof param === 'number') {
            // Determine the appropriate integer type based on size
            if (param <= 2147483647) { // Max int32
              functionParams = functionParams.addUint32(param);
            } else {
              functionParams = functionParams.addUint256(param);
            }
          } else if (typeof param === 'boolean') {
            functionParams = functionParams.addBool(param);
          } else if (Array.isArray(param)) {
            // Handle arrays based on their content type
            if (param.length > 0) {
              if (typeof param[0] === 'string') {
                functionParams = functionParams.addStringArray(param);
              } else if (typeof param[0] === 'number') {
                functionParams = functionParams.addUint256Array(param);
              }
            }
          } else if (param instanceof Uint8Array) {
            functionParams = functionParams.addBytes(param);
          }
        });

        const query = new ContractCallQuery()
          .setContractId(ContractId.fromString(contractId))
          .setGas(100000)
          .setFunction(functionName, functionParams);
        
        const response = await query.execute(tempClient);
        return response;
      } catch (error) {
        console.error("Error calling contract function:", error);
        throw error;
      }
    } else {
      // Use existing client
      try {
        // Convert params to ContractFunctionParameters
        let functionParams = new ContractFunctionParameters();
        
        // Add parameters based on their type (same logic as executeContract)
        params.forEach(param => {
          if (typeof param === 'string') {
            // Check if it's an address (starts with 0x)
            if (param.startsWith('0x') && param.length === 42) {
              functionParams = functionParams.addAddress(param);
            } else {
              functionParams = functionParams.addString(param);
            }
          } else if (typeof param === 'number') {
            // Determine the appropriate integer type based on size
            if (param <= 2147483647) { // Max int32
              functionParams = functionParams.addUint32(param);
            } else {
              functionParams = functionParams.addUint256(param);
            }
          } else if (typeof param === 'boolean') {
            functionParams = functionParams.addBool(param);
          } else if (Array.isArray(param)) {
            // Handle arrays based on their content type
            if (param.length > 0) {
              if (typeof param[0] === 'string') {
                functionParams = functionParams.addStringArray(param);
              } else if (typeof param[0] === 'number') {
                functionParams = functionParams.addUint256Array(param);
              }
            }
          } else if (param instanceof Uint8Array) {
            functionParams = functionParams.addBytes(param);
          }
        });

        const query = new ContractCallQuery()
          .setContractId(ContractId.fromString(contractId))
          .setGas(100000)
          .setFunction(functionName, functionParams);
        
        const response = await query.execute(client);
        return response;
      } catch (error) {
        console.error("Error calling contract function:", error);
        throw error;
      }
    }
  };

  // Context value
  const value = {
    client,
    accountId,
    privateKey,
    balance,
    isConnected,
    connectToHedera,
    disconnectFromHedera,
    refreshBalance,
    createAccount,
    createToken,
    associateToken,
    transferTokens,
    deployContract,
    executeContract,
    callContract,
    ethAddress,
    ethProvider,
    connectMetaMask,
    disconnectMetaMask,
    sendHbarToMetaMask
  };

  return (
    <HederaContext.Provider value={value}>
      {children}
    </HederaContext.Provider>
  );
};

export const useHedera = () => {
  const context = useContext(HederaContext);
  if (context === undefined) {
    throw new Error("useHedera must be used within a HederaProvider");
  }
  return context;
};
