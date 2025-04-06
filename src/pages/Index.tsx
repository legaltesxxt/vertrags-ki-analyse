
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import AnalysisProgress from '@/components/AnalysisProgress';
import ClauseAnalysis from '@/components/ClauseAnalysis';
import { useMockAnalysis } from '@/hooks/useMockAnalysis';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import { ArrowRight, Shield, Lock, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { startAnalysis, resetAnalysis, isAnalyzing, progress, analysisResult: mockResult } = useMockAnalysis();
  const { sendToN8n, isLoading: isSendingToN8n, analysisResult: webhookResult } = useN8nWebhook();
  const [useRealAnalysis, setUseRealAnalysis] = useState(true);
  const { toast } = useToast();

  // Bestimme, welche Analyseergebnisse angezeigt werden sollen (Mock oder Webhook)
  const displayResult = useRealAnalysis ? webhookResult : mockResult;

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    
    // Starte die Mock-Analyse für die Fortschrittsanzeige
    if (!useRealAnalysis) {
      startAnalysis(file);
    }
    
    // Sende die Datei an n8n für die Backend-Verarbeitung
    const response = await sendToN8n(file);
      
    if (response.success) {
      if (response.data) {
        console.log("Webhook-Antwort erhalten:", response.data);
        
        // Bei Erfolg: Wenn die Antwort ein Array mit einem output-Feld ist, direkt zur Markdown-Ansicht navigieren
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
          navigate('/analysis-results', { 
            state: { 
              webhookResponse: response.data
            }
          });
          return;
        }
        
        // Alternativ, wenn es eine Textantwort gibt
        if (response.data.rawText) {
          navigate('/analysis-results', { 
            state: { 
              analysisOutput: response.data.rawText 
            }
          });
          return;
        }
        
        if (response.analysisResult) {
          console.log("Analyse erfolgreich empfangen:", response.analysisResult);
          setUseRealAnalysis(true);
        }
      } else {
        console.log("Keine Analyseergebnisse erhalten, verwende Mock-Daten");
        toast({
          title: "Hinweis",
          description: "Keine Analyseergebnisse vom Server erhalten. Es werden Beispieldaten angezeigt.",
          variant: "default",
        });
        setUseRealAnalysis(false);
        startAnalysis(file);
      }
    } else {
      console.error("Fehler beim Senden der Datei an n8n:", response.error);
      toast({
        title: "Fehler bei der Verarbeitung",
        description: "Die Datei konnte nicht zur Analyse gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      setUseRealAnalysis(false);
      startAnalysis(file); // Fallback zu Mock-Daten
    }
  }, [startAnalysis, sendToN8n, toast, useRealAnalysis, navigate]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    resetAnalysis();
    setUseRealAnalysis(true);
  }, [resetAnalysis]);

  // Status der Analyse, entweder von Mock oder tatsächlich ladend
  const isCurrentlyAnalyzing = (useRealAnalysis ? isSendingToN8n : isAnalyzing);

  return (
    <div className="min-h-screen flex flex-col bg-legal-light">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl font-bold text-legal-primary mb-3">Unsere KI-gestützte Vertragsanalyse</h1>
          <p className="text-slate-600 max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
            Unsere Plattform analysiert Schweizer Arbeits- und Mietverträge mithilfe modernster künstlicher 
            Intelligenz (GPT-4 Turbo von OpenAI). 
          </p>
        </section>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white border-border/50 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
                <Shield size={24} />
              </div>
              <h3 className="font-medium text-lg mb-2">Datenschutz beachten</h3>
              <p className="text-slate-600 text-sm">
                Wir empfehlen, persönliche Informationen, die für die Vertragsbewertung nicht notwendig sind, 
                im PDF zu schwärzen oder zu entfernen.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-border/50 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
                <Lock size={24} />
              </div>
              <h3 className="font-medium text-lg mb-2">Sichere Verarbeitung</h3>
              <p className="text-slate-600 text-sm">
                Ihre hochgeladenen Dokumente werden über sichere Verbindungen verarbeitet, jedoch läuft die 
                Analyse durch externe Server (OpenAI).
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-border/50 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-legal-tertiary rounded-full flex items-center justify-center mb-4 text-legal-primary">
                <FileText size={24} />
              </div>
              <h3 className="font-medium text-lg mb-2">Präzise Analyse</h3>
              <p className="text-slate-600 text-sm">
                Unsere KI erkennt kritische Vertragsbedingungen und liefert Ihnen eine rechtliche 
                Ersteinschätzung nach Schweizer Recht.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-legal-primary">PDF-Vertrag hochladen</h2>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isCurrentlyAnalyzing} />
        </div>
        
        {isCurrentlyAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
            <AnalysisProgress progress={useRealAnalysis ? 50 : progress} />
          </div>
        )}
        
        {displayResult && !isCurrentlyAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 animate-fade-in">
            {useRealAnalysis ? (
              <WebhookAnalysisResult result={webhookResult} />
            ) : (
              <ClauseAnalysis 
                clauses={mockResult!.clauses} 
                overallRisk={mockResult!.overallRisk}
                summary={mockResult!.summary}
              />
            )}
            
            <div className="mt-10 flex justify-center">
              <Button 
                onClick={handleReset}
                className="bg-legal-primary hover:bg-legal-secondary text-white flex items-center gap-2"
              >
                Neue Analyse starten
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-legal-primary text-white py-8 mt-auto">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">VertragsAnalyse</h3>
              <p className="text-sm mt-1 text-gray-300">Schweizer Rechtsanalyse-Tool</p>
            </div>
            <div className="mt-4 md:mt-0 text-xs text-gray-300">
              <p>Vertragspartner: OpenAI (Analyse via GPT-4 Turbo) | Supabase Hosting | n8n Automatisierung</p>
              <p className="text-center mt-2">© {new Date().getFullYear()} VertragsAnalyse. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
