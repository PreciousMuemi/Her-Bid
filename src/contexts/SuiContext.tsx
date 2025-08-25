import React, { createContext, useContext, useState, ReactNode } from "react";

type SuiContextType = {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  // Simplified functions for now
  executeMoveFunction: (packageId: string, module: string, functionName: string, args?: any[]) => Promise<any>;
  deployContract: (bytecode: Uint8Array) => Promise<string>;
  getBalance: () => Promise<void>;
};

const SuiContext = createContext<SuiContextType | undefined>(undefined);

export const useSui = () => {
  const context = useContext(SuiContext);
  if (context === undefined) {
    throw new Error("useSui must be used within a SuiProvider");
  }
  return context;
};

type SuiProviderProps = {
  children: ReactNode;
};

export const SuiProvider: React.FC<SuiProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      // Simplified wallet connection - will implement proper Sui wallet integration later
      const mockAddress = "0x1234567890abcdef"; // Mock address for now
      setAddress(mockAddress);
      setIsConnected(true);
      setBalance("100.00"); // Mock balance
      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    console.log("Wallet disconnected");
  };

  const executeMoveFunction = async (packageId: string, module: string, functionName: string, args?: any[]) => {
    // Simplified implementation - will add proper Move function execution later
    console.log(`Executing Move function: ${packageId}::${module}::${functionName}`, args);
    return { success: true, result: "Mock execution result" };
  };

  const deployContract = async (bytecode: Uint8Array) => {
    // Simplified implementation - will add proper contract deployment later
    console.log("Deploying contract", bytecode);
    return "0xmockcontractaddress";
  };

  const getBalance = async () => {
    // Simplified implementation
    if (isConnected) {
      setBalance("100.00");
    }
  };

  const value = {
    isConnected,
    address,
    balance,
    connectWallet,
    disconnectWallet,
    executeMoveFunction,
    deployContract,
    getBalance,
  };

  return <SuiContext.Provider value={value}>{children}</SuiContext.Provider>;
};