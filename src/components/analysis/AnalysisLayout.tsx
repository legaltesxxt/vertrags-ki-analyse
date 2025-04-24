
import React from 'react';
import { Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface AnalysisLayoutProps {
  children: React.ReactNode;
}

const AnalysisLayout: React.FC<AnalysisLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        {children}
      </main>
      
      <footer className="bg-gradient-to-r from-legal-primary to-legal-secondary text-white py-8 mt-auto">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-white/90" />
              <div>
                <h3 className="font-light text-xl tracking-tight">VertragsAnalyse</h3>
                <p className="text-sm mt-1 text-white/80">Schweizer Rechtsanalyse-Tool</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-xs text-white/70">
              <p>API: OpenAI GPT-4 Turbo | Hosting: Supabase | Automatisierung: n8n</p>
              <p className="text-center mt-2">© {new Date().getFullYear()} VertragsAnalyse. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnalysisLayout;
