import { Request, Response } from 'express';
import fs from 'fs';
import cloudinary from '../config/cloudinary';
import History from '../models/History';
import { classifyImage } from '../services/aiService';
import { getReportData } from '../data/medicalData';

/**
 * POST /scan
 * Accepts a multipart image + user_id, runs AI classification,
 * uploads the image to Cloudinary, and saves the result to MongoDB.
 */
export const scanImage = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.body as { user_id?: string };
  const file = req.file;

  if (!file || !user_id) {
    res.status(400).json({ status: 'error', message: 'Missing file or user_id' });
    return;
  }

  try {
    // ── 1. Run AI model ──────────────────────────────────────────────────────
    console.log('🤖 Analyzing Image...');
    const fileBuffer = fs.readFileSync(file.path);
    const blob = new Blob([fileBuffer], { type: file.mimetype });
    const diagnosis = await classifyImage(blob);
    console.log(`✅ Diagnosis Detected: ${diagnosis}`);

    // ── 2. Fetch medical report ──────────────────────────────────────────────
    const reportData = getReportData(diagnosis);

    // ── 3. Upload to Cloudinary ──────────────────────────────────────────────
    console.log('☁️ Uploading Image to Cloudinary...');
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      folder: `skin-diseases/${user_id}`,
    });
    const publicUrl = cloudinaryResponse.secure_url;
    console.log(`🔗 Cloudinary URL: ${publicUrl}`);

    // ── 4. Save to MongoDB ───────────────────────────────────────────────────
    console.log('💾 Saving to MongoDB History...');
    await new History({
      user_id,
      image_url:     publicUrl,
      diagnosis,
      confidence:    0.95,
      medical_advice: reportData,
    }).save();

    // ── 5. Clean up temp file ────────────────────────────────────────────────
    fs.unlinkSync(file.path);

    res.json({
      status:    'success',
      diagnosis,
      image_url: publicUrl,
      report:    reportData,
    });
  } catch (error: unknown) {
    // Always clean up temp file even on failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
};
