import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '30d'; // token valid for 30 days

const signToken = (userId: string): string =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * POST /auth/register
 * Body: { name, email, password }
 * Creates a new user. Returns a JWT token + user info.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name || !email || !password) {
      res.status(400).json({ status: 'error', message: 'Name, email, and password are required.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    // ── Check duplicate email ─────────────────────────────────────────────────
    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ status: 'error', message: 'An account with this email already exists.' });
      return;
    }

    // ── Hash password & save ──────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ name, email, password: hashedPassword });

    const token = signToken(String(user._id));

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id:    String(user._id),
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    res.status(500).json({ status: 'error', message });
  }
};

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns a JWT token + user info on success.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Email and password are required.' });
      return;
    }

    // Find user (include password field which is normally excluded)
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
      return;
    }

    const token = signToken(String(user._id));

    res.json({
      status: 'success',
      token,
      user: {
        id:    String(user._id),
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    res.status(500).json({ status: 'error', message });
  }
};

/**
 * GET /auth/me
 * Header: Authorization: Bearer <token>
 * Returns the current user's info from the token.
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ status: 'error', message: 'No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
      return;
    }

    res.json({
      status: 'success',
      user: {
        id:    String(user._id),
        name:  user.name,
        email: user.email,
      },
    });
  } catch {
    res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
  }
};
