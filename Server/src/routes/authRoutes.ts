import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';

const router = Router();

// POST /auth/register  — create a new account
router.post('/register', register);

// POST /auth/login     — sign in and get a JWT
router.post('/login', login);

// GET  /auth/me        — validate token and return user info
router.get('/me', getMe);

export default router;
