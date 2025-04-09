import { useState } from 'react';
import { ethers } from 'ethers';

const HEDERA_CHAIN_ID = '0x128'; // Hedera Mainnet chain ID 296
const HEDERA_TESTNET_CHAIN_ID = '0x128'; // Hedera Testnet chain ID 296

interface HederaHook {
  connectMetaMask: () => Promise<boolean>;
  ethAddress: string;
  accountId: string;
  balance: string;
  isConnected: boolean;
  error: string;
  signer?: ethers.Signer;
  ethProvider?: ethers.providers.Web3Provider;
}

const useHedera = (): HederaHook => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<ethers.Signer>();

  const connectMetaMask = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setEthProvider(provider);
      
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      if (network.chainId.toString() !== HEDERA_CHAIN_ID && 
          network.chainId.toString() !== HEDERA_TESTNET_CHAIN_ID) {
        throw new Error('Please connect to Hedera Network (ChainID: 296)');
      }
      
      const signer = provider.getSigner();
      setSigner(signer);
      
      const address = await signer.getAddress();
      setEthAddress(address);
      
      setIsConnected(true);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    connectMetaMask,
    ethAddress,
    accountId,
    balance,
    isConnected,
    error,
    signer,
    ethProvider
  };
};

export default useHedera;
