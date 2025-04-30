
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { generatePDF } from '@/utils/pdfUtils';

const AnalysisResults = () => {
  const toast = useToast(); // Get the full toast object
  const { analysisOutput, structuredResult, hasContent } = useAnalysisData();

  // This function is kept for the web interface, but not used in PDF generation
  const getRiskClass = (risk: string): string => {
    switch (risk.toLowerCase()) {
      case 'niedrig':
      case 'rechtskonform':
        return 'color: #3DA35D; background-color: #F2FCE2; padding: 3px 10px; border-radius: 12px; font-weight: 500;';
      case 'mittel':
      case 'rechtlich fraglich':
        return 'color: #F0A04B; background-color: #FEF3C7; padding: 3px 10px; border-radius: 12px; font-weight: 500;';
      case 'hoch':
      case 'rechtlich unzulässig':
        return 'color: #E15759; background-color: #FEE2E2; padding: 3px 10px; border-radius: 12px; font-weight: 500;';
      default:
        return '';
    }
  };

  const downloadFullAnalysisPDF = async () => {
    if (!structuredResult) {
      toast.toast({
        title: "Kein Analyseergebnis",
        description: "Es sind keine Analyseergebnisse zum Herunterladen verfügbar.",
        variant: "destructive"
      });
      return;
    }

    await generatePDF(structuredResult, 'vollstaendige_vertragsanalyse.pdf', toast);
  };

  return (
    <AnalysisLayout>
      <AnalysisHeader 
        structuredResult={structuredResult} 
        onDownloadPDF={downloadFullAnalysisPDF} 
      />
      
      <AnalysisContent 
        analysisOutput={analysisOutput}
        structuredResult={structuredResult}
        hasContent={hasContent}
      />
      
      <AnalysisFooter 
        hasContent={hasContent}
        structuredResult={structuredResult} 
        onDownloadPDF={downloadFullAnalysisPDF} 
      />
    </AnalysisLayout>
  );
};

export default AnalysisResults;
