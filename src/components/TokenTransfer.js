import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { ethers } from 'ethers';

function TokenTransfer({ account, provider }) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });

  const transferHBAR = async () => {
    if (!account || !provider || !recipient || !amount) {
      setStatus({ message: 'Please fill all fields', isError: true });
      return;
    }

    try {
      setStatus({ message: 'Processing transfer...', isError: false });
      
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount)
      });
      
      setStatus({ message: `Transfer initiated! Transaction hash: ${tx.hash}`, isError: false });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      setStatus({ message: `Transfer successful! Block number: ${receipt.blockNumber}`, isError: false });
    } catch (error) {
      console.error('Transfer error:', error);
      setStatus({ message: `Transfer failed: ${error.message}`, isError: true });
    }
  };

  return (
    <Box sx={{ my: 4, p: 2, border: '1px solid #eaeaea', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transfer HBAR
      </Typography>
      
      <TextField
        label="Recipient Address"
        fullWidth
        margin="normal"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0.0.12345 or 0x..."
      />
      
      <TextField
        label="Amount (HBAR)"
        type="number"
        fullWidth
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputProps={{ min: 0, step: 0.01 }}
      />
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={transferHBAR}
        disabled={!account}
      >
        Send HBAR
      </Button>
      
      {status.message && (
        <Alert severity={status.isError ? "error" : "success"} sx={{ mt: 2 }}>
          {status.message}
        </Alert>
      )}
    </Box>
  );
}

export default TokenTransfer;