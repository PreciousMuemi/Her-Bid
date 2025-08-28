/**
 * GigeBid Payment Bridge Service
 * Handles KES (M-Pesa) to USDC conversion and escrow management
 */
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export interface PaymentRequest {
  userPhoneNumber: string;
  amountKES: number;
  projectId: string;
  description: string;
}

export interface EscrowDetails {
  projectId: string;
  totalAmountUSDC: number;
  participantAddresses: string[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  description: string;
  amountUSDC: number;
  dueDate: string;
  status: 'pending' | 'completed' | 'released';
}

export interface ExchangeRate {
  KES_to_USDC: number;
  lastUpdated: string;
}

export class PaymentBridgeService {
  private mpesaConsumerKey: string;
  private mpesaConsumerSecret: string;
  private businessShortCode: string;
  private passkey: string;
  private callbackUrl: string;
  private usdcContractAddress: string;
  private bridgeWalletPrivateKey: string;
  private exchangeRateApiUrl: string;

  constructor() {
    this.mpesaConsumerKey = process.env.MPESA_CONSUMER_KEY || '';
    this.mpesaConsumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE || '';
    this.passkey = process.env.MPESA_PASSKEY || '';
    this.callbackUrl = process.env.MPESA_CALLBACK_URL || '';
    this.usdcContractAddress = process.env.USDC_CONTRACT_ADDRESS || '';
    this.bridgeWalletPrivateKey = process.env.BRIDGE_WALLET_PRIVATE_KEY || '';
    this.exchangeRateApiUrl = process.env.EXCHANGE_RATE_API_URL || '';
  }

  /**
   * Get current KES to USDC exchange rate
   */
  async getExchangeRate(): Promise<ExchangeRate> {
    try {
      // In production, this would call a real exchange rate API
      // For development, we'll use a mock rate
      if (this.exchangeRateApiUrl.includes('placeholder') || !this.exchangeRateApiUrl) {
        return {
          KES_to_USDC: 0.0076, // Approximate rate: 1 KES = 0.0076 USDC
          lastUpdated: new Date().toISOString()
        };
      }

      const response = await axios.get(this.exchangeRateApiUrl);
      const kesRate = response.data.rates.USD; // KES to USD rate
      const usdcRate = 1; // Assuming 1 USD = 1 USDC for simplicity

      return {
        KES_to_USDC: kesRate * usdcRate,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      // Fallback to approximate rate
      return {
        KES_to_USDC: 0.0076,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Convert KES amount to USDC
   */
  async convertKEStoUSDC(amountKES: number): Promise<number> {
    const rate = await this.getExchangeRate();
    return amountKES * rate.KES_to_USDC;
  }

  /**
   * Convert USDC amount to KES
   */
  async convertUSDCtoKES(amountUSDC: number): Promise<number> {
    const rate = await this.getExchangeRate();
    return amountUSDC / rate.KES_to_USDC;
  }

  /**
   * Initiate M-Pesa STK Push for payment collection
   */
  async initiatePayment(request: PaymentRequest): Promise<{success: boolean, transactionId?: string, error?: string}> {
    try {
      // Generate timestamp for M-Pesa
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      
      // Generate password for M-Pesa
      const password = Buffer.from(`${this.businessShortCode}${this.passkey}${timestamp}`).toString('base64');

      // Get OAuth token
      const authToken = await this.getMpesaAccessToken();
      
      if (!authToken) {
        return { success: false, error: 'Failed to get M-Pesa access token' };
      }

      // Mock M-Pesa STK Push for development
      if (this.mpesaConsumerKey.includes('placeholder') || !this.mpesaConsumerKey) {
        console.log(`Mock M-Pesa payment initiated for ${request.userPhoneNumber}: KES ${request.amountKES}`);
        return {
          success: true,
          transactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      }

      // Real M-Pesa STK Push implementation would go here
      const stkPushPayload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: request.amountKES,
        PartyA: request.userPhoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: request.userPhoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: request.projectId,
        TransactionDesc: request.description
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        stkPushPayload,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        transactionId: response.data.CheckoutRequestID
      };

    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      return {
        success: false,
        error: 'Failed to initiate payment'
      };
    }
  }

  /**
   * Get M-Pesa OAuth access token
   */
  private async getMpesaAccessToken(): Promise<string | null> {
    try {
      if (this.mpesaConsumerKey.includes('placeholder')) {
        return 'mock_access_token';
      }

      const auth = Buffer.from(`${this.mpesaConsumerKey}:${this.mpesaConsumerSecret}`).toString('base64');
      
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error);
      return null;
    }
  }

  /**
   * Create escrow contract on Sui blockchain with USDC
   */
  async createEscrowContract(details: EscrowDetails): Promise<{success: boolean, contractId?: string, error?: string}> {
    try {
      // Mock implementation for development
      console.log(`Creating escrow contract for project ${details.projectId} with ${details.totalAmountUSDC} USDC`);
      
      // In production, this would:
      // 1. Deploy a new escrow contract on Sui
      // 2. Lock the USDC amount in the contract
      // 3. Set up milestone release conditions
      // 4. Configure participant addresses

      const mockContractId = `escrow_${details.projectId}_${Date.now()}`;
      
      return {
        success: true,
        contractId: mockContractId
      };

    } catch (error) {
      console.error('Error creating escrow contract:', error);
      return {
        success: false,
        error: 'Failed to create escrow contract'
      };
    }
  }

  /**
   * Release milestone payment from escrow
   */
  async releaseMilestonePayment(
    contractId: string, 
    milestoneId: string, 
    recipientAddress: string
  ): Promise<{success: boolean, transactionId?: string, error?: string}> {
    try {
      console.log(`Releasing milestone ${milestoneId} from contract ${contractId} to ${recipientAddress}`);
      
      // In production, this would:
      // 1. Verify milestone completion conditions
      // 2. Release USDC from escrow contract
      // 3. Convert USDC back to KES
      // 4. Send KES to recipient's M-Pesa

      const mockTransactionId = `milestone_${milestoneId}_${Date.now()}`;
      
      return {
        success: true,
        transactionId: mockTransactionId
      };

    } catch (error) {
      console.error('Error releasing milestone payment:', error);
      return {
        success: false,
        error: 'Failed to release milestone payment'
      };
    }
  }

  /**
   * Handle M-Pesa callback for payment confirmation
   */
  async handleMpesaCallback(callbackData: any): Promise<void> {
    try {
      console.log('Processing M-Pesa callback:', callbackData);
      
      // In production, this would:
      // 1. Verify the callback authenticity
      // 2. Update payment status in database
      // 3. Convert KES to USDC if payment successful
      // 4. Fund the escrow contract
      // 5. Notify relevant parties

    } catch (error) {
      console.error('Error processing M-Pesa callback:', error);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    amountKES?: number;
    amountUSDC?: number;
    timestamp?: string;
  }> {
    try {
      // Mock implementation
      return {
        status: 'completed',
        amountKES: 10000,
        amountUSDC: 76,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      return { status: 'failed' };
    }
  }
}

export default PaymentBridgeService;
