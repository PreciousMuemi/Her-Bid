import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import pino from 'pino';
import paymentsRouter from './routes/payments';
import matchmakingRouter from './routes/matchmaking';

const app = express();
const logger = pino({ transport: { target: 'pino-pretty' } });

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.use('/api/payments', paymentsRouter);
app.use('/api/matchmaking', matchmakingRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Gige-Bid server listening on :${port}`));
