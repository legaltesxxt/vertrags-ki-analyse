import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-12 text-center animate-fade-in">
      <h1 className="text-4xl font-bold text-legal-primary mb-3">
        Professionelle KI-Vertragsanalyse – Made in Switzerland 🇨🇭
      </h1>
      <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
        Über 150 Schweizer Verträge bereits analysiert. Vertragsklar prüft Arbeits- und Mietverträge mit modernster KI nach Schweizer Recht.
      </p>
      
      <div className="flex flex-col items-center justify-center gap-4">
        <Button 
          onClick={() => navigate('/preise')} 
          className="bg-legal-primary hover:bg-legal-primary/90 text-white px-5 py-2 text-base font-medium rounded-lg" 
          size="default"
        >
          Jetzt Analyse starten
        </Button>
        
        <Button 
          onClick={() => navigate('/demo-analyse')} 
          variant="outline" 
          className="border-legal-primary/20 hover:bg-legal-tertiary text-legal-primary px-5 py-2 text-base font-medium rounded-lg" 
          size="default"
        >
          Demo Analyse ansehen
        </Button>

        <div className="flex items-center justify-center gap-4 mt-4 text-slate-500 text-sm flex-wrap">
          <span className="flex items-center gap-1">✓ In der Schweiz gegründet</span>
          <span className="flex items-center gap-1">✓ Über 150 Verträge analysiert</span>
          <span className="flex items-center gap-1">✓ Sichere Verarbeitung</span>
        </div>
      </div>
    </section>
  );
};
export default Header;