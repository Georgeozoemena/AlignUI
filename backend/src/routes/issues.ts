import { Router } from 'express';
import { IssueModel } from '../db/IssueModel';

const router = Router();

router.get('/', async (_req, res) => {
  const issues = await IssueModel.find(
    {},
    { _id: 0, __v: 0 }
  ).sort({ createdAt: -1 }).lean();
  res.json({ issues });
});

export default router;
