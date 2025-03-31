import React, { useState } from 'react';
import { useHedera } from '../contexts/HederaContext';

const TokenCreator: React.FC = () => {
  const { createToken } = useHedera();
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    try {
      const tokenId = await createToken(tokenName, tokenSymbol, initialSupply);
      setResult(`Token created successfully! Token ID: ${tokenId}`);
    } catch (error) {
      setResult(`Error creating token: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Token</h2>
      <form onSubmit={handleCreateToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Token Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
          <input
            type="number"
            value={initialSupply}
            onChange={(e) => setInitialSupply(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Creating...' : 'Create Token'}
        </button>
      </form>
      {result && (
        <div className={`mt-4 p-3 rounded-md ${result.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default TokenCreator;
