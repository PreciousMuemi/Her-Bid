import React, { useState, useEffect } from 'react';
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';

function AccountBalance({ account }) {
  const [balance, setBalance] = useState(null);
  
  const fetchBalance = async () => {
    if (!account) return;
    
    try {
      // Convert Ethereum address to Hedera account ID format
      const response = await axios.get(
        `https://testnet.mirrornode.hedera.com/api/v1/accounts/${account}`
      );
      
      if (response.data) {
        // Convert from tinybars to HBAR
        const hbarBalance = response.data.balance.balance / 100000000;
        setBalance(hbarBalance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    }
  };
  
  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account]);
  
  return (
    <Box sx={{ my: 2, textAlign: 'center' }}>
      <Typography variant="h6">Account Balance</Typography>
      
      {balance !== null ? (
        <Typography variant="body1">
          {balance} ℏ
        </Typography>
      ) : (
        <Typography variant="body2">
          Connect your wallet to view balance
        </Typography>
      )}
      
      {account && (
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
          onClick={fetchBalance}
        >
          Refresh Balance
        </Button>
      )}
    </Box>
  );
}

export default AccountBalance;