import React from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidList from './BidList';
import { getContractDetails, updateBidStatus } from '@/services/databaseService';
import { acceptBid, createEscrow } from '@/services/contractService';
import useHedera from '@/hooks/useHedera_fixed_v2';
import { SavedContract } from '@/types/contract';
import { toast } from 'sonner';
import EscrowManager from './EscrowManager';

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

  // ... rest of the component code ...

  return (
    <div className="space-y-6">
      {/* Existing contract details rendering */}
      {contract?.escrowAddress && (
        <EscrowManager 
          escrowAddress={contract.escrowAddress}
          amount={contract.budget.toString()}
          status={contract.escrowStatus || 'pending'}
          onRelease={handleReleaseFunds}
          onDispute={handleInitiateDispute}
        />
      )}
    </div>
  );
};

export default ContractDetails;
