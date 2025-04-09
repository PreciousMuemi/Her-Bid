import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EscrowManagerProps {
  escrowAddress: string;
  amount: string;
  status: 'pending' | 'released' | 'disputed';
  onRelease: () => Promise<void>;
  onDispute: () => Promise<void>;
}

const EscrowManager: React.FC<EscrowManagerProps> = ({
  escrowAddress,
  amount,
  status,
  onRelease,
  onDispute
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case 'released': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disputed': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleRelease = async () => {
    setIsProcessing(true);
    try {
      await onRelease();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispute = async () => {
    setIsProcessing(true);
    try {
      await onDispute();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium">Escrow Contract</span>
        </div>
        <span className="text-sm text-gray-500">{escrowAddress.substring(0, 8)}...{escrowAddress.slice(-4)}</span>
      </div>

      <div className="flex items-center space-x-2">
        <DollarSign className="h-4 w-4" />
        <span>Amount: {amount} HBAR</span>
      </div>

      <div className="flex space-x-2 pt-2">
        {status === 'pending' && (
          <>
            <Button 
              size="sm" 
              onClick={handleRelease}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Release Payment'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDispute}
              disabled={isProcessing}
            >
              Dispute
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EscrowManager;
