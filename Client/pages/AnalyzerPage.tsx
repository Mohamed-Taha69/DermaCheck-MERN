import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Analyzer from '../components/Analyzer';
import ResultCard from '../components/ResultCard';
import { useAuth } from '../context/AuthContext';
import { AnalysisResult } from '../types';

const AnalyzerPage: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user, refreshHistory } = useAuth();

  const handleAnalysisComplete = async (result: AnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    
    // History is automatically saved by the backend, just refresh it
    if (user) {
      await refreshHistory();
    }
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('analysis-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setTimeout(() => {
      const analyzerElement = document.getElementById('analyzer-section');
      if (analyzerElement) {
        analyzerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Skin Disease Detection
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Upload a clear photo of the affected area to detect Monkeypox, Chickenpox, Measles, or Normal skin.
        </p>
      </div>

      {analysisResult ? (
        <div id="analysis-results">
          <ResultCard result={analysisResult} onReset={resetAnalysis} />
        </div>
      ) : (
        <div id="analyzer-section">
          <Analyzer onAnalysisComplete={handleAnalysisComplete} />
        </div>
      )}
      
      {!user && !analysisResult && (
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Save Your Analysis History</h3>
              <p className="text-teal-100">
                Create a free account to track your skin condition analysis over time and access your complete history.
              </p>
            </div>
            <Link 
              to="/register"
              className="px-8 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyzerPage;


