
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '@/types/analysisTypes';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AnalysisFooterProps {
  hasContent: boolean;
  structuredResult: AnalysisResult | null;
  onDownloadPDF: () => void;
  isPaidAnalysis?: boolean;
}

const AnalysisFooter: React.FC<AnalysisFooterProps> = ({ 
  hasContent,
  structuredResult, 
  onDownloadPDF,
  isPaidAnalysis = false 
}) => {
  const navigate = useNavigate();

  if (!hasContent) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      {isPaidAnalysis && structuredResult && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">Wichtiger Hinweis</AlertTitle>
          <AlertDescription className="text-amber-800">
            ⚠️ Diese Analyse wird nicht gespeichert. Bitte laden Sie das PDF jetzt herunter, um Ihre Ergebnisse zu sichern!
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-center gap-4">
      <Button 
        onClick={() => navigate('/')}
        className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
      >
        Neuen Vertrag analysieren
      </Button>
      {structuredResult && (
        <Button 
          onClick={onDownloadPDF}
          className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
        >
          <Download size={18} />
          PDF herunterladen
        </Button>
      )}
      </div>
    </div>
  );
};

export default AnalysisFooter;
