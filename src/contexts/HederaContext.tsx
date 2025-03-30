
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import { toast } from "sonner";

type HederaContextType = {
  client: Client | null;
  isConnected: boolean;
  accountId: string;
  connectToHedera: (operatorId: string, operatorKey: string) => void;
  disconnectFromHedera: () => void;
};

const HederaContext = createContext<HederaContextType | undefined>(undefined);

export const HederaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

  return (
    <HederaContext.Provider
      value={{
        client,
        isConnected,
        accountId,
        connectToHedera,
        disconnectFromHedera
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
