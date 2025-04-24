import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Navbar from '@/components/Navbar';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import EmptyAnalysis from '@/components/analysis/EmptyAnalysis';
import { AnalysisResult, AnalysisClause } from '@/types/analysisTypes';
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
          try {
            const outputData = response[0];
            if (outputData.output) {
              setAnalysisOutput(outputData.output);
              
              const clauses: AnalysisClause[] = [];
              const clauseRegex = /### Klausel (\d+)[^\n]*\n\n\*\*Klauseltext\*\*\s*\n([^\n]*)\n\n\*\*Analyse\*\*\s*\n([^\n]*)\n\n\*\*Risiko-Einstufung\*\*\s*\n([^\n]*)\n\n\*\*Gesetzliche Referenz\*\*\s*\n([^\n]*)\n\n\*\*Handlungsbedarf\*\*\s*\n([^\n]*)/g;
              
              let match;
              while ((match = clauseRegex.exec(outputData.output)) !== null) {
                const [_, id, text, analysis, risk, lawRef, recommendation] = match;
                
                let mappedRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
                if (risk.includes('Rechtskonform')) {
                  mappedRisk = 'Rechtskonform';
                } else if (risk.includes('fraglich')) {
                  mappedRisk = 'Rechtlich fraglich';
                } else {
                  mappedRisk = 'Rechtlich unzulässig';
                }

                clauses.push({
                  id: id,
                  title: `Klausel ${id}`,
                  text: text.trim(),
                  analysis: analysis.trim(),
                  risk: mappedRisk,
                  lawReference: {
                    text: lawRef.trim(),
                    link: ''  // No links in the current format
                  },
                  recommendation: recommendation.trim()
                });
              }

              let overallRisk: 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig' = 'Rechtskonform';
              if (clauses.some(c => c.risk === 'Rechtlich unzulässig')) {
                overallRisk = 'Rechtlich unzulässig';
              } else if (clauses.some(c => c.risk === 'Rechtlich fraglich')) {
                overallRisk = 'Rechtlich fraglich';
              }

              const criticalClauses = clauses.filter(c => c.risk === 'Rechtlich unzulässig');
              const questionableClauses = clauses.filter(c => c.risk === 'Rechtlich fraglich');
              
              let summary = `Analyse von ${clauses.length} Vertragsklauseln. `;
              if (criticalClauses.length > 0) {
                summary += `${criticalClauses.length} rechtlich unzulässige Klauseln gefunden: ${
                  criticalClauses.map(c => c.title).join(', ')}. `;
              }
              if (questionableClauses.length > 0) {
                summary += `${questionableClauses.length} rechtlich fragliche Klauseln: ${
                  questionableClauses.map(c => c.title).join(', ')}. `;
              }

              setStructuredResult({
                clauses,
                overallRisk,
                summary
              });
            }
          } catch (error) {
            console.error('Error processing webhook response:', error);
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
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">Zusammenfassung</h2>
            <p>${structuredResult.summary}</p>
            <p style="color: #666; margin-top: 10px;">Gesamtrisiko: ${structuredResult.overallRisk}</p>
          </div>

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        <AnalysisHeader 
          structuredResult={structuredResult} 
          onDownloadPDF={downloadFullAnalysisPDF} 
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 md:p-8 mb-8 animate-fade-in">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            {structuredResult ? (
              <WebhookAnalysisResult result={structuredResult} />
            ) : analysisOutput ? (
              <MarkdownRenderer content={analysisOutput} />
            ) : (
              <EmptyAnalysis />
            )}
          </ScrollArea>
          
          <AnalysisFooter 
            hasContent={hasContent}
            structuredResult={structuredResult} 
            onDownloadPDF={downloadFullAnalysisPDF} 
          />
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-legal-primary to-legal-secondary text-white py-8 mt-auto">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-white/90" />
              <div>
                <h3 className="font-light text-xl tracking-tight">VertragsAnalyse</h3>
                <p className="text-sm mt-1 text-white/80">Schweizer Rechtsanalyse-Tool</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-xs text-white/70">
              <p>API: OpenAI GPT-4 Turbo | Hosting: Supabase | Automatisierung: n8n</p>
              <p className="text-center mt-2">© {new Date().getFullYear()} VertragsAnalyse. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AnalysisResults;
