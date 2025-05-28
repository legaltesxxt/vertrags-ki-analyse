
import React, { useState, useEffect } from 'react';
import { Loader2, Clock } from 'lucide-react';

interface AnalysisProgressProps {
  getAnalysisElapsedTime?: () => number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  getAnalysisElapsedTime 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (getAnalysisElapsedTime) {
      const interval = setInterval(() => {
        setElapsedTime(getAnalysisElapsedTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [getAnalysisElapsedTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressMessage = (seconds: number) => {
    if (seconds < 60) {
      return "Vertrag wird analysiert...";
    } else if (seconds < 180) {
      return "Detaillierte Analyse läuft - bitte haben Sie Geduld...";
    } else if (seconds < 300) {
      return "Komplexe Vertragsklauseln werden geprüft...";
    } else {
      return "Umfangreiche Analyse fast abgeschlossen...";
    }
  };

  const steps = [
    { label: "PDF wurde hochgeladen", completed: true },
    { label: "Textextraktion abgeschlossen", completed: elapsedTime > 30 },
    { label: "Rechtliche Analyse läuft", completed: false, current: elapsedTime > 30 }
  ];

  return (
    <div className="my-8 text-center">
      <h3 className="font-semibold text-lg mb-2">Analyse läuft</h3>
      
      {/* Timer Display */}
      {getAnalysisElapsedTime && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-legal-secondary" />
          <span className="text-legal-secondary font-mono text-lg">
            {formatTime(elapsedTime)}
          </span>
        </div>
      )}
      
      {/* Continuous animated progress bar */}
      <div className="relative w-full h-3 mb-6 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full">
          <div 
            className="absolute h-full bg-legal-primary transition-all duration-1000"
            style={{
              width: `${Math.min(85, 20 + (elapsedTime / 300) * 65)}%`,
              animation: 'pulse 2s infinite'
            }} 
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 text-legal-secondary animate-spin mb-3" />
        <p className="font-medium text-legal-secondary mb-2">
          {getProgressMessage(elapsedTime)}
        </p>
        <p className="text-sm text-slate-500 max-w-md">
          Die Analyse kann je nach Vertragskomplexität bis zu 5 Minuten dauern. 
          Bitte lassen Sie diese Seite geöffnet.
        </p>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <ul className="space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center justify-center">
              <div className={`h-5 w-5 flex items-center justify-center rounded-full mr-3 transition-all
                ${step.completed ? 'bg-legal-primary text-white' : 
                  step.current ? 'bg-legal-secondary text-white animate-pulse' :
                  'border-2 border-gray-300'}`}>
                {step.completed && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {step.current && !step.completed && (
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                )}
              </div>
              <span className={`text-sm transition-colors ${
                step.completed ? 'text-legal-primary font-medium' : 
                step.current ? 'text-legal-secondary font-medium' : 
                'text-gray-500'
              }`}>
                {step.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warning for long analysis times */}
      {elapsedTime > 240 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Hinweis:</strong> Die Analyse dauert ungewöhnlich lange. 
            Dies kann bei sehr komplexen oder umfangreichen Verträgen vorkommen. 
            Falls Sie länger als 7 Minuten warten, versuchen Sie es bitte erneut.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgress;
