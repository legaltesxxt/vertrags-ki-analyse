
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { HelpCircle } from 'lucide-react';
import FAQComponent from '@/components/home/FAQ';

const FAQ = () => {
  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <HelpCircle className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Häufig gestellte Fragen</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Antworten auf die wichtigsten Fragen rund um Vertragsklar.
          </p>
        </div>

        <FAQComponent />
      </div>
    </AnalysisLayout>
  );
};

export default FAQ;
