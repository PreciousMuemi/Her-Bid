const express = require('express');
const axios = require('axios');
const { db } = require('../models/database');

const router = express.Router();

// M-Pesa Daraja API configuration
const MPESA_CONFIG = {
  consumer_key: process.env.MPESA_CONSUMER_KEY || 'your_consumer_key',
  consumer_secret: process.env.MPESA_CONSUMER_SECRET || 'your_consumer_secret',
  business_shortcode: process.env.MPESA_SHORTCODE || '174379',
  passkey: process.env.MPESA_PASSKEY || 'your_passkey',
  callback_url: process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/mpesa/callback',
  sandbox_url: 'https://sandbox.safaricom.co.ke',
  production_url: 'https://api.safaricom.co.ke'
};

// Get M-Pesa access token
const getMpesaToken = async () => {
  try {
    const auth = Buffer.from(`${MPESA_CONFIG.consumer_key}:${MPESA_CONFIG.consumer_secret}`).toString('base64');
    
    const response = await axios.get(
      `${MPESA_CONFIG.sandbox_url}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting M-Pesa token:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
};

// Generate timestamp for M-Pesa
const generateTimestamp = () => {
  const now = new Date();
  return now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
};

// Generate password for STK push
const generatePassword = (timestamp) => {
  const data = MPESA_CONFIG.business_shortcode + MPESA_CONFIG.passkey + timestamp;
  return Buffer.from(data).toString('base64');
};

// Initiate STK Push for job posting payment
router.post('/stk-push', async (req, res) => {
  try {
    const { phone_number, amount, job_id, user_id } = req.body;

    // Validate input
    if (!phone_number || !amount || !job_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: phone_number, amount, job_id, user_id'
      });
    }

    // Format phone number (ensure it starts with 254)
    let formattedPhone = phone_number.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // Get M-Pesa access token
    const accessToken = await getMpesaToken();
    
    // Generate timestamp and password
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    // STK Push request payload
    const stkPushData = {
      BusinessShortCode: MPESA_CONFIG.business_shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(parseFloat(amount)),
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.business_shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.callback_url,
      AccountReference: `JOB${job_id}`,
      TransactionDesc: `Gige-Bid Job Posting Payment - Job ${job_id}`
    };

    // Make STK Push request
    const response = await axios.post(
      `${MPESA_CONFIG.sandbox_url}/mpesa/stkpush/v1/processrequest`,
      stkPushData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save transaction to database
    const transactionData = {
      job_id,
      user_id,
      phone_number: formattedPhone,
      amount: parseFloat(amount),
      transaction_type: 'job_posting_payment',
      checkout_request_id: response.data.CheckoutRequestID
    };

    await db.createMpesaTransaction(transactionData);

    res.json({
      success: true,
      message: 'STK Push initiated successfully',
      data: {
        checkout_request_id: response.data.CheckoutRequestID,
        merchant_request_id: response.data.MerchantRequestID,
        customer_message: response.data.CustomerMessage
      }
    });

  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message
    });
  }
});

// M-Pesa callback endpoint
router.post('/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata;
      const items = callbackMetadata.Item;

      const receiptNumber = items.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = items.find(item => item.Name === 'TransactionDate')?.Value;
      const phoneNumber = items.find(item => item.Name === 'PhoneNumber')?.Value;

      // Update transaction status
      await db.updateMpesaTransaction(checkoutRequestId, {
        status: 'completed',
        mpesa_receipt_number: receiptNumber
      });

      // Update job escrow status
      const transaction = await db.query(
        'SELECT * FROM mpesa_transactions WHERE checkout_request_id = $1',
        [checkoutRequestId]
      );

      if (transaction.rows.length > 0) {
        const jobId = transaction.rows[0].job_id;
        const amount = transaction.rows[0].amount;

        await db.query(
          'UPDATE jobs SET escrow_status = $1, escrow_amount = $2, mpesa_transaction_id = $3 WHERE id = $4',
          ['secured', amount, receiptNumber, jobId]
        );
      }

      console.log(`Payment successful for CheckoutRequestID: ${checkoutRequestId}`);
    } else {
      // Payment failed
      await db.updateMpesaTransaction(checkoutRequestId, {
        status: 'failed',
        mpesa_receipt_number: null
      });

      console.log(`Payment failed for CheckoutRequestID: ${checkoutRequestId}, ResultCode: ${resultCode}`);
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Success' });

  } catch (error) {
    console.error('Callback processing error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
});

// Check payment status
router.get('/status/:checkout_request_id', async (req, res) => {
  try {
    const { checkout_request_id } = req.params;

    const result = await db.query(
      'SELECT * FROM mpesa_transactions WHERE checkout_request_id = $1',
      [checkout_request_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const transaction = result.rows[0];

    res.json({
      success: true,
      data: {
        status: transaction.status,
        amount: transaction.amount,
        phone_number: transaction.phone_number,
        mpesa_receipt_number: transaction.mpesa_receipt_number,
        created_at: transaction.created_at,
        updated_at: transaction.updated_at
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
});

module.exports = router;
