import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Client, AccountId, PrivateKey, TransferTransaction, 
  Hbar, TransactionReceiptQuery, ContractCreateTransaction,
  ContractFunctionParameters, ContractCallQuery, FileCreateTransaction,
  FileAppendTransaction
} from "@hashgraph/sdk";
import { toast } from "sonner";

export const useHedera = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider | null>(null);
  
  useEffect(() => {
    const storedAccountId = localStorage.getItem("hederaAccount");
    const storedEthAddress = localStorage.getItem("metamaskAddress");
    
    if (storedAccountId) {
      setAccountId(storedAccountId);
      setIsConnected(true);
    }
    
    if (storedEthAddress) {
      setEthAddress(storedEthAddress);
    }
  }, []);

  const connectMetaMask = async (): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask first.");
        return false;
      }

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x128" }],
        });
      } catch (switchError: any) {
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
            setLoading(false);
            return false;
          }
        } else {
          console.error("Error switching to Hedera network:", switchError);
          toast.error("Failed to switch to Hedera network");
          setLoading(false);
          return false;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setEthProvider(provider);
      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setEthAddress(address);
        localStorage.setItem("metamaskAddress", address);
        
        try {
          const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/accounts?evm-address=${address}`);
          const data = await response.json();
          
          if (data && data.accounts && data.accounts.length > 0) {
            const hederaAccountId = data.accounts[0].account;
            setAccountId(hederaAccountId);
            localStorage.setItem("hederaAccount", hederaAccountId);
            setIsConnected(true);
            
            await fetchAccountBalance(hederaAccountId);
            
            toast.success("Connected to MetaMask successfully");
            setLoading(false);
            return true;
          } else {
            console.log("No Hedera account found for this EVM address. Will be auto-created on first transaction.");
            
            setAccountId(`EVM: ${address}`);
            localStorage.setItem("hederaAccount", `EVM: ${address}`);
            setIsConnected(true);
            
            toast.success("Connected to MetaMask successfully");
            setLoading(false);
            return true;
          }
        } catch (error) {
          console.error("Error fetching account from mirror node:", error);
          setAccountId(`EVM: ${address}`);
          localStorage.setItem("hederaAccount", `EVM: ${address}`);
          setIsConnected(true);
          setLoading(false);
          return true;
        }
      } else {
        toast.error("No accounts found in MetaMask");
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast.error("Failed to connect MetaMask");
      setLoading(false);
      return false;
    }
  };

  const disconnectMetaMask = () => {
    localStorage.removeItem("metamaskAddress");
    localStorage.removeItem("hederaAccount");
    localStorage.removeItem("isAuthenticated");
    setEthAddress("");
    setAccountId("");
    setBalance(null);
    setIsConnected(false);
    toast.info("Disconnected from MetaMask");
  };

  const connectToHedera = async (operatorId?: string, operatorKey?: string) => {
    try {
      setLoading(true);
      
      const accountId = operatorId || import.meta.env.VITE_ACCOUNT_ID;
      const privateKey = operatorKey || import.meta.env.VITE_PRIVATE_KEY;
      
      if (!accountId || !privateKey) {
        toast.error("Hedera credentials are required");
        setLoading(false);
        return false;
      }
      
      setAccountId(accountId);
      localStorage.setItem("hederaAccount", accountId);
      setIsConnected(true);
      
      await fetchAccountBalance(accountId);
      
      toast.success("Connected to Hedera successfully");
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error connecting to Hedera:", error);
      toast.error("Failed to connect to Hedera");
      setLoading(false);
      return false;
    }
  };

  const disconnectFromHedera = () => {
    localStorage.removeItem("hederaAccount");
    localStorage.removeItem("isAuthenticated");
    setAccountId("");
    setBalance(null);
    setIsConnected(false);
    toast.info("Disconnected from Hedera");
  };

  const fetchAccountBalance = async (id: string) => {
    try {
      setLoading(true);
      
      if (id.startsWith("EVM:")) {
        setBalance("0");
        setLoading(false);
        return "0";
      }
      
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        console.warn("Environment variables for Hedera are missing");
        setBalance("0");
        setLoading(false);
        return "0";
      }
      
      const client = Client.forTestnet();
      client.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      const balanceQuery = await new AccountId(id).getBalance(client);
      const balanceHbar = balanceQuery.hbars.toString();
      setBalance(balanceHbar);
      setLoading(false);
      return balanceHbar;
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch account balance");
      setLoading(false);
      return "0";
    }
  };

  const sendHbarToMetaMask = async (toAddress: string, amount: number): Promise<string> => {
    try {
      setLoading(true);
      
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Environment variables for Hedera are missing");
      }
      
      const client = Client.forTestnet();
      client.setOperator(
        AccountId.fromString(operatorId),
        PrivateKey.fromString(operatorKey)
      );

      const transferHbarTransaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(operatorId), new Hbar(-amount))
        .addHbarTransfer(AccountId.fromEvmAddress(0, 0, toAddress), new Hbar(amount))
        .freezeWith(client);

      const transferHbarTransactionSigned = await transferHbarTransaction.sign(
        PrivateKey.fromString(operatorKey)
      );
      
      const transferHbarTransactionResponse = await transferHbarTransactionSigned.execute(client);
      
      const transactionReceipt = await new TransactionReceiptQuery()
        .setTransactionId(transferHbarTransactionResponse.transactionId)
        .setIncludeChildren(true)
        .execute(client);

      if (transactionReceipt.children && transactionReceipt.children.length > 0) {
        const childReceipt = transactionReceipt.children[0];
        if (childReceipt.accountId) {
          const newAccountId = childReceipt.accountId.toString();
          console.log(`New account created: ${newAccountId}`);
          
          if (ethAddress === toAddress) {
            setAccountId(newAccountId);
            localStorage.setItem("hederaAccount", newAccountId);
          }
        }
      }

      if (accountId) {
        await fetchAccountBalance(accountId);
      }
      
      setLoading(false);
      return transactionReceipt.status.toString();
    } catch (error) {
      console.error("Error transferring HBAR:", error);
      toast.error("Failed to transfer HBAR");
      setLoading(false);
      throw error;
    }
  };

  const deployContract = async (bytecode: string, gasLimit: number = 100000): Promise<string> => {
    try {
      setLoading(true);
      
      const operatorId = import.meta.env.VITE_ACCOUNT_ID;
      const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
      
      if (!operatorId || !operatorKey) {
        throw new Error("Environment variables for Hedera are missing");
      }
      
      const client = Client.forTestnet();
      client.setOperator(
        AccountId.fromString(operatorId),
        PrivateKey.fromString(operatorKey)
      );

      const fileCreateTx = new FileCreateTransaction()
        .setKeys([PrivateKey.fromString(operatorKey)])
        .freezeWith(client);
      
      const fileCreateSign = await fileCreateTx.sign(PrivateKey.fromString(operatorKey));
      const fileCreateSubmit = await fileCreateSign.execute(client);
      const fileCreateRx = await fileCreateSubmit.getReceipt(client);
      const bytecodeFileId = fileCreateRx.fileId;
      
      console.log(`- The bytecode file ID is: ${bytecodeFileId}`);
      
      const fileAppendTx = new FileAppendTransaction()
        .setFileId(bytecodeFileId!)
        .setContents(bytecode)
        .setMaxChunks(10)
        .freezeWith(client);
      
      const fileAppendSign = await fileAppendTx.sign(PrivateKey.fromString(operatorKey));
      const fileAppendSubmit = await fileAppendSign.execute(client);
      await fileAppendSubmit.getReceipt(client);
      
      console.log(`- Content added to file`);
      
      const contractCreateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId!)
        .setGas(gasLimit)
        .freezeWith(client);
      
      const contractCreateSign = await contractCreateTx.sign(PrivateKey.fromString(operatorKey));
      const contractCreateSubmit = await contractCreateSign.execute(client);
      const contractCreateRx = await contractCreateSubmit.getReceipt(client);
      const contractId = contractCreateRx.contractId;
      
      console.log(`- The smart contract ID is: ${contractId}`);
      
      setLoading(false);
      return contractId ? contractId.toString() : "";
    } catch (error) {
      console.error("Error deploying contract:", error);
      setError("Failed to deploy contract");
      setLoading(false);
      throw error;
    }
  };

  const refreshBalance = async () => {
    if (accountId) {
      return fetchAccountBalance(accountId);
    }
    return "0";
  };

  return {
    loading,
    error,
    isConnected,
    accountId,
    ethAddress,
    balance,
    ethProvider,
    connectMetaMask,
    disconnectMetaMask,
    connectToHedera,
    disconnectFromHedera,
    fetchAccountBalance,
    refreshBalance,
    sendHbarToMetaMask,
    deployContract
  };
};
