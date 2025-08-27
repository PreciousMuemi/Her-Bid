import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { matchmaker } from '../services/matchmaker';

const router = Router();

router.post('/viable-team', async (req: Request, res: Response) => {
  const schema = Joi.object({
    projectId: Joi.string().required(),
    requiredSkills: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.string().optional(),
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { projectId, requiredSkills, location } = value;
  try {
    const team = await matchmaker.findViableTeam({ projectId, requiredSkills, location });
    return res.json(team);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Matchmaking failed' });
  }
});

export default router;
