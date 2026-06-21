import { Request, Response } from 'express';
import History from '../models/History';

/**
 * GET /history/:user_id
 * Returns all scan records for a user, newest first.
 */
export const getUserHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await History.find({ user_id: req.params.user_id }).sort({ createdAt: -1 });
    res.json({ status: 'success', data: history });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
};
