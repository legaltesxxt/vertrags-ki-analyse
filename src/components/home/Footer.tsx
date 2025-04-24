
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-legal-primary text-white py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">VertragsAnalyse</h3>
            <p className="text-sm mt-1 text-gray-300">Schweizer Rechtsanalyse-Tool</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-gray-300">
            <p>Vertragspartner: OpenAI (Analyse via GPT-4 Turbo) | Supabase Hosting | n8n Automatisierung</p>
            <p className="text-center mt-2">© {new Date().getFullYear()} VertragsAnalyse. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
