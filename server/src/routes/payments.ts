import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { mpesa } from '../services/mpesa';
import { suiEscrow } from '../services/suiEscrow';
import { fx } from '../services/fx';

const router = Router();

// Initiate payment: M-Pesa KES -> convert to USDC -> lock in escrow
router.post('/initiate', async (req: Request, res: Response) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
    amountKES: Joi.number().positive().required(),
    projectId: Joi.string().required(),
    milestones: Joi.array().items(Joi.object({ id: Joi.string().required(), amountKES: Joi.number().positive().required() })).required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { phone, amountKES, projectId, milestones } = value;

  try {
    // 1) Collect KES from M-Pesa (STK Push)
    const stk = await mpesa.collectKES(phone, amountKES);

    // 2) FX: KES -> USDC
    const rate = await fx.kesToUsdcRate();
    const usdcAmount = amountKES * rate;

    // 3) Mint/deposit USDC on Sui and open escrow
    const escrow = await suiEscrow.openEscrow({ projectId, usdcAmount, milestones });

    return res.json({ status: 'pending', stk, escrow, usdcAmount });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Payment initiation failed' });
  }
});

// Release milestone: smart contract triggers release in USDC -> off-ramp to M-Pesa
router.post('/release', async (req: Request, res: Response) => {
  const schema = Joi.object({ projectId: Joi.string().required(), milestoneId: Joi.string().required(), recipientPhone: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { projectId, milestoneId, recipientPhone } = value;
  try {
    const released = await suiEscrow.releaseMilestone({ projectId, milestoneId });
    const rate = await fx.usdcToKesRate();
    const kesAmount = released.usdcAmount * rate;
    const payout = await mpesa.disburseKES(recipientPhone, kesAmount);
    return res.json({ ok: true, released, kesAmount, payout });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Release failed' });
  }
});

export default router;
