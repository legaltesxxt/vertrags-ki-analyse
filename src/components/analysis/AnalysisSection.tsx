import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import AnalysisProgress from '@/components/AnalysisProgress';
import { AnalysisResult } from '@/types/analysisTypes';

interface AnalysisSectionProps {
  isAnalyzing: boolean;
  webhookError: string | null;
  webhookResult: AnalysisResult | null;
  useRealAnalysis: boolean;
  onReset: () => void;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  isAnalyzing,
  webhookError,
  webhookResult,
  useRealAnalysis,
  onReset,
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
        <AnalysisProgress />
      </div>
    );
  }

  if (webhookError && !isAnalyzing) {
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
          
          <Button 
            onClick={onReset}
            className="bg-legal-primary hover:bg-legal-secondary text-white flex items-center gap-2 mx-auto"
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
