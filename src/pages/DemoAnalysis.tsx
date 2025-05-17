
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import { generatePDF } from '@/utils/pdfUtils';
import { AnalysisResult } from '@/types/analysisTypes';

// Empty initial state for the demo analysis
const emptyAnalysisData: AnalysisResult = {
  clauses: [],
  overallRisk: 'Rechtskonform',
  summary: ''
};

const DemoAnalysis: React.FC = () => {
  const toast = useToast();
  const [demoAnalysisData, setDemoAnalysisData] = useState<AnalysisResult>(emptyAnalysisData);
  const [demoMarkdownOutput, setDemoMarkdownOutput] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Set up the page as loaded but with empty data
    setHasLoaded(true);
  }, []);

  // Function to update the analysis data with new JSON
  const updateAnalysisData = (newData: AnalysisResult) => {
    setDemoAnalysisData(newData);
    
    // Also generate markdown representation if needed
    let markdownContent = `# Vertragsanalyse\n\n`;
    markdownContent += `## Zusammenfassung\n${newData.summary}\n\n`;
    
    newData.clauses.forEach(clause => {
      markdownContent += `## ${clause.title}\n\n`;
      markdownContent += `**Klauseltext**\n${clause.text}\n\n`;
      markdownContent += `**Analyse**\n${clause.analysis}\n\n`;
      markdownContent += `**Risiko-Einstufung**\n${clause.risk}\n\n`;
      markdownContent += `**Gesetzliche Referenz**\n${clause.lawReference.text}\n\n`;
      if (clause.recommendation) {
        markdownContent += `**Empfehlung**\n${clause.recommendation}\n\n`;
      }
    });
    
    setDemoMarkdownOutput(markdownContent);
  };

  // Function to handle PDF download
  const downloadFullAnalysisPDF = async () => {
    if (demoAnalysisData.clauses.length === 0) {
      toast.toast({
        title: "Keine Daten vorhanden",
        description: "Es sind keine Analysedaten zum Herunterladen verfügbar.",
        variant: "destructive"
      });
      return;
    }

    try {
      await generatePDF(demoAnalysisData, 'demo_vertragsklar.pdf', toast);
    } catch (error) {
      console.error("Fehler beim PDF-Export:", error);
      toast.toast({
        title: "Fehler beim PDF-Export",
        description: "Beim Erstellen der PDF ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnalysisLayout>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-sm text-amber-800">
          <strong>Hinweis:</strong> Diese Seite ist bereit, um neue Demoanalyse-Daten zu empfangen.
          Bitte fügen Sie im nächsten Schritt die JSON-Ausgabe der neuen Demoanalyse ein.
        </p>
      </div>

      <AnalysisHeader 
        structuredResult={demoAnalysisData.clauses.length > 0 ? demoAnalysisData : null} 
        onDownloadPDF={downloadFullAnalysisPDF}
      />
      
      <AnalysisContent 
        analysisOutput={demoMarkdownOutput}
        structuredResult={demoAnalysisData.clauses.length > 0 ? demoAnalysisData : null}
        hasContent={hasLoaded && demoAnalysisData.clauses.length > 0}
      />
      
      <AnalysisFooter 
        hasContent={hasLoaded && demoAnalysisData.clauses.length > 0}
        structuredResult={demoAnalysisData.clauses.length > 0 ? demoAnalysisData : null}
        onDownloadPDF={downloadFullAnalysisPDF}
      />

      {/* For development purposes - replace this with actual implementation */}
      {!demoAnalysisData.clauses.length && (
        <div className="mt-8 p-8 bg-white rounded-xl shadow-sm border border-slate-200/50">
          <div className="text-center p-10">
            <h2 className="text-2xl font-medium text-slate-800 mb-4">Keine Demoanalyse Daten</h2>
            <p className="text-slate-500">
              Bitte fügen Sie im nächsten Schritt die JSON-Ausgabe der neuen Demoanalyse ein.
              Sie können die Analysedaten als JSON-Objekt bereitstellen, das dem Schema von AnalysisResult entspricht.
            </p>
          </div>
        </div>
      )}
    </AnalysisLayout>
  );
};

export default DemoAnalysis;
