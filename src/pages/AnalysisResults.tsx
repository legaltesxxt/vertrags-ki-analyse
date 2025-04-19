import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Navbar from '@/components/Navbar';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import { AnalysisResult } from '@/types/analysisTypes';
import html2pdf from 'html2pdf.js';
import { useToast } from '@/components/ui/use-toast';

interface WebhookResponseItem {
  output: string;
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [structuredResult, setStructuredResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.analysisResult) {
        setStructuredResult(location.state.analysisResult);
      }
      
      if (location.state.analysisOutput) {
        setAnalysisOutput(location.state.analysisOutput);
      } else if (location.state.webhookResponse) {
        const response = location.state.webhookResponse;
        if (Array.isArray(response) && response.length > 0 && response[0].output) {
          setAnalysisOutput(response[0].output);
        }
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-5xl">
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
                onClick={downloadFullAnalysisPDF}
                className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
              >
                <Download size={18} />
                Vollständige Analyse
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 md:p-8 mb-8 animate-fade-in">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            {structuredResult ? (
              <WebhookAnalysisResult result={structuredResult} />
            ) : analysisOutput ? (
              <MarkdownRenderer content={analysisOutput} />
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg">Keine Analyseergebnisse verfügbar.</p>
                <p className="mt-2 text-sm">Bitte laden Sie einen Vertrag hoch, um eine Analyse zu erhalten.</p>
                <Button 
                  variant="default" 
                  className="mt-6 bg-legal-primary hover:bg-legal-secondary"
                  onClick={() => navigate('/')}
                >
                  Zur Startseite
                </Button>
              </div>
            )}
          </ScrollArea>
          
          {(analysisOutput || structuredResult) && (
            <div className="mt-8 border-t border-slate-100 pt-6 flex justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-legal-primary hover:bg-legal-secondary flex items-center gap-2"
              >
                Neuen Vertrag analysieren
              </Button>
            </div>
          )}
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
