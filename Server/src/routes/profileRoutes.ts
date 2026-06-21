import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController';

const router = Router();

// GET  /profile/:user_id   — fetch a user's profile
router.get('/:user_id', getProfile);

// PUT  /profile/update     — create or update a user's profile
router.put('/update', updateProfile);

export default router;
