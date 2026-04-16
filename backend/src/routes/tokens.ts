import { Router } from 'express';
import { receiveTokens, getTokens } from '../controllers/tokenController';

const router = Router();

router.post('/', receiveTokens);
router.get('/', getTokens);

export default router;
