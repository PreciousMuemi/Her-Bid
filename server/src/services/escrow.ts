import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matchmaker from './matchmaker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EscrowTransaction {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'secured' | 'released' | 'completed';
  mpesa_reference: string;
  created_at: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  team_member_id: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'paid';
  confirmed_at?: string;
  paid_at?: string;
  mpesa_transaction_id?: string;
}

export class EscrowService {
  private transactionsFile: string;

  constructor() {
    this.transactionsFile = path.resolve(__dirname, '../../data/transactions.json');
    this.ensureTransactionsFile();
  }

  private ensureTransactionsFile() {
    if (!fs.existsSync(this.transactionsFile)) {
      fs.writeFileSync(this.transactionsFile, JSON.stringify({ transactions: [] }, null, 2));
    }
  }

  private loadTransactions(): { transactions: EscrowTransaction[] } {
    try {
      const data = fs.readFileSync(this.transactionsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      return { transactions: [] };
    }
  }

  private saveTransactions(data: { transactions: EscrowTransaction[] }) {
    try {
      fs.writeFileSync(this.transactionsFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  public async secureFunds(projectId: string, amount: number, phoneNumber: string): Promise<{
    success: boolean;
    transaction_id: string;
    mpesa_reference: string;
    message: string;
  }> {
    try {
      // Simulate M-Pesa STK Push
      console.log(`🔄 Simulating M-Pesa STK Push for KES ${amount} from ${phoneNumber}`);
      
      // Generate mock M-Pesa reference
      const mpesaRef = `MPX${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create transaction
      const transaction: EscrowTransaction = {
        id: `txn_${Date.now()}`,
        project_id: projectId,
        amount: amount,
        status: 'secured',
        mpesa_reference: mpesaRef,
        created_at: new Date().toISOString(),
        milestones: []
      };

      // Get project and create milestones for team members
      const project = matchmaker.getProjectById(projectId);
      if (project && project.team_assigned) {
        const teamSize = project.team_assigned.length;
        const amountPerMember = Math.floor(amount / teamSize);
        
        transaction.milestones = project.team_assigned.map((memberId, index) => ({
          id: `milestone_${transaction.id}_${index + 1}`,
          team_member_id: memberId,
          amount: amountPerMember,
          status: 'pending' as const
        }));
      }

      // Save transaction
      const data = this.loadTransactions();
      data.transactions.push(transaction);
      this.saveTransactions(data);

      // Update project status
      this.updateProjectEscrowStatus(projectId, 'funds_in_escrow');

      console.log(`✅ Funds secured successfully. M-Pesa Ref: ${mpesaRef}`);

      return {
        success: true,
        transaction_id: transaction.id,
        mpesa_reference: mpesaRef,
        message: `KES ${amount} successfully secured in escrow. M-Pesa Reference: ${mpesaRef}`
      };

    } catch (error) {
      console.error('Error securing funds:', error);
      return {
        success: false,
        transaction_id: '',
        mpesa_reference: '',
        message: 'Failed to secure funds. Please try again.'
      };
    }
  }

  public async confirmMilestone(projectId: string, teamMemberId: string): Promise<{
    success: boolean;
    payment_amount: number;
    mpesa_transaction_id: string;
    message: string;
  }> {
    try {
      const data = this.loadTransactions();
      const transaction = data.transactions.find(t => t.project_id === projectId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const milestone = transaction.milestones.find(m => m.team_member_id === teamMemberId);
      
      if (!milestone) {
        throw new Error('Milestone not found');
      }

      if (milestone.status !== 'pending') {
        throw new Error('Milestone already processed');
      }

      // Update milestone status
      milestone.status = 'confirmed';
      milestone.confirmed_at = new Date().toISOString();

      // Simulate M-Pesa payment
      const mpesaTransactionId = `MP${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      console.log(`🔄 Processing M-Pesa payment of KES ${milestone.amount} to team member ${teamMemberId}`);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      milestone.status = 'paid';
      milestone.paid_at = new Date().toISOString();
      milestone.mpesa_transaction_id = mpesaTransactionId;

      // Save updated transaction
      this.saveTransactions(data);

      // Get team member details
      const teamMember = matchmaker.getUserById(teamMemberId);
      const memberName = teamMember ? teamMember.name : 'Team Member';

      console.log(`✅ Payment sent to ${memberName}'s M-Pesa account: ${mpesaTransactionId}`);

      return {
        success: true,
        payment_amount: milestone.amount,
        mpesa_transaction_id: mpesaTransactionId,
        message: `Payment of KES ${milestone.amount} sent to ${memberName}'s M-Pesa account. Transaction ID: ${mpesaTransactionId}`
      };

    } catch (error) {
      console.error('Error confirming milestone:', error);
      return {
        success: false,
        payment_amount: 0,
        mpesa_transaction_id: '',
        message: `Failed to process payment: ${error.message}`
      };
    }
  }

  private updateProjectEscrowStatus(projectId: string, status: string) {
    try {
      const usersData = JSON.parse(fs.readFileSync(
        path.resolve(__dirname, '../../data/users.json'), 
        'utf8'
      ));
      
      const projectIndex = usersData.projects.findIndex((p: any) => p.id === projectId);
      if (projectIndex !== -1) {
        usersData.projects[projectIndex].escrow_status = status;
        fs.writeFileSync(
          path.resolve(__dirname, '../../data/users.json'),
          JSON.stringify(usersData, null, 2)
        );
      }
    } catch (error) {
      console.error('Error updating project escrow status:', error);
    }
  }

  public getTransactionsByProject(projectId: string): EscrowTransaction[] {
    const data = this.loadTransactions();
    return data.transactions.filter(t => t.project_id === projectId);
  }

  public getAllTransactions(): EscrowTransaction[] {
    const data = this.loadTransactions();
    return data.transactions;
  }

  public getTransactionById(transactionId: string): EscrowTransaction | null {
    const data = this.loadTransactions();
    return data.transactions.find(t => t.id === transactionId) || null;
  }
}

export default new EscrowService();