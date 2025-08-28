import express, { Request, Response } from 'express';
import Joi from 'joi';
import PaymentBridgeService from '../services/paymentBridge';

const router = express.Router();
const paymentBridge = new PaymentBridgeService();

// Get current exchange rate
router.get('/exchange-rate', async (req: Request, res: Response) => {
  try {
    const rate = await paymentBridge.getExchangeRate();
    return res.json({ success: true, data: rate });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Initiate payment: M-Pesa KES -> convert to USDC -> lock in escrow
router.post('/initiate', async (req: Request, res: Response) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^254[0-9]{9}$/).required().messages({
      'string.pattern.base': 'Phone number must be in format 254XXXXXXXXX'
    }),
    amountKES: Joi.number().positive().min(1).required(),
    projectId: Joi.string().required(),
    description: Joi.string().default('GigeBid Project Payment')
  });
  
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  const { phone, amountKES, projectId, description } = value;

  try {
    // 1) Convert KES to USDC equivalent
    const usdcAmount = await paymentBridge.convertKEStoUSDC(amountKES);

    // 2) Initiate M-Pesa payment collection
    const paymentResult = await paymentBridge.initiatePayment({
      userPhoneNumber: phone,
      amountKES,
      projectId,
      description
    });

    if (!paymentResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: paymentResult.error 
      });
    }

    // 3) Create escrow contract (will be funded after M-Pesa confirmation)
    const escrowResult = await paymentBridge.createEscrowContract({
      projectId,
      totalAmountUSDC: usdcAmount,
      participantAddresses: [], // Will be populated later
      milestones: [] // Will be defined later
    });

    return res.json({ 
      success: true,
      data: {
        transactionId: paymentResult.transactionId,
        contractId: escrowResult.contractId,
        amountKES,
        usdcAmount,
        status: 'pending_payment'
      }
    });

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Payment initiation failed' 
    });
  }
});

// Release milestone: smart contract triggers release in USDC -> off-ramp to M-Pesa
router.post('/release', async (req: Request, res: Response) => {
  const schema = Joi.object({ 
    projectId: Joi.string().required(), 
    milestoneId: Joi.string().required(), 
    recipientAddress: Joi.string().required(),
    recipientPhone: Joi.string().pattern(/^254[0-9]{9}$/).required()
  });
  
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  const { projectId, milestoneId, recipientAddress, recipientPhone } = value;
  
  try {
    // 1) Release milestone from escrow contract
    const releaseResult = await paymentBridge.releaseMilestonePayment(
      `escrow_${projectId}`,
      milestoneId,
      recipientAddress
    );

    if (!releaseResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: releaseResult.error 
      });
    }

    // 2) The actual M-Pesa disbursement would happen here
    // For now, we'll mock the conversion back to KES
    console.log(`Milestone released. Converting USDC to KES for ${recipientPhone}`);

    return res.json({ 
      success: true,
      data: {
        transactionId: releaseResult.transactionId,
        status: 'released',
        recipientPhone
      }
    });

  } catch (error: any) {
    console.error('Milestone release error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Milestone release failed' 
    });
  }
});

// M-Pesa callback endpoint
router.post('/mpesa/callback', async (req: Request, res: Response) => {
  try {
    console.log('Received M-Pesa callback:', req.body);
    
    // Process the callback
    await paymentBridge.handleMpesaCallback(req.body);
    
    // Respond to M-Pesa
    return res.json({ 
      ResultCode: 0, 
      ResultDesc: "Accepted" 
    });

  } catch (error: any) {
    console.error('M-Pesa callback error:', error);
    return res.status(500).json({ 
      ResultCode: 1, 
      ResultDesc: "Failed" 
    });
  }
});

// Get payment status
router.get('/status/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const status = await paymentBridge.getPaymentStatus(transactionId);
    
    return res.json({ 
      success: true, 
      data: status 
    });

  } catch (error: any) {
    console.error('Payment status error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to get payment status' 
    });
  }
});

// Real M-Pesa STK Push
router.post('/mpesa-stk-push', async (req: Request, res: Response) => {
  try {
    const { phone_number, amount, order_id, account_reference } = req.body;

    // Validate inputs
    if (!phone_number || !amount || !order_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phone_number, amount, order_id'
      });
    }

    // Validate phone number format
    const phoneRegex = /^(254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phone_number.toString().replace(/\s+/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use 254XXXXXXXXX or 07XXXXXXXX format'
      });
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 70000) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be between KES 1 and KES 70,000'
      });
    }

    console.log('🏦 Initiating real M-Pesa STK Push:', {
      phone: phone_number,
      amount: numAmount,
      order: order_id
    });

    // Call Supabase Edge Function for real M-Pesa integration
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/mpesa-stk-push`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number,
        amount: numAmount,
        order_id,
        account_reference
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ STK Push successful:', {
        checkout_id: data.checkout_request_id,
        merchant_id: data.merchant_request_id
      });

      res.json({
        success: true,
        message: 'STK push sent successfully. Please check your phone.',
        checkout_request_id: data.checkout_request_id,
        merchant_request_id: data.merchant_request_id,
        customer_message: data.customer_message
      });
    } else {
      console.error('❌ STK Push failed:', data);
      res.status(400).json({
        success: false,
        error: data.error || 'STK push failed',
        details: data.details,
        response_code: data.response_code
      });
    }

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Transaction status check
router.get('/transaction-status/:checkout_request_id', async (req: Request, res: Response) => {
  try {
    const { checkout_request_id } = req.params;

    console.log('🔍 Checking transaction status:', checkout_request_id);

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/mpesa_transactions?checkout_request_id=eq.${checkout_request_id}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json'
        }
      }
    );

    const transactions = await response.json();

    if (response.ok && transactions.length > 0) {
      const transaction = transactions[0];
      
      res.json({
        success: true,
        transaction
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

  } catch (error) {
    console.error('Transaction status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Query transaction by order ID
router.get('/order-transactions/:order_id', async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/mpesa_transactions?order_id=eq.${order_id}&select=*&order=created_at.desc`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json'
        }
      }
    );

    const transactions = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        transactions
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to fetch transactions'
      });
    }

  } catch (error) {
    console.error('Order transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
