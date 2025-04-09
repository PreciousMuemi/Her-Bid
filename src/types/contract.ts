export interface ContractData {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  skillsRequired: string;
}

export interface Bid {
  id: string;
  bidderAddress: string;
  bidAmount: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SavedContract extends ContractData {
  id: string;
  contractAddress: string;
  issuerAddress: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  bids: Bid[];
  escrowAddress?: string;
  escrowStatus?: 'pending' | 'released' | 'disputed';
}
