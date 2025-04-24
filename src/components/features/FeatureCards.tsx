
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, FileText } from 'lucide-react';

const FeatureCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <Card className="bg-white border-border/50 shadow-sm">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
            <Shield size={24} />
          </div>
          <h3 className="font-medium text-lg mb-2">Datenschutz beachten</h3>
          <p className="text-slate-600 text-sm">
            Wir empfehlen, persönliche Informationen, die für die Vertragsbewertung nicht notwendig sind, 
            im PDF zu schwärzen oder zu entfernen.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-border/50 shadow-sm">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
            <Lock size={24} />
          </div>
          <h3 className="font-medium text-lg mb-2">Sichere Verarbeitung</h3>
          <p className="text-slate-600 text-sm">
            Ihre hochgeladenen Dokumente werden über sichere Verbindungen verarbeitet, jedoch läuft die 
            Analyse durch externe Server (OpenAI).
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-border/50 shadow-sm">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
            <FileText size={24} />
          </div>
          <h3 className="font-medium text-lg mb-2">Präzise Analyse</h3>
          <p className="text-slate-600 text-sm">
            Unsere KI erkennt kritische Vertragsbedingungen und liefert Ihnen eine rechtliche 
            Ersteinschätzung nach Schweizer Recht.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCards;
