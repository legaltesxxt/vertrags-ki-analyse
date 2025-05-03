
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { HeartHandshake } from 'lucide-react';

const WerteEthik = () => {
  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <HeartHandshake className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Werte & Ethik</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Unsere ethischen Grundsätze und Werte.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <p className="text-center text-slate-500">
            Diese Seite wird in Kürze mit Inhalten gefüllt.
          </p>
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default WerteEthik;
