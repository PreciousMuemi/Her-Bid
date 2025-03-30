import React, { useState } from 'react';
import { Container, Typography, Box, CssBaseline, AppBar, Toolbar } from '@mui/material';
import WalletConnect from './components/WalletConnect';
import AccountBalance from './components/AccountBalance';

function App() {
  const [account, setAccount] = useState('');
  
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            My Hedera dApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to My Hedera dApp
          </Typography>
          
          <WalletConnect onConnect={(account) => setAccount(account)} />
          
          {account && <AccountBalance account={account} />}
        </Box>
      </Container>
    </>
  );
}

export default App;