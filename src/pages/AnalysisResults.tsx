
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
  
  // Function for PDF risk styling without colors or borders
  const getPDFRiskStyle = (): string => {
    return 'padding: 3px 10px; border-radius: 12px; font-weight: 500;';
  };
  
  // Function for summary risk styling without colors
  const getSummaryRiskStyle = (): string => {
    return 'font-weight: 500;';
  };
  
  const isRecommendationMeaningful = (recommendation?: string) => {
    if (!recommendation) return false;
    const trimmedRecommendation = recommendation.trim().toLowerCase();
    return trimmedRecommendation !== '' && 
           trimmedRecommendation !== '---' && 
           trimmedRecommendation !== 'keine änderungen erforderlich.';
  };

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
      // Create table of contents
      const tocItems = structuredResult.clauses.map((clause, index) => 
        `<li><a href="#clause-${index}" style="color: #1a5f7a; text-decoration: none;">${clause.title}</a></li>`
      ).join('');

      // Create clauses HTML - using getPDFRiskStyle instead of getRiskClass
      const clausesHTML = structuredResult.clauses.map((clause, index) => `
        <div id="clause-${index}" style="margin-bottom: 32px; padding: 20px; border: 1px solid #eee; border-radius: 12px; break-inside: avoid;">
          <h3 style="color: #1a5f7a; margin-bottom: 16px; font-size: 18px; border-bottom: 1px solid #e5f4f9; padding-bottom: 10px;">${clause.title}</h3>
          
          <div style="margin-bottom: 16px; padding: 12px; background-color: #f8fafc; border-radius: 8px;">
            <p style="margin-bottom: 8px; font-size: 14px;"><strong>Klauseltext:</strong></p>
            <p style="margin-bottom: 12px; font-size: 14px; line-height: 1.5;">${clause.text}</p>
          </div>
          
          <div style="display: flex; gap: 5px; margin-bottom: 12px; align-items: center;">
            <span><strong>Risikoeinstufung:</strong></span>
            <span style="${getPDFRiskStyle()}">${clause.risk}</span>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin-bottom: 8px; font-size: 14px;"><strong>Analyse:</strong></p>
            <p style="font-size: 14px; line-height: 1.5; margin-bottom: 12px;">${clause.analysis}</p>
          </div>
          
          <div style="margin-bottom: 16px; padding: 12px; background-color: #e5f4f9; border-radius: 8px;">
            <p style="margin-bottom: 8px; font-size: 14px;"><strong>Gesetzliche Referenz:</strong></p>
            <p style="font-size: 14px; line-height: 1.5;">${clause.lawReference.text}</p>
            ${clause.lawReference.link ? 
              `<a href="${clause.lawReference.link}" style="font-size: 13px; color: #0F83A9; margin-top: 8px; display: inline-block;">Gesetzestext ansehen</a>` : 
              ''}
          </div>
          
          ${isRecommendationMeaningful(clause.recommendation) ? `
          <div style="margin-bottom: 8px; padding: 12px; background-color: #F5FBFD; border-radius: 8px; border-left: 3px solid #0F83A9;">
            <p style="margin-bottom: 8px; font-size: 14px;"><strong>Empfehlung:</strong></p>
            <p style="font-size: 14px; line-height: 1.5;">${clause.recommendation}</p>
          </div>
          ` : ''}
        </div>
      `).join('');

      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #005B7F; margin-bottom: 10px; font-size: 28px;">Vollständige Vertragsanalyse</h1>
            <p style="color: #666; font-size: 16px;">Rechtliche Bewertung nach Schweizer Recht</p>
          </div>
          
          <div style="margin-bottom: 40px; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
            <h2 style="color: #2c3e50; margin-bottom: 16px; font-size: 20px;">Zusammenfassung</h2>
            <p style="line-height: 1.6; font-size: 15px; margin-bottom: 16px;">${structuredResult.summary}</p>
            <div style="display: flex; gap: 5px; align-items: center;">
              <p style="font-size: 15px;"><strong>Gesamtrisiko:</strong></p>
              <span style="${getSummaryRiskStyle()}">${structuredResult.overallRisk}</span>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 16px; font-size: 20px;">Inhaltsverzeichnis</h2>
            <ul style="list-style-type: none; padding-left: 0;">
              ${tocItems}
            </ul>
          </div>

          <div>
            <h2 style="color: #2c3e50; margin-bottom: 20px; font-size: 20px; page-break-before: always;">Detaillierte Klauselanalyse</h2>
            ${clausesHTML}
          </div>

          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>Erstellt mit VertragsAnalyse</p>
            <p>© ${new Date().getFullYear()} Alle Rechte vorbehalten</p>
            <p style="font-size: 11px; color: #999; margin-top: 5px;">Erstellungsdatum: ${new Date().toLocaleDateString('de-CH')}</p>
          </div>
        </div>
      `;

      const opt = {
        margin: 15,
        filename: 'vollstaendige_vertragsanalyse.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Increased image quality
        html2canvas: { 
          scale: 4, // Increased scale from 2 to 4 for better quality
          useCORS: true, 
          logging: false,
          letterRendering: true // Improved text rendering
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: false // Better quality with no compression
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().from(element).set(opt).save();
      
      toast({
        title: "PDF erstellt",
        description: "Die vollständige Analyse wurde erfolgreich als PDF heruntergeladen.",
      });
    } catch (error) {
      console.error("PDF export error:", error);
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
