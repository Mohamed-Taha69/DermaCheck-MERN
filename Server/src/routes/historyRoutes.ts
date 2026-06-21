import { Router } from 'express';
import { getUserHistory } from '../controllers/historyController';

const router = Router();

// GET /history/:user_id — fetch all scan records for a user
router.get('/:user_id', getUserHistory);

export default router;
