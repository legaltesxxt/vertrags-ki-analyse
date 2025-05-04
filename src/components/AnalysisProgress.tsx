
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  progress?: number; // Making progress optional since we won't use specific percentages
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = () => {
  const steps = [
    { label: "PDF wurde hochgeladen", completed: true },
    { label: "Analyse wird durchgeführt", completed: false }
  ];

  return (
    <div className="my-8 text-center">
      <h3 className="font-semibold text-lg mb-2">Analyse läuft</h3>
      
      {/* Continuous animated progress bar without specific percentage */}
      <div className="relative w-full h-2 mb-4 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full">
          <div className="absolute h-full bg-legal-primary animate-pulse-gentle" 
               style={{
                 width: '40%',
                 animation: 'indeterminateProgress 1.5s infinite cubic-bezier(0.65, 0.815, 0.735, 0.395)'
               }} />
          <div className="absolute h-full bg-legal-secondary opacity-70" 
               style={{
                 width: '40%',
                 animation: 'indeterminateProgress 1.5s 0.5s infinite cubic-bezier(0.165, 0.84, 0.44, 1)'
               }} />
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-legal-secondary animate-spin mb-2" />
        <p className="font-medium text-legal-secondary">Analyse wird durchgeführt</p>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center">
              <div className={`h-5 w-5 flex items-center justify-center rounded-full mr-3 
                ${index === 0 ? 'bg-legal-primary text-white' : 
                  'border-2 border-legal-secondary'}`}>
                {index === 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-900">
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
