
import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  TransferTransaction,
  TransactionReceipt,
  AccountId
} from "@hashgraph/sdk";

// Helper function to initialize a Hedera client
export const initializeClient = (operatorId: string, operatorKey: string) => {
  if (!operatorId || !operatorKey) {
    throw new Error("Environment variables for Hedera are missing");
  }

  // For testnet - use Client.forTestnet()
  // For mainnet - use Client.forMainnet()
  return Client.forTestnet().setOperator(operatorId, operatorKey);
};

// Get account balance
export const getAccountBalance = async (accountId: string): Promise<string> => {
  try {
    const client = initializeClient(
      process.env.HEDERA_OPERATOR_ID || "",
      process.env.HEDERA_OPERATOR_KEY || ""
    );

    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    return balance.hbars.toString();
  } catch (error) {
    console.error("Error getting account balance:", error);
    throw error;
  }
};

// Transfer HBAR between accounts
export const transferHbar = async (
  fromAccountId: string,
  fromPrivateKey: string,
  toAccountId: string,
  amount: number
): Promise<string> => {
  try {
    const client = initializeClient(fromAccountId, fromPrivateKey);

    const transaction = await new TransferTransaction()
      .addHbarTransfer(fromAccountId, Hbar.fromTinybars(-amount))
      .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount))
      .execute(client);

    const receipt = await transaction.getReceipt(client);
    return receipt.status.toString();
  } catch (error) {
    console.error("Error transferring HBAR:", error);
    throw error;
  }
};

// Create a new account
export const createAccount = async (
  operatorId: string,
  operatorKey: string,
  initialBalance: number
): Promise<{ accountId: string; privateKey: string }> => {
  try {
    const client = initializeClient(operatorId, operatorKey);
    const newPrivateKey = PrivateKey.generateED25519();
    const newPublicKey = newPrivateKey.publicKey;

    const transaction = new AccountCreateTransaction()
      .setKey(newPublicKey)
      .setInitialBalance(new Hbar(initialBalance));

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
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
