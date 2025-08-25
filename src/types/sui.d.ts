
// Sui Wallet interface for browser extension
interface Window {
  suiWallet?: {
    connect: () => Promise<{ accounts: string[] }>;
    disconnect: () => Promise<void>;
    signAndExecuteTransactionBlock: (transaction: any) => Promise<any>;
    getAccounts: () => Promise<string[]>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    off: (eventName: string, callback: (...args: any[]) => void) => void;
  };
}
