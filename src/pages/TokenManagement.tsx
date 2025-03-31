import React from 'react';
import { useHedera } from '../contexts/HederaContext';
import TokenCreator from './TokenCreator';
import TokenAssociator from './TokenAssociator';

// import TokenTransfer from '../components/TokenTransfer';

const TokenManagement: React.FC = () => {
  const { isConnected, accountId, balance } = useHedera();

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Token Management</h1>
        <p className="mb-4">Please connect your wallet to manage tokens.</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Token Management</h1>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm">Connected Account: <span className="font-mono">{accountId}</span></p>
        <p className="text-sm">Balance: {balance} HBAR</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TokenCreator />
        <TokenAssociator />
      
      </div>
    </div>
  );
};

export default TokenManagement;
