
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePdf, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/types/analysisTypes';
import html2pdf from 'html2pdf.js';

interface DownloadAnalysisButtonProps {
  result: AnalysisResult;
}

const DownloadAnalysisButton: React.FC<DownloadAnalysisButtonProps> = ({ result }) => {
  const { toast } = useToast();

  const downloadPDF = async () => {
    try {
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px;">
          <h1 style="color: #1a5f7a; margin-bottom: 20px;">Vertragsanalyse</h1>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">Zusammenfassung</h2>
            <p>${result.summary}</p>
            <p style="color: #666; margin-top: 10px;">Gesamtrisiko: ${result.overallRisk}</p>
          </div>

          <div>
            <h2 style="color: #2c3e50; margin-bottom: 15px;">Detaillierte Klauselanalyse</h2>
            ${result.clauses.map(clause => `
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                <h3 style="color: #1a5f7a; margin-bottom: 10px;">${clause.title}</h3>
                <p style="margin-bottom: 8px;"><strong>Klauseltext:</strong> ${clause.text}</p>
                <p style="margin-bottom: 8px;"><strong>Analyse:</strong> ${clause.analysis}</p>
                <p style="margin-bottom: 8px;"><strong>Risikoeinstufung:</strong> ${clause.risk}</p>
                <p style="margin-bottom: 8px;"><strong>Empfehlung:</strong> ${clause.recommendation}</p>
                <p><strong>Gesetzliche Referenz:</strong> ${clause.lawReference.text}</p>
              </div>
            `).join('')}
          </div>

          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Erstellt mit VertragsAnalyse</p>
            <p>© ${new Date().getFullYear()} Alle Rechte vorbehalten</p>
          </div>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: 'vertragsanalyse.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const pdf = await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF erstellt",
        description: "Ihre Analyse wurde erfolgreich als PDF heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim PDF-Export",
        description: "Beim Erstellen der PDF ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={downloadPDF}
      className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
    >
      <FilePdf className="h-4 w-4" />
      <Download className="h-4 w-4" />
      Analyse als PDF herunterladen
    </Button>
  );
};

export default DownloadAnalysisButton;
