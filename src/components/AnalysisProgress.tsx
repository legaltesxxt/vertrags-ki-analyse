
import React, { useState, useEffect } from 'react';
import { Loader2, Clock, CheckCircle } from 'lucide-react';

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
    } else if (seconds < 600) {
      return "Umfangreiche rechtliche Prüfung läuft...";
    } else if (seconds < 900) {
      return "Sehr detaillierte Analyse - fast abgeschlossen...";
    } else {
      return "Sehr komplexer Vertrag - Analyse läuft weiter...";
    }
  };

  const getProgressPercentage = (seconds: number) => {
    // More realistic progress for very long analyses
    if (seconds < 60) return Math.min(85, 20 + (seconds / 60) * 20);
    if (seconds < 300) return Math.min(85, 40 + ((seconds - 60) / 240) * 20);
    if (seconds < 600) return Math.min(90, 60 + ((seconds - 300) / 300) * 15);
    if (seconds < 900) return Math.min(95, 75 + ((seconds - 600) / 300) * 10);
    return Math.min(98, 85 + ((seconds - 900) / 300) * 5);
  };

  const steps = [
    { label: "PDF wurde hochgeladen", completed: true },
    { label: "Textextraktion abgeschlossen", completed: elapsedTime > 30 },
    { label: "Rechtliche Analyse läuft", completed: false, current: elapsedTime > 30 && elapsedTime < 600 },
    { label: "Detaillierte Prüfung", completed: false, current: elapsedTime >= 600 }
  ];

  return (
    <div className="my-8 text-center">
      <h3 className="font-semibold text-lg mb-2">Analyse läuft</h3>
      
      {/* Enhanced Timer Display */}
      {getAnalysisElapsedTime && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-legal-secondary" />
          <span className="text-legal-secondary font-mono text-lg">
            {formatTime(elapsedTime)}
          </span>
          {elapsedTime > 300 && (
            <span className="text-sm text-slate-500 ml-2">
              (Komplexe Analyse)
            </span>
          )}
        </div>
      )}
      
      {/* Enhanced progress bar */}
      <div className="relative w-full h-3 mb-6 bg-slate-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full">
          <div 
            className="absolute h-full bg-legal-primary transition-all duration-1000"
            style={{
              width: `${getProgressPercentage(elapsedTime)}%`,
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
          {elapsedTime < 300 ? (
            "Die Analyse kann je nach Vertragskomplexität bis zu 5 Minuten dauern."
          ) : elapsedTime < 600 ? (
            "Ihr Vertrag ist besonders komplex - die Analyse kann bis zu 10 Minuten dauern."
          ) : elapsedTime < 900 ? (
            "Sehr umfangreiche Vertragsanalyse - kann bis zu 15 Minuten dauern."
          ) : (
            "Außergewöhnlich komplexer Vertrag - die Analyse kann bis zu 20 Minuten dauern."
          )}
          <br />
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
                  <CheckCircle className="w-3 h-3" />
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

      {/* Enhanced warnings for different time periods */}
      {elapsedTime > 600 && elapsedTime <= 900 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Information:</strong> Ihr Vertrag wird sehr detailliert analysiert. 
            Dies deutet auf einen komplexen Vertragsinhalt hin. Die gründliche Prüfung 
            stellt sicher, dass alle rechtlichen Aspekte erfasst werden.
          </p>
        </div>
      )}

      {elapsedTime > 900 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Hinweis:</strong> Die Analyse dauert ungewöhnlich lange, was auf einen 
            sehr umfangreichen oder besonders komplexen Vertrag hindeutet. Unser System 
            arbeitet weiterhin an der vollständigen rechtlichen Bewertung. 
            Falls die Analyse nach 20 Minuten nicht abgeschlossen ist, versuchen Sie es bitte erneut.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgress;
