import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { ethers } from "ethers";

function WalletConnect() {
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [provider, setProvider] = useState(null);

  async function connectWallet() {
    try {
      // ETHERS PROVIDER
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      setProvider(provider);

      // SWITCH TO HEDERA TEST NETWORK
      console.log(`- Switching network to Hedera testnet...`);
      const chainId = "0x128"; // testnet

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: `Hedera testnet`,
            chainId: chainId,
            nativeCurrency: { name: "HBAR", symbol: "ℏ", decimals: 18 },
            rpcUrls: [`https://testnet.hashio.io/api`],
            blockExplorerUrls: [`https://hashscan.io/testnet/`],
          },
        ],
      });

      // CONNECT TO ACCOUNT
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];
      setAccount(selectedAccount);
      setNetwork('testnet');
      
      console.log(`- Connected to account: ${selectedAccount}`);
      return [selectedAccount, provider, 'testnet'];
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  return (
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Connect Your Wallet
      </Typography>
      
      {!account ? (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={connectWallet}
        >
          Connect MetaMask
        </Button>
      ) : (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1">
            Connected to: {account}
          </Typography>
          <Typography variant="body2">
            Network: Hedera {network}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default WalletConnect;