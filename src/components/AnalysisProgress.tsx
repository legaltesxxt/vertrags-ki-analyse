
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ progress }) => {
  const steps = [
    { label: "Dokument verarbeiten", threshold: 20 },
    { label: "Text extrahieren", threshold: 40 },
    { label: "Vertragsklauseln identifizieren", threshold: 60 },
    { label: "Risikoanalyse durchführen", threshold: 80 },
    { label: "Bericht erstellen", threshold: 100 }
  ];

  const currentStep = steps.findIndex(step => progress < step.threshold) === -1 
    ? steps.length - 1 
    : steps.findIndex(step => progress < step.threshold);

  return (
    <div className="my-8 text-center">
      <h3 className="font-semibold text-lg mb-2">Analyse läuft</h3>
      <Progress value={progress} className="h-2 mb-4" />
      <p className="text-sm text-gray-500 mb-4">{progress}% abgeschlossen</p>
      
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-legal-secondary animate-spin mb-2" />
        <p className="font-medium text-legal-secondary">{steps[currentStep].label}</p>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center">
              <div className={`h-5 w-5 flex items-center justify-center rounded-full mr-3 
                ${index < currentStep ? 'bg-legal-primary text-white' : 
                  index === currentStep ? 'border-2 border-legal-secondary' : 'border border-gray-300'}`}>
                {index < currentStep && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className={`text-sm ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisProgress;
