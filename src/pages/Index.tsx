
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-legal-primary mb-2">Vertragsanalyse</h1>
        <p className="text-gray-600 mb-8">Laden Sie einen Schweizer Vertrag hoch für eine KI-gestützte Risikoanalyse und rechtliche Bewertung.</p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">PDF-Vertrag hochladen</h2>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isCurrentlyAnalyzing} />
        </div>
        
        {isCurrentlyAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <AnalysisProgress progress={useRealAnalysis ? 50 : progress} />
          </div>
        )}
        
        {displayResult && !isCurrentlyAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            {useRealAnalysis ? (
              <WebhookAnalysisResult result={webhookResult} />
            ) : (
              <ClauseAnalysis 
                clauses={mockResult!.clauses} 
                overallRisk={mockResult!.overallRisk}
                summary={mockResult!.summary}
              />
            )}
            
            <div className="mt-8 flex justify-end">
              <Button variant="outline" onClick={handleReset}>
                Neue Analyse starten
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-legal-primary text-white py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">VertragsAnalyse</h3>
              <p className="text-sm mt-1 text-gray-300">Schweizer Rechtsanalyse-Tool</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-300">© {new Date().getFullYear()} VertragsAnalyse. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
