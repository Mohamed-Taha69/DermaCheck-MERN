import { Request, Response } from 'express';
import Profile from '../models/Profile';

/**
 * GET /profile/:user_id
 * Returns the profile for the given user.
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.params.user_id });

    if (!profile) {
      res.json({ status: 'error', message: 'Profile not found' });
      return;
    }

    res.json({ status: 'success', data: profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
};

/**
 * PUT /profile/update
 * Creates or updates a user profile (upsert).
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, ...updateData } = req.body as { user_id: string; [key: string]: unknown };

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: user_id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json({ status: 'success', data: updatedProfile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
};
