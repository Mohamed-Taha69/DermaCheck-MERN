import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import profileRoutes from './routes/profileRoutes';
import historyRoutes from './routes/historyRoutes';

// ── Ensure the temp uploads folder exists ──────────────────────────────────
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// ── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Health check ───────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'DermaCheck MERN + Cloudinary API is Running! 🚀' });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/auth',    authRoutes);
app.use('/scan',    scanRoutes);
app.use('/profile', profileRoutes);
app.use('/history', historyRoutes);

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
