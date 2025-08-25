import React from 'react';
import { useSui } from '../hooks/useSui';

const Auth: React.FC = () => {
  const { connectWallet, address, isConnected } = useSui();

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div>
      <button onClick={handleWalletConnect}>Connect Sui Wallet</button>
      {isConnected && <p>Connected Address: {address}</p>}
    </div>
  );
};
export default Auth;
