import React from 'react';
import { useHedera } from '../hooks/useHedera';

const Auth: React.FC = () => {
  const { connectMetaMask, ethAddress, isConnected } = useHedera();

  const handleMetaMaskConnect = async () => {
    const success = await connectMetaMask();
    if (success) {
      console.log('MetaMask connected successfully');
    } else {
      console.error('Failed to connect MetaMask');
    }
  };

  return (
    <div>
      <button onClick={handleMetaMaskConnect}>Connect MetaMask</button>
      {isConnected && <p>Connected Address: {ethAddress}</p>}
    </div>
  );
};
export default Auth;
