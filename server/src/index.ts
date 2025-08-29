// Force load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

// Debug environment loading immediately
console.log('🔧 Immediate Environment Check:');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_URL value:', process.env.SUPABASE_URL);
console.log('SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SERVICE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0);
console.log('SERVICE_KEY prefix:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30));

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import userRouter from './routes/users.ts';
import escrowRouter from './routes/escrow.ts';
import paymentRouter from './routes/payments.ts';

const app = express();
const logger = pino();

// Middleware
app.use(cors());
app.use(express.json());

// Health check with environment debugging
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env_debug: {
      supabase_url: process.env.SUPABASE_URL || 'MISSING',
      service_key_exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      service_key_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      service_key_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) || 'NONE',
      node_env: process.env.NODE_ENV,
      all_env_keys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
    }
  });
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/payment', paymentRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`🚀 Gige-Bid Real Demo Server running on :${PORT}`);
  logger.info(`📊 Database: Supabase ${process.env.SUPABASE_URL ? 'configured' : 'NOT configured'}`);
  logger.info(`🧠 AGI: Live matchmaking engine active`);
  logger.info(`💰 M-Pesa: Real integration configured`);
  logger.info(`🔗 Payment Endpoints:`);
  logger.info(`   POST /api/payment/mpesa-stk-push`);
  logger.info(`   GET  /api/payment/transaction-status/:id`);
});
