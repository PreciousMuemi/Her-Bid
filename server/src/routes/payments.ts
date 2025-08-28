import { Router, Request, Response } from 'express';
import Joi from 'joi';
import PaymentBridgeService from '../services/paymentBridge';

const router = Router();
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

export default router;
