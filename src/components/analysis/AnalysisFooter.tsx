
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '@/types/analysisTypes';

interface AnalysisFooterProps {
  hasContent: boolean;
  structuredResult: AnalysisResult | null;
  onDownloadPDF: () => void;
}

const AnalysisFooter: React.FC<AnalysisFooterProps> = ({ 
  hasContent,
  structuredResult, 
  onDownloadPDF 
}) => {
  const navigate = useNavigate();

  if (!hasContent) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-6 flex justify-center gap-4">
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
  );
};

export default AnalysisFooter;
