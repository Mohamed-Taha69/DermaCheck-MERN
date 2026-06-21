import { AnalysisResult } from '../types';

// Express backend URL (set in .env as VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// ─── Response Shapes ──────────────────────────────────────────────────────────

export interface ScanResponse {
  status: string;
  diagnosis: string;
  image_url: string;
  report: {
    assessment: string;
    key_features: string[];
    recommendations: string[];
  };
}

/** Shape returned by GET /history/:user_id (MongoDB document) */
export interface HistoryItemResponse {
  _id: string;         // MongoDB ObjectId string
  user_id: string;
  image_url: string;
  diagnosis: string;
  confidence: number;
  medical_advice: {
    assessment: string;
    key_features: string[];
    recommendations: string[];
  };
  createdAt: string;   // MongoDB timestamps use camelCase
  updatedAt: string;
}

/** Shape returned by GET /profile/:user_id (MongoDB document) */
export interface ProfileResponse {
  _id?: string;
  userId?: string;
  full_name?: string;
  username?: string;
  website?: string;
  email?: string;       // not stored in Profile model, kept for compat
  age?: number | null;
  gender?: 'Male' | 'Female' | null;
  skin_type?: string | null;
  role?: string | null;
  phone?: string | null;
  city?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Check whether the Express backend is reachable */
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const validateDiagnosis = (
  diagnosis: string
): 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal' => {
  const valid = ['Monkeypox', 'Chickenpox', 'Measles', 'Normal'] as const;
  return (valid as readonly string[]).includes(diagnosis)
    ? (diagnosis as 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal')
    : 'Normal';
};

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * POST /scan
 * Sends a multipart form with the image file + user_id.
 * Returns the AnalysisResult and the Cloudinary image URL.
 */
export const scanImage = async (
  file: File,
  userId: string
): Promise<{ result: AnalysisResult; imageUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(
      `Cannot connect to backend at ${API_BASE_URL}. ` +
        'Make sure the Express server is running (npm run dev inside Server/).'
    );
  }

  if (!response.ok) {
    let message = `Server error: ${response.status} ${response.statusText}`;
    try {
      const err = await response.json();
      message = err.message || message;
    } catch { /* ignore */ }
    throw new Error(message);
  }

  const data: ScanResponse = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.status || 'Scan failed');
  }

  const result: AnalysisResult = {
    diagnosis: validateDiagnosis(data.diagnosis),
    assessment: data.report.assessment,
    keyFeatures: data.report.key_features,
    recommendations: data.report.recommendations,
    confidenceScore: 0.95,
  };

  return { result, imageUrl: data.image_url };
};

/**
 * GET /history/:user_id
 * Returns all scan records for the user, newest first.
 */
export const getUserHistory = async (userId: string): Promise<HistoryItemResponse[]> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/history/${userId}`);
  } catch {
    throw new Error('Cannot connect to backend. Make sure the server is running.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch history' }));
    throw new Error(error.message || 'Failed to fetch history');
  }

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to fetch history');
  }

  return (data.data as HistoryItemResponse[]) || [];
};

/**
 * GET /profile/:user_id
 * Returns the profile document or null if not found.
 */
export const getUserProfile = async (userId: string): Promise<ProfileResponse | null> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/profile/${userId}`);
  } catch {
    throw new Error('Cannot connect to backend. Make sure the server is running.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
    throw new Error(error.message || 'Failed to fetch profile');
  }

  const data = await response.json();

  if (data.status !== 'success') {
    return null; // profile not found yet — normal for new users
  }

  return (data.data as ProfileResponse) || null;
};

/**
 * PUT /profile/update
 * Creates or updates a user's profile (upsert).
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    full_name?: string;
    username?: string;
    website?: string;
    age?: number | null;
    gender?: 'Male' | 'Female' | null;
    skin_type?: string | null;
    role?: string | null;
    phone?: string | null;
    city?: string | null;
  }
): Promise<ProfileResponse> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...updates }),
    });
  } catch {
    throw new Error('Cannot connect to backend. Make sure the server is running.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
    throw new Error(error.message || 'Failed to update profile');
  }

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Failed to update profile');
  }

  return data.data as ProfileResponse;
};
