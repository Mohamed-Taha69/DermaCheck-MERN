import { Router } from 'express';
import upload from '../middleware/upload';
import { scanImage } from '../controllers/scanController';

const router = Router();

// POST /scan  — multipart form with "file" field + "user_id" body field
router.post('/', upload.single('file'), scanImage);

export default router;
