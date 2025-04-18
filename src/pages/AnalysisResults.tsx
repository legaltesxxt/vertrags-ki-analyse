
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Navbar from '@/components/Navbar';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import { AnalysisResult } from '@/types/analysisTypes';

interface WebhookResponseItem {
  output: string;
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [structuredResult, setStructuredResult] = useState<AnalysisResult | null>(null);

  // Extrahiere Analyseergebnisse aus dem Location-State oder der Webhook-Antwort
  useEffect(() => {
    if (location.state) {
      // Prüfe auf strukturiertes Analyseergebnis
      if (location.state.analysisResult) {
        setStructuredResult(location.state.analysisResult);
      }
      
      // Prüfe auf direkte String-Ausgabe oder Webhook-Antwort
      if (location.state.analysisOutput) {
        // Direkte String-Ausgabe aus dem State
        setAnalysisOutput(location.state.analysisOutput);
      } else if (location.state.webhookResponse) {
        // Array-Antwort vom Webhook
        const response = location.state.webhookResponse;
        if (Array.isArray(response) && response.length > 0 && response[0].output) {
          setAnalysisOutput(response[0].output);
        }
      }
    }
  }, [location.state]);

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
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-legal-primary/20 hover:bg-legal-tertiary text-legal-primary transition-all" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
            Neuen Vertrag analysieren
          </Button>
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
