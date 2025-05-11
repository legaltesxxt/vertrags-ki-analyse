
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/types/analysisTypes';
import { generatePDF } from '@/utils/pdfUtils';

interface DownloadAnalysisButtonProps {
  result: AnalysisResult;
}

const DownloadAnalysisButton: React.FC<DownloadAnalysisButtonProps> = ({ result }) => {
  const toast = useToast();

  const downloadPDF = async () => {
    await generatePDF(result, 'vertragsklar.pdf', toast);
  };

  return (
    <Button
      onClick={downloadPDF}
      className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
    >
      <FileText className="h-4 w-4" />
      <Download className="h-4 w-4" />
      Analyse als PDF herunterladen
    </Button>
  );
};

export default DownloadAnalysisButton;
