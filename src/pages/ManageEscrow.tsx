import React, { useState } from 'react';
import { useHedera } from '../contexts/HederaContext';
import ContractInteraction from '../pages/ContractInteraction';

// Sample escrow contract bytecode and ABI
const ESCROW_CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b50..."; // Replace with actual bytecode
const ESCROW_CONTRACT_ABI = []; // Replace with actual ABI

const ManageEscrow: React.FC = () => {
  const { isConnected, accountId, deployContract } = useHedera();
  const [escrowContractId, setEscrowContractId] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  const deployEscrowContract = async () => {
    setIsDeploying(true);
    try {
      const contractId = await deployContract(ESCROW_CONTRACT_BYTECODE);
      setEscrowContractId(contractId);
    } catch (error) {
      console.error("Error deploying escrow contract:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Escrow Management</h1>
        <p className="mb-4">Please connect your wallet to manage escrow contracts.</p>
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
      <h1 className="text-2xl font-bold mb-6">Escrow Management</h1>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm">Connected Account: <span className="font-mono">{accountId}</span></p>
        {escrowContractId && (
          <p className="text-sm mt-2">Escrow Contract ID: <span className="font-mono">{escrowContractId}</span></p>
        )}
      </div>
      
      {!escrowContractId ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Deploy Escrow Contract</h2>
          <p className="mb-4">Deploy a new escrow contract to manage milestone-based payments for your consortium.</p>
          <button
            onClick={deployEscrowContract}
            disabled={isDeploying}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isDeploying ? 'Deploying...' : 'Deploy Escrow Contract'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create Milestone</h2>
            <ContractInteraction />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Release Funds</h2>
            <ContractInteraction />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEscrow;
// Note: The above code assumes that the ContractInteraction component is capable of handling the specific interactions with the escrow contract.