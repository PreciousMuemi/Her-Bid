
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import { toast } from "sonner";
import { ethers } from "ethers";

type HederaContextType = {
  client: Client | null;
  isConnected: boolean;
  accountId: string;
  connectToHedera: (operatorId: string, operatorKey: string) => void;
  disconnectFromHedera: () => void;
  // MetaMask connection
  ethAddress: string;
  ethProvider: ethers.providers.Web3Provider | null;
  connectMetaMask: () => Promise<boolean>;
  disconnectMetaMask: () => void;
};

const HederaContext = createContext<HederaContextType | undefined>(undefined);

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // MetaMask states
  const [ethAddress, setEthAddress] = useState<string>("");
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectToHedera = (operatorId: string, operatorKey: string) => {
    try {
      if (!operatorId || !operatorKey) {
        toast.error("Operator ID and Private Key are required");
        return;
      }

      // Initialize client - using testnet by default
      const hederaClient = Client.forTestnet();
      hederaClient.setOperator(AccountId.fromString(operatorId), PrivateKey.fromString(operatorKey));
      
      setClient(hederaClient);
      setAccountId(operatorId);
      setIsConnected(true);
      
      toast.success("Connected to Hedera Testnet");
    } catch (error) {
      console.error("Error connecting to Hedera:", error);
      toast.error("Failed to connect to Hedera");
    }
  };

  const disconnectFromHedera = () => {
    setClient(null);
    setAccountId("");
    setIsConnected(false);
    toast.info("Disconnected from Hedera");
  };

  // MetaMask connection functions
  const connectMetaMask = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask first.");
        return false;
      }

      // Create Ethers provider
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      
      // Switch to Hedera testnet
      console.log("Switching network to Hedera testnet...");
      const chainId = "0x128"; // testnet chainId

      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Hedera testnet",
              chainId: chainId,
              nativeCurrency: { name: "HBAR", symbol: "ℏ", decimals: 18 },
              rpcUrls: ["https://testnet.hashio.io/api"],
              blockExplorerUrls: ["https://hashscan.io/testnet/"],
            },
          ],
        });
      } catch (switchError) {
        console.error("Error switching to Hedera network:", switchError);
        toast.error("Failed to switch to Hedera network");
        return false;
      }

      // Connect to account
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];
      
      setEthAddress(selectedAccount);
      setEthProvider(provider);
      toast.success("Connected to MetaMask wallet");
      
      console.log(`Connected to account: ${selectedAccount}`);
      return true;
    } catch (error) {
      console.error("Error connecting MetaMask wallet:", error);
      toast.error("Failed to connect MetaMask wallet");
      return false;
    }
  };

  const disconnectMetaMask = () => {
    setEthAddress("");
    setEthProvider(null);
    toast.info("Disconnected from MetaMask");
  };

  return (
    <HederaContext.Provider
      value={{
        client,
        isConnected,
        accountId,
        connectToHedera,
        disconnectFromHedera,
        // MetaMask connection
        ethAddress,
        ethProvider,
        connectMetaMask,
        disconnectMetaMask
      }}
    >
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
