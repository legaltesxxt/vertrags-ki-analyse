
import React, { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import AnalysisProgress from '@/components/AnalysisProgress';
import ClauseAnalysis from '@/components/ClauseAnalysis';
import WebhookSetup from '@/components/WebhookSetup';
import { useMockAnalysis } from '@/hooks/useMockAnalysis';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { startAnalysis, resetAnalysis, isAnalyzing, progress, analysisResult } = useMockAnalysis();
  const { sendToN8n, isLoading: isSendingToN8n } = useN8nWebhook();
  const { toast } = useToast();

  const handleFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
    
    // Prüfen, ob der n8n Webhook konfiguriert ist
    const webhookUrl = localStorage.getItem('n8nWebhookUrl');
    if (!webhookUrl) {
      toast({
        title: "Hinweis",
        description: "Sie haben keinen n8n Webhook konfiguriert. Die Analyse wird lokal simuliert.",
      });
    }
    
    // Starte die Analyse (in einer echten Anwendung würde hier die API aufgerufen werden)
    startAnalysis(file);
    
    // Wenn ein Webhook konfiguriert ist, sende die Datei an n8n
    if (webhookUrl) {
      sendToN8n(file).then(response => {
        if (response.success) {
          toast({
            title: "Erfolgreich",
            description: "Die Datei wurde an Ihren n8n Workflow gesendet.",
          });
        }
      });
    }
  }, [startAnalysis, sendToN8n, toast]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    resetAnalysis();
  }, [resetAnalysis]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-legal-primary mb-2">Vertragsanalyse</h1>
        <p className="text-gray-600 mb-8">Laden Sie einen Schweizer Vertrag hoch für eine KI-gestützte Risikoanalyse und rechtliche Bewertung.</p>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">n8n Integration</h2>
          <p className="text-gray-600 mb-4">
            Konfigurieren Sie Ihren n8n Webhook, um die Vertragsanalyse zu automatisieren und mit Ihren eigenen Workflows zu verbinden.
          </p>
          <WebhookSetup />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">PDF-Vertrag hochladen</h2>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isAnalyzing} />
        </div>
        
        {isAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <AnalysisProgress progress={progress} />
          </div>
        )}
        
        {analysisResult && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <ClauseAnalysis 
              clauses={analysisResult.clauses} 
              overallRisk={analysisResult.overallRisk}
              summary={analysisResult.summary}
            />
            
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
