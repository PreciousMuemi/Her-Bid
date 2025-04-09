import React from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Calendar, DollarSign, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BidList from './BidList';
import { getContractDetails, updateBidStatus } from '@/services/databaseService';
import { acceptBid, createEscrow } from '@/services/contractService';
import { useHedera } from '@/hooks/useHedera_fixed_v2';
import { SavedContract } from '@/types/contract';
import { toast } from 'sonner';

const ContractDetails = () => {
  const { contractId } = useParams();
  const [contract, setContract] = React.useState<SavedContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { ethAddress, connectMetaMask } = useHedera();

  // ... (keep existing useEffect and other methods)

  const handleAcceptBid = async (bidId: string) => {
    try {
      const isConnected = await connectMetaMask();
      if (!isConnected) {
        throw new Error('Failed to connect wallet');
      }
      const { signer } = useHedera();
      await updateBidStatus(bidId, 'accepted');
      
      const bidIndex = contract!.bids.findIndex(b => b.id === bidId);
      const bid = contract!.bids[bidIndex];
      
      // Create escrow
      const escrowAddress = await createEscrow(
        bid.bidderAddress,
        bid.bidAmount.toString(),
        signer
      );
      
      // Accept bid on main contract
      await acceptBid(contract!.contractAddress, bidIndex, signer);
      
      // Update UI
      const updated = await getContractDetails(contractId!);
      setContract(updated);
      toast.success(`Bid accepted and escrow created at ${escrowAddress}`);
    } catch (error) {
      console.error('Failed to accept bid:', error);
      toast.error('Failed to accept bid');
    }
  };

  // ... (rest of the existing component code)
};

export default ContractDetails;
