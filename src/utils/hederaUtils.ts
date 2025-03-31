
import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  // TransferTransaction,
  TransactionReceipt,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
  TransferTransaction,
  TokenInfoQuery

} from "@hashgraph/sdk";

// Helper function to initialize a Hedera client from environment variables
export const initializeClient = () => {
  // Get environment variables
  const operatorId = import.meta.env.VITE_ACCOUNT_ID;
  const operatorKey = import.meta.env.VITE_PRIVATE_KEY;
  const network = import.meta.env.VITE_NETWORK || "testnet";

  if (!operatorId || !operatorKey) {
    throw new Error("Environment variables for Hedera are missing");
  }

  // Create client based on network setting
  const client = network === "mainnet" 
    ? Client.forMainnet() 
    : Client.forTestnet();
  
  client.setOperator(
    AccountId.fromString(operatorId),
    PrivateKey.fromString(operatorKey)
  );

  return client;
};

// Helper function to initialize with provided credentials (fallback for backward compatibility)
export const initializeClientWithCredentials = (operatorId: string, operatorKey: string) => {
  if (!operatorId || !operatorKey) {
    throw new Error("Hedera credentials are required");
  }

  // For testnet - use Client.forTestnet()
  // For mainnet - use Client.forMainnet()
  return Client.forTestnet().setOperator(operatorId, operatorKey);
};

// Get account balance
export const getAccountBalance = async (accountId: string): Promise<string> => {
  try {
    // Try to use environment variables first, fall back to credentials if needed
    let client;
    try {
      client = initializeClient();
    } catch (error) {
      console.warn("Using fallback client initialization");
      client = initializeClientWithCredentials(
        process.env.HEDERA_OPERATOR_ID || "",
        process.env.HEDERA_OPERATOR_KEY || ""
      );
    }

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
    const client = initializeClientWithCredentials(fromAccountId, fromPrivateKey);

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
    const client = initializeClientWithCredentials(operatorId, operatorKey);
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

// Create a fungible token (could be used for escrow payments)
export const createFungibleToken = async (
  client,
  name,
  symbol,
  initialSupply,
  decimals = 2,
  treasuryAccountId,
  treasuryKey
) => {
  try {
    const transaction = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(decimals)
      .setInitialSupply(initialSupply)
      .setTreasuryAccountId(treasuryAccountId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(treasuryKey)
      .setAdminKey(treasuryKey)
      .freezeWith(client);

    const signTx = await transaction.sign(treasuryKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    return receipt.tokenId.toString();
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
};

// Create a non-fungible token (for reputation badges or credentials)
export const createNFTCollection = async (
  client,
  name,
  symbol,
  treasuryAccountId,
  treasuryKey
) => {
  try {
    const transaction = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setTreasuryAccountId(treasuryAccountId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(treasuryKey)
      .setAdminKey(treasuryKey)
      .freezeWith(client);

    const signTx = await transaction.sign(treasuryKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    return receipt.tokenId.toString();
  } catch (error) {
    console.error("Error creating NFT collection:", error);
    throw error;
  }
};

// Associate a token with an account (required before receiving tokens)
export const associateTokenWithAccount = async (
  client,
  accountId,
  privateKey,
  tokenId
) => {
  try {
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId])
      .freezeWith(client);

    const signTx = await transaction.sign(privateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    return receipt.status.toString();
  } catch (error) {
    console.error("Error associating token:", error);
    throw error;
  }
};

// Transfer tokens between accounts
export const transferTokens = async (
  client,
  tokenId,
  senderAccountId,
  senderPrivateKey,
  receiverAccountId,
  amount
) => {
  try {
    const transaction = await new TransferTransaction()
      .addTokenTransfer(tokenId, senderAccountId, -amount)
      .addTokenTransfer(tokenId, receiverAccountId, amount)
      .freezeWith(client);

    const signTx = await transaction.sign(senderPrivateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    
    return receipt.status.toString();
  } catch (error) {
    console.error("Error transferring tokens:", error);
    throw error;
  }
};
