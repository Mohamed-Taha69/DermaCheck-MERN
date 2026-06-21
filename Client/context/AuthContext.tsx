import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, HistoryItem, AnalysisResult } from '../types';
import { getUserHistory, HistoryItemResponse, getUserProfile, updateUserProfile } from '../services/apiService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  refreshHistory: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TOKEN_KEY = 'dc_token';
const USER_KEY  = 'dc_user';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateDiagnosis = (d: string): 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal' => {
  const valid = ['Monkeypox', 'Chickenpox', 'Measles', 'Normal'] as const;
  return (valid as readonly string[]).includes(d)
    ? (d as 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal')
    : 'Normal';
};

const formatHistory = (items: HistoryItemResponse[]): HistoryItem[] =>
  items.map((item) => {
    const ma =
      typeof item.medical_advice === 'string'
        ? JSON.parse(item.medical_advice)
        : item.medical_advice;

    const result: AnalysisResult = {
      diagnosis:      validateDiagnosis(item.diagnosis),
      assessment:     ma?.assessment || '',
      keyFeatures:    ma?.key_features || [],
      recommendations: ma?.recommendations || [],
      confidenceScore: item.confidence,
    };

    return {
      id:       item._id,
      date:     item.createdAt,
      result,
      imageUrl: item.image_url,
    };
  });

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,      setUser]      = useState<User | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [history,   setHistory]   = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session from localStorage on mount ─────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser  = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Load history in background — don't block the UI
        loadHistory(parsedUser.id!).finally(() => setIsLoading(false));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Load history from Express backend ─────────────────────────────────────
  const loadHistory = async (userId: string) => {
    try {
      const raw = await getUserHistory(userId);
      setHistory(formatHistory(raw));
    } catch (err) {
      console.error('Failed to load history:', err);
      setHistory([]);
    }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        return { success: false, error: data.message || 'Registration failed. Please try again.' };
      }

      // Persist session
      const newUser: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY,  JSON.stringify(newUser));
      setToken(data.token);
      setUser(newUser);
      setHistory([]);

      return { success: true };
    } catch {
      return { success: false, error: 'Cannot connect to the server. Make sure the backend is running.' };
    }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        return false;
      }

      // Try to enrich user data from Profile collection
      let enrichedUser: User = { id: data.user.id, name: data.user.name, email: data.user.email };
      try {
        const profile = await getUserProfile(data.user.id);
        if (profile) {
          enrichedUser = {
            ...enrichedUser,
            name:      profile.full_name || enrichedUser.name,
            age:       profile.age       ?? null,
            gender:    (profile.gender as 'Male' | 'Female') ?? null,
            skin_type: profile.skin_type as any ?? null,
            role:      profile.role      as any ?? null,
            phone:     profile.phone     ?? null,
          };
        }
      } catch { /* profile not found yet – fine for new users */ }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY,  JSON.stringify(enrichedUser));
      setToken(data.token);
      setUser(enrichedUser);
      await loadHistory(data.user.id);

      return true;
    } catch {
      return false;
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setHistory([]);
  };

  // ── Refresh helpers ────────────────────────────────────────────────────────
  const refreshHistory = async () => {
    if (user?.id) await loadHistory(user.id);
  };

  const refreshUser = async () => {
    if (!user?.id) return;
    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        const updated: User = {
          ...user,
          name:      profile.full_name || user.name,
          age:       profile.age       ?? null,
          gender:    (profile.gender as 'Male' | 'Female') ?? null,
          skin_type: profile.skin_type as any ?? null,
          role:      profile.role      as any ?? null,
          phone:     profile.phone     ?? null,
        };
        setUser(updated);
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const addToHistory = () => {
    if (user?.id) refreshHistory();
  };

  // ── Context Value ──────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading, history, addToHistory, refreshHistory, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};