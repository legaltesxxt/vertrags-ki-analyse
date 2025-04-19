
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '@/types/analysisTypes';

interface AnalysisHeaderProps {
  structuredResult: AnalysisResult | null;
  onDownloadPDF: () => void;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ 
  structuredResult, 
  onDownloadPDF 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-legal-primary to-legal-secondary p-2.5 rounded-lg text-white shadow-sm">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-light tracking-tight text-legal-primary">Vertragsanalyse</h1>
          <p className="text-sm text-slate-500 mt-0.5">Rechtliche Bewertung nach Schweizer Recht</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-legal-primary/20 hover:bg-legal-tertiary text-legal-primary transition-all" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
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

export default AnalysisHeader;
