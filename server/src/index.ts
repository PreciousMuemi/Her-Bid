import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import pino from 'pino';
import mpesaRouter from './routes/mpesa.js';
import jobsRouter from './routes/jobs.js';
import escrowRouter from './routes/escrow.js';

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(cors());
app.use(express.json());

// Supabase is now used instead of local database

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.use('/api/mpesa', mpesaRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/escrow', escrowRouter);

const port = process.env.PORT || 4001;
app.listen(port, () => {
  logger.info(`Gige-Bid server listening on :${port}`);
});
