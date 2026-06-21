import React from 'react';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full">
        <AppRoutes />
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Skin Disease Detection AI. All rights reserved.</p>
          <p className="mt-2">Disclaimer: This tool provides information based on AI analysis and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for accurate diagnosis.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;