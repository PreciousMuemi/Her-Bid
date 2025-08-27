import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import pino from 'pino';
import paymentsRouter from './routes/payments.js';
import matchmakingRouter from './routes/matchmaking.js';
import { createTables } from './models/database.js';

// Import new routes
const mpesaRouter = require('./routes/mpesa.js');
const jobsRouter = require('./routes/jobs.js');

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(cors());
app.use(express.json());

// Initialize database tables
createTables().catch(console.error);

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.use('/api/payments', paymentsRouter);
app.use('/api/matchmaking', matchmakingRouter);
app.use('/api/mpesa', mpesaRouter);
app.use('/api/jobs', jobsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Gige-Bid server listening on :${port}`));
