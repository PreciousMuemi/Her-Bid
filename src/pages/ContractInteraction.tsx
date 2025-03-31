// src/components/ContractInteraction.tsx
import React, { useState } from 'react';
import { useHedera } from '../contexts/HederaContext';

const ContractInteraction: React.FC = () => {
  const { executeContract, callContract } = useHedera();
  const [contractId, setContractId] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [params, setParams] = useState('');
  const [isStateChanging, setIsStateChanging] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleInteractWithContract = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    try {
      // Parse params as JSON array
      const parsedParams = params ? JSON.parse(params) : [];
      
      if (isStateChanging) {
        const status = await executeContract(contractId, functionName, parsedParams);
        setResult(`Contract function executed successfully! Status: ${status}`);
      } else {
        const response = await callContract(contractId, functionName, parsedParams);
        setResult(`Contract function called successfully! Result: ${JSON.stringify(response)}`);
      }
    } catch (error) {
      setResult(`Error interacting with contract: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Interact with Smart Contract</h2>
      <form onSubmit={handleInteractWithContract}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contract ID</label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="0.0.12345"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Function Name</label>
          <input
            type="text"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="increment"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Parameters (JSON array)</label>
          <textarea
            value={params}
            onChange={(e) => setParams(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
            placeholder='["param1", 123]'
          />
          <p className="text-xs text-gray-500 mt-1">Enter parameters as a JSON array</p>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isStateChanging}
              onChange={(e) => setIsStateChanging(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">This function changes contract state</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Processing...' : isStateChanging ? 'Execute Function' : 'Call Function'}
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

export default ContractInteraction;
