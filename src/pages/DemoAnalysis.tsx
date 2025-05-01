
import React from 'react';
import Navbar from '@/components/Navbar';
import { Shield } from 'lucide-react';

const DemoAnalysis: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-legal-light">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-legal-primary mb-6">
            Demo-Analyse
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
            Hier wird bald eine Demo-Analyse angezeigt.
          </p>
        </div>
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

export default DemoAnalysis;
