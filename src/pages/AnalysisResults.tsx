
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResult } from '@/types/analysisTypes';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import html2pdf from 'html2pdf.js';

interface WebhookResponseItem {
  output: string;
}

const AnalysisResults = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [structuredResult, setStructuredResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.analysisResult) {
        console.log('Received structured analysis result:', location.state.analysisResult);
        setStructuredResult(location.state.analysisResult);
      }
      
      if (location.state.webhookResponse) {
        const response = location.state.webhookResponse;
        console.log('Received webhook response:', response);
        
        if (Array.isArray(response) && response.length > 0) {
          const outputData = response[0];
          if (outputData.output) {
            setAnalysisOutput(outputData.output);
          }
        }
      }
      
      if (location.state.analysisOutput) {
        console.log('Received analysis output:', location.state.analysisOutput);
        setAnalysisOutput(location.state.analysisOutput);
      }
    }
  }, [location.state]);

  const downloadFullAnalysisPDF = async () => {
    if (!structuredResult) {
      toast({
        title: "Kein Analyseergebnis",
        description: "Es sind keine Analyseergebnisse zum Herunterladen verfügbar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px;">
          <h1 style="color: #1a5f7a; margin-bottom: 20px;">Vollständige Vertragsanalyse</h1>
          
          <div>
            <h2 style="color: #2c3e50; margin-bottom: 15px;">Detaillierte Klauselanalyse</h2>
            ${structuredResult.clauses.map(clause => `
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
        filename: 'vollstaendige_vertragsanalyse.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF erstellt",
        description: "Die vollständige Analyse wurde erfolgreich als PDF heruntergeladen.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim PDF-Export",
        description: "Beim Erstellen der PDF ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  const hasContent = !!(analysisOutput || structuredResult);

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
