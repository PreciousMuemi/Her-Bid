import { ContractData, SavedContract } from '../types/contract';
import { API_URL } from '../config';

export const saveContractToDB = async (
  contractData: ContractData,
  contractAddress: string,
  walletAddress: string
) => {
  try {
    const response = await fetch(`${API_URL}/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...contractData,
        contractAddress,
        issuerAddress: walletAddress,
        status: 'pending',
        createdAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save contract to database');
    }

    return await response.json();
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
};

export const getContractDetails = async (contractId: string): Promise<SavedContract> => {
  try {
    const response = await fetch(`${API_URL}/contracts/${contractId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch contract details');
    }
    return await response.json();
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
};

export const updateBidStatus = async (bidId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/bids/${bidId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update bid status');
    }
  } catch (error) {
    console.error('Bid status update error:', error);
    throw error;
  }
};

export const getContracts = async (walletAddress: string): Promise<SavedContract[]> => {
  try {
    const response = await fetch(`${API_URL}/contracts?issuer=${walletAddress}`);
    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }
    return await response.json();
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
};
