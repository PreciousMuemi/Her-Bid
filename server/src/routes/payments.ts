import express, { Request, Response } from 'express';

const router = express.Router();

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

    // For now, simulate M-Pesa response since edge functions aren't deployed yet
    // In production, this would call the Supabase Edge Function
    const mockResponse = {
      success: true,
      message: 'STK push sent successfully. Please check your phone.',
      checkout_request_id: `ws_CO_${Date.now()}${Math.random().toString(36).substr(2, 4)}`,
      merchant_request_id: `${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customer_message: 'Success. Request accepted for processing',
      demo_note: 'This will be real M-Pesa when edge functions are deployed'
    };

    console.log('✅ STK Push Response:', {
      checkout_id: mockResponse.checkout_request_id,
      merchant_id: mockResponse.merchant_request_id
    });

    res.json(mockResponse);

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

    // Simulate transaction status for demo
    const mockTransaction = {
      success: true,
      transaction: {
        checkout_request_id: checkout_request_id,
        merchant_request_id: 'MR123456789',
        order_id: 'demo_order',
        phone_number: '254712345678',
        amount: 100,
        status: Math.random() > 0.3 ? 'completed' : 'pending',
        mpesa_receipt_number: `NLJ${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        transaction_date: new Date().toISOString(),
        result_desc: 'The service request is processed successfully.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

    res.json(mockTransaction);

  } catch (error) {
    console.error('Transaction status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get exchange rate
router.get('/exchange-rate', async (req: Request, res: Response) => {
  try {
    // Mock exchange rate for demo
    const mockRate = {
      success: true,
      data: {
        from: 'KES',
        to: 'USDC',
        rate: 0.0069, // 1 KES = 0.0069 USDC (approx)
        timestamp: new Date().toISOString(),
        source: 'Demo Exchange Rate API'
      }
    };

    res.json(mockRate);
  } catch (error) {
    console.error('Exchange rate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rate'
    });
  }
});

export default router;
