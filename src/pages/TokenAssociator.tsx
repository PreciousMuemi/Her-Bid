
// src/components/TokenAssociator.tsx
import React, { useState } from 'react';
import { useHedera } from '../contexts/HederaContext';

const TokenAssociator: React.FC = () => {
  const { associateToken } = useHedera();
  const [tokenId, setTokenId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAssociateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    try {
      const status = await associateToken(tokenId);
      setResult(`Token associated successfully! Status: ${status}`);
    } catch (error) {
      setResult(`Error associating token: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Associate Token</h2>
      <form onSubmit={handleAssociateToken}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.0.12345"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Associating...' : 'Associate Token'}
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

export default TokenAssociator;
