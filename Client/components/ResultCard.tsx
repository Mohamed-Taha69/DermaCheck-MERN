import React from 'react';
import { AnalysisResult, DiseaseType } from '../types';
import { AlertTriangle, Check, ChevronRight, Activity } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const getDiagnosisColor = (diagnosis: DiseaseType) => {
    switch (diagnosis) {
      case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Chickenpox': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Measles': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Monkeypox': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getDiagnosisBadge = (diagnosis: DiseaseType) => {
    switch (diagnosis) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Chickenpox': return 'bg-yellow-100 text-yellow-800';
      case 'Measles': return 'bg-orange-100 text-orange-800';
      case 'Monkeypox': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getDiagnosisIcon = (diagnosis: DiseaseType) => {
    if (diagnosis === 'Normal') {
      return <Check className="w-8 h-8 text-green-600" />;
    }
    return <AlertTriangle className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Diagnosis Card */}
      <div className={`rounded-2xl border-2 p-6 md:p-8 ${getDiagnosisColor(result.diagnosis)} shadow-sm relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${getDiagnosisBadge(result.diagnosis)}`}>
                Diagnosis Result
              </span>
              <h1 className="text-3xl font-extrabold mb-1">{result.diagnosis}</h1>
              {result.diagnosis === 'Normal' && (
                <h2 className="text-xl opacity-90 font-medium">Healthy Skin</h2>
              )}
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-white/50 rounded-full">
              {getDiagnosisIcon(result.diagnosis)}
            </div>
          </div>
          <p className="text-lg leading-relaxed max-w-2xl font-medium">
            {result.assessment}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
              <Check className="w-5 h-5 text-teal-600" />
            </div>
            Key Features
          </h3>
          <ul className="space-y-3">
            {result.keyFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start text-slate-600">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <ChevronRight className="w-5 h-5 text-indigo-600" />
            </div>
            Recommendations
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start text-slate-600">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-center pt-4">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default ResultCard;