
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface AnalysisClause {
  id: string;
  title: string;
  text: string;
  risk: 'niedrig' | 'mittel' | 'hoch';
  analysis: string;
  lawReference: {
    text: string;
    link: string;
  };
  recommendation: string;
}

export interface AnalysisResult {
  clauses: AnalysisClause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch';
  summary: string;
}

interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  analysisResult?: AnalysisResult;
}

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  // Die konfigurierte n8n Webhook URL
  const webhookUrl = "https://vertrags.app.n8n.cloud/webhook-test/Vertrags-analyse";

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      console.error("Webhook URL ist nicht konfiguriert");
      return { success: false, error: "Webhook nicht konfiguriert" };
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Senden von ${file.name} an n8n Webhook: ${webhookUrl}`);
      
      // Hier wird die tatsächliche API-Anfrage an n8n gesendet
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        // Bei Bedarf können hier weitere Header hinzugefügt werden
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datei erfolgreich an n8n gesendet:", data);

      // Wenn eine Analyse-Antwort vorhanden ist, verarbeiten wir diese
      if (data.analysisResult) {
        setAnalysisResult(data.analysisResult);
        return { 
          success: true, 
          data, 
          analysisResult: data.analysisResult 
        };
      }
      
      return { success: true, data };
      
    } catch (error) {
      console.error("Fehler beim Senden zum n8n Webhook:", error);
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendToN8n, isLoading, analysisResult };
}
