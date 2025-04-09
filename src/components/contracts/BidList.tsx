import React from 'react';
import { User, DollarSign, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bid } from '@/types/contract';

interface BidListProps {
  bids: Bid[];
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
}

const BidList: React.FC<BidListProps> = ({ bids, onAccept, onReject }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {bids.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bids received yet</p>
        </div>
      ) : (
        bids.map((bid) => (
          <div key={bid.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{bid.bidderAddress.substring(0, 8)}...{bid.bidderAddress.substring(bid.bidderAddress.length - 4)}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span>${bid.bidAmount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(bid.status)}
                <span className="text-sm capitalize">{bid.status}</span>
              </div>
            </div>
            
            <div className="mt-4 pl-11">
              <div className="flex items-start space-x-2 text-sm">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">{bid.proposal}</p>
              </div>
              
              {bid.status === 'pending' && (
                <div className="flex space-x-2 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => onAccept(bid.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onReject(bid.id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BidList;
