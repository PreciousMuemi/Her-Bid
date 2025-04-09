import React from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidList from './BidList';
import EscrowManager from './EscrowManager';
import { getContractDetails, updateBidStatus } from '@/services/databaseService';
import { acceptBid, createEscrow, releaseEscrowFunds, initiateEscrowDispute } from '@/services/contractService';
import useHedera from '@/hooks/useHedera_fixed_v2';
import { SavedContract } from '@/types/contract';
import { toast } from 'sonner';

const ContractDetails = () => {
  const { contractId } = useParams();
  const [contract, setContract] = React.useState<SavedContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { connectMetaMask, signer } = useHedera();

  React.useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const data = await getContractDetails(contractId!);
        setContract(data);
      } catch (error) {
        console.error('Failed to fetch contract:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const handleReleaseFunds = async () => {
    if (!signer || !contract?.escrowAddress) return;
    try {
      await releaseEscrowFunds(contract.escrowAddress, signer);
      const updated = await getContractDetails(contractId!);
      setContract(updated);
      toast.success('Funds released successfully');
    } catch (error) {
      console.error('Failed to release funds:', error);
      toast.error('Failed to release funds');
    }
  };

  const handleInitiateDispute = async () => {
    if (!signer || !contract?.escrowAddress) return;
    try {
      await initiateEscrowDispute(contract.escrowAddress, signer);
      const updated = await getContractDetails(contractId!);
      setContract({...updated, escrowStatus: 'disputed'});
      toast.success('Dispute initiated successfully');
    } catch (error) {
      console.error('Failed to initiate dispute:', error);
      toast.error('Failed to initiate dispute');
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      const isConnected = await connectMetaMask();
      if (!isConnected || !signer) {
        throw new Error('Failed to connect wallet');
      }
      
      await updateBidStatus(bidId, 'accepted');
      const bidIndex = contract!.bids.findIndex(b => b.id === bidId);
      const bid = contract!.bids[bidIndex];
      
      const escrowAddress = await createEscrow(
        bid.bidderAddress,
        bid.bidAmount.toString(),
        signer
      );
      
      await acceptBid(contract!.contractAddress, bidIndex, signer);
      
      const updated = await getContractDetails(contractId!);
      setContract(updated);
      toast.success(`Bid accepted and escrow created at ${escrowAddress}`);
    } catch (error) {
      console.error('Failed to accept bid:', error);
      toast.error('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      await updateBidStatus(bidId, 'rejected');
      const updated = await getContractDetails(contractId!);
      setContract(updated);
      toast.success('Bid rejected successfully');
    } catch (error) {
      console.error('Failed to reject bid:', error);
      toast.error('Failed to reject bid');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!contract) {
    return <div className="text-center py-12">
      <p className="text-gray-500">Contract not found</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contract Details</h2>
        <div className="flex items-center space-x-2">
          {getStatusIcon(contract.status)}
          <span className="text-sm capitalize">{contract.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{contract.title}</h3>
            <p className="text-gray-500 mt-1">{contract.description}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Details</h4>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Budget: ${contract.budget}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {new Date(contract.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Required Skills: {contract.skillsRequired}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Bids</h4>
            <BidList 
              bids={contract.bids || []}
              onAccept={handleAcceptBid}
              onReject={handleRejectBid}
            />
          </div>

          {contract.escrowAddress && (
            <EscrowManager 
              escrowAddress={contract.escrowAddress}
              amount={contract.budget.toString()}
              status={contract.escrowStatus || 'pending'}
              onRelease={handleReleaseFunds}
              onDispute={handleInitiateDispute}
            />
          )}

          <div className="flex space-x-2">
            <Button variant="outline">Edit Contract</Button>
            <Button>Manage Bids</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
