
import React, { useState } from 'react';
import { useHedera } from '../hooks/useHedera';
import ContractDeployer from '../components/ContractDeployer';

// Sample consortium contract bytecode (placeholder)
const CONSORTIUM_CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b50..."; // Replace with actual bytecode

const CreateConsortium: React.FC = () => {
  const [consortiumName, setConsortiumName] = useState('');
  const [requiredApprovals, setRequiredApprovals] = useState(2);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  
  // Get account ID from localStorage
  const accountId = localStorage.getItem('hederaAccount') || '';
  const isConnected = !!accountId;

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setResult(null);
    
    try {
      // Placeholder for actual token creation
      const mockTokenId = "0.0.12345";
      setTokenId(mockTokenId);
      setResult(`Token created successfully! Token ID: ${mockTokenId}`);
      setStep(2);
    } catch (error) {
      setResult(`Error creating token: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeployContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId) return;
    
    setIsCreating(true);
    setResult(null);
    
    try {
      // Placeholder for actual contract deployment
      const mockContractId = "0.0.54321";
      setContractId(mockContractId);
      setResult(`Consortium contract deployed successfully! Contract ID: ${mockContractId}`);
      setStep(3);
    } catch (error) {
      setResult(`Error deploying contract: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Create Consortium</h1>
        <p className="mb-4">Please connect your wallet to create a consortium.</p>
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
      <h1 className="text-2xl font-bold mb-6">Create a New Consortium</h1>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm">Connected Account: <span className="font-mono">{accountId}</span></p>
        {tokenId && (
          <p className="text-sm mt-2">Consortium Token ID: <span className="font-mono">{tokenId}</span></p>
        )}
        {contractId && (
          <p className="text-sm mt-2">Consortium Contract ID: <span className="font-mono">{contractId}</span></p>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex mb-6">
          <div className={`flex-1 pb-2 ${step === 1 ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'border-b text-gray-500'}`}>
            1. Create Token
          </div>
          <div className={`flex-1 pb-2 ${step === 2 ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'border-b text-gray-500'}`}>
            2. Deploy Contract
          </div>
          <div className={`flex-1 pb-2 ${step === 3 ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'border-b text-gray-500'}`}>
            3. Complete
          </div>
        </div>
        
        {step === 1 && (
          <form onSubmit={handleCreateToken}>
            <h2 className="text-xl font-semibold mb-4">Step 1: Create Consortium Token</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Consortium Name</label>
              <input
                type="text"
                value={consortiumName}
                onChange={(e) => setConsortiumName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
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
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isCreating ? 'Creating Token...' : 'Create Token'}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleDeployContract}>
            <h2 className="text-xl font-semibold mb-4">Step 2: Deploy Consortium Contract</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Approvals</label>
              <input
                type="number"
                value={requiredApprovals}
                onChange={(e) => setRequiredApprovals(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Number of members required to approve proposals</p>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isCreating ? 'Deploying Contract...' : 'Deploy Contract'}
            </button>
          </form>
        )}
        
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Consortium Created Successfully!</h2>
            <p className="mb-6">Your consortium has been created with the following details:</p>
            <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
              <p><strong>Consortium Name:</strong> {consortiumName}</p>
              <p><strong>Token:</strong> {tokenName} ({tokenSymbol})</p>
              <p><strong>Token ID:</strong> {tokenId}</p>
              <p><strong>Contract ID:</strong> {contractId}</p>
              <p><strong>Required Approvals:</strong> {requiredApprovals}</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
      
      {result && (
        <div className={`mt-4 p-3 rounded-md ${result.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {result}
        </div>
      )}
    </div>
  );
};

export default CreateConsortium;
