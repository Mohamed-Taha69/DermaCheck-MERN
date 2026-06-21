import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { scanImage } from '../services/apiService';
import { AnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';

interface AnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult, imageUrl: string) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Please upload an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    if (!user) {
      setError("Please log in to analyze images.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert base64 image to File
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Generate unique filename with timestamp to prevent overwriting
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 9);
      const fileExtension = blob.type.split('/')[1] || 'jpg';
      const uniqueFilename = `skin-image-${timestamp}-${randomId}.${fileExtension}`;
      const file = new File([blob], uniqueFilename, { type: blob.type });

      // Get user ID (use email as fallback if id doesn't exist)
      const userId = user.id || user.email;
      
      const { result, imageUrl } = await scanImage(file, userId);
      // Use the image URL from the backend response (Supabase storage URL)
      onAnalysisComplete(result, imageUrl);
    } catch (err: any) {
      console.error("Analysis error:", err);
      // Show user-friendly error message
      const errorMessage = err.message || "Failed to analyze image. Please try again.";
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Skin Disease Detection</h2>
          <p className="text-slate-500 text-center mb-8">
            Upload a clear photo of the affected area to detect Monkeypox, Chickenpox, Measles, or Normal skin.
          </p>

          {!image ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Click to Upload Image</h3>
              <p className="text-sm text-slate-400">JPG, PNG or WebP (Max 5MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video md:aspect-[2/1]">
                <img 
                  src={image} 
                  alt="Skin upload" 
                  className="w-full h-full object-contain"
                />
                <button 
                  onClick={reset}
                  className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-md transition-colors backdrop-blur-sm"
                  title="Remove image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">Error</p>
                      <p className="whitespace-pre-line text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center
                  ${isAnalyzing 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-teal-500/25 active:scale-[0.98]'
                  }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Skin...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Analyze Now
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500 bg-slate-50 p-6 rounded-xl">
             <div className="flex items-start">
                <Info className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                <p>Ensure good lighting and a clear focus on the affected area for best results.</p>
             </div>
             <div className="flex items-start">
                <Info className="w-5 h-5 mr-2 text-teal-500 flex-shrink-0" />
                <p>This tool is for informational purposes only and does not replace professional medical advice.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;