
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, ArrowRight, Clock } from 'lucide-react';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import AnalysisProgress from '@/components/AnalysisProgress';
import { AnalysisResult } from '@/types/analysisTypes';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisSectionProps {
  isAnalyzing: boolean;
  webhookError: string | null;
  webhookResult: AnalysisResult | null;
  useRealAnalysis: boolean;
  onReset: () => void;
  getTimeRemaining?: () => number;
  canResetError?: () => boolean;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  isAnalyzing,
  webhookError,
  webhookResult,
  useRealAnalysis,
  onReset,
  getTimeRemaining = () => 0,
  canResetError = () => true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(getTimeRemaining());
  const { toast } = useToast();

  // Update the countdown timer every second
  useEffect(() => {
    if (!webhookError) return;
    
    // Initial update
    setTimeRemaining(getTimeRemaining());
    
    // Set up interval for countdown
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      
      // Clear interval when timer reaches zero
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [webhookError, getTimeRemaining]);

  // Format remaining time as minutes:seconds
  const formatRemainingTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return "00:00";
    
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle reset attempt with check
  const handleResetAttempt = () => {
    if (!canResetError()) {
      toast({
        title: "Bitte warten",
        description: `Die Fehlermeldung bleibt für ${formatRemainingTime(timeRemaining)} sichtbar.`,
        variant: "default",
      });
    }
    
    onReset();
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
        <AnalysisProgress />
      </div>
    );
  }

  if (webhookError && !isAnalyzing) {
    const canReset = canResetError();
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="ml-2">Fehler bei der Vertragsanalyse</AlertTitle>
          <AlertDescription className="ml-2">
            {webhookError}
          </AlertDescription>
        </Alert>
        
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="mb-4 text-gray-700">
            Leider ist bei der Analyse Ihres Vertrags ein Problem aufgetreten. 
            Dies kann verschiedene Ursachen haben:
          </p>
          <ul className="text-left list-disc list-inside mb-6 text-gray-600 space-y-2">
            <li>Der Server ist momentan nicht erreichbar</li>
            <li>Das PDF-Format konnte nicht korrekt verarbeitet werden</li>
            <li>Der Vertrag enthält Inhalte, die nicht erkannt werden konnten</li>
            <li>Es besteht ein temporäres Verbindungsproblem</li>
          </ul>
          
          {!canReset && timeRemaining > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center justify-center gap-2 text-amber-800">
              <Clock size={16} />
              <span>
                Diese Meldung bleibt noch für <strong>{formatRemainingTime(timeRemaining)}</strong> sichtbar
              </span>
            </div>
          )}
          
          <Button 
            onClick={handleResetAttempt}
            disabled={!canReset}
            className={`flex items-center gap-2 mx-auto ${
              canReset 
                ? "bg-legal-primary hover:bg-legal-secondary text-white" 
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <RefreshCw size={16} />
            Neue Analyse starten
          </Button>
        </div>
      </div>
    );
  }

  if (webhookResult && !isAnalyzing && !webhookError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
        {useRealAnalysis ? (
          <WebhookAnalysisResult result={webhookResult} />
        ) : (
          <div>
            {/* The mockResult is not being used anymore */}
          </div>
        )}
        
        <div className="mt-10 flex justify-center">
          <Button 
            onClick={onReset}
            className="bg-legal-primary hover:bg-legal-secondary text-white flex items-center gap-2"
          >
            Neue Analyse starten
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default AnalysisSection;
