import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({ url: getFullnodeUrl('devnet') });

export const suiEscrow = {
  async openEscrow({ projectId, usdcAmount, milestones }:{ projectId: string; usdcAmount: number; milestones: Array<{id:string; amountKES:number}> }){
    // TODO: Call Sui Move contract to create escrow object, deposit USDC
    return { projectId, escrowObjectId: '0xESCROW', usdcAmount, milestones };
  },
  async releaseMilestone({ projectId, milestoneId }:{ projectId: string; milestoneId: string }){
    // TODO: Call Sui Move contract to release milestone funds
    return { projectId, milestoneId, usdcAmount: 100 };
  }
};
