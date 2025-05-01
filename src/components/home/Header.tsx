
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const scrollToFileUpload = () => {
    const fileUploadSection = document.querySelector('.bg-white.rounded-xl');
    if (fileUploadSection) {
      fileUploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-12 text-center animate-fade-in">
      <h1 className="text-4xl font-bold text-legal-primary mb-3">
        Unsere KI-gestützte Vertragsanalyse
      </h1>
      <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
        Unsere Plattform analysiert Schweizer Arbeits- und Mietverträge mithilfe modernster künstlicher Intelligenz 
      </p>
      
      <div className="flex flex-col items-center justify-center gap-4">
        <Button 
          onClick={scrollToFileUpload}
          className="bg-legal-primary hover:bg-legal-primary/90 text-white px-5 py-2 text-base font-medium rounded-lg"
          size="default"
        >
          Vertrag jetzt kostenlos prüfen
        </Button>
        
        <span className="text-slate-500 font-medium px-4">Oder</span>
        
        <Button 
          onClick={() => navigate('/demo-analysis')}
          variant="outline" 
          className="border-legal-primary/20 hover:bg-legal-tertiary text-legal-primary px-5 py-2 text-base font-medium rounded-lg"
          size="default"
        >
          Demo Analyse ansehen
        </Button>
      </div>
    </section>
  );
};

export default Header;
