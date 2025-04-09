import React, { useEffect, useState } from 'react';
import { Briefcase, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContracts } from '@/services/databaseService';
import { useHedera } from '@/hooks/useHedera';
import { SavedContract } from '@/types/contract';

const ContractsList = () => {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const { connectMetaMask, ethAddress } = useHedera();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await getContracts(ethAddress);
        setContracts(data);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchContracts();
    }
  }, [walletAddress]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Contracts</h2>
        <Button onClick={() => window.location.href = '/create-contract'}>
          New Contract
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No contracts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{contract.title}</h3>
                  <p className="text-sm text-gray-500">{contract.description.substring(0, 100)}...</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(contract.status)}
                  <span className="text-sm capitalize">{contract.status}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>${contract.budget}</span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractsList;
