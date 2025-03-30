
import { useState } from "react";
import {
  getAccountBalance,
  transferHbar,
  createAccount
} from "../utils/hederaUtils";

export const useHedera = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get account balance
  const fetchAccountBalance = async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const balance = await getAccountBalance(accountId);
      setLoading(false);
      return balance;
    } catch (err) {
      setError("Failed to fetch account balance");
      setLoading(false);
      console.error(err);
      return null;
    }
  };

  // Transfer HBAR
  const sendHbar = async (
    fromAccountId: string,
    fromPrivateKey: string,
    toAccountId: string,
    amount: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const status = await transferHbar(
        fromAccountId,
        fromPrivateKey,
        toAccountId,
        amount
      );
      setLoading(false);
      return status;
    } catch (err) {
      setError("Failed to transfer HBAR");
      setLoading(false);
      console.error(err);
      return null;
    }
  };

  // Create new account
  const generateNewAccount = async (
    operatorId: string,
    operatorKey: string,
    initialBalance: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newAccount = await createAccount(
        operatorId,
        operatorKey,
        initialBalance
      );
      setLoading(false);
      return newAccount;
    } catch (err) {
      setError("Failed to create new account");
      setLoading(false);
      console.error(err);
      return null;
    }
  };

  return {
    loading,
    error,
    fetchAccountBalance,
    sendHbar,
    generateNewAccount
  };
};
