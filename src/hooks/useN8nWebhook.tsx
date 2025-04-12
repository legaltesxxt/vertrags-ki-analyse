
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { parseClausesFromText } from '../utils/clauseParser';
import { WebhookResponse, AnalysisResult } from '../types/analysisTypes';

export type { AnalysisClause, AnalysisResult } from '../types/analysisTypes';

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Die konfigurierte n8n Webhook URL
  const webhookUrl = "https://vertrags.app.n8n.cloud/webhook-test/Vertrags-analyse";

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      const errorMsg = "Webhook URL ist nicht konfiguriert";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Senden von ${file.name} an n8n Webhook: ${webhookUrl}`);
      
      // Hier wird die tatsächliche API-Anfrage an n8n gesendet
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorMsg = `HTTP Error: ${response.status} - Verbindung zum Server fehlgeschlagen`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Prüfe, ob die Antwort JSON ist
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Wenn es JSON ist, parsen wir es als JSON
        const data = await response.json();
        console.log("JSON-Antwort vom Webhook erhalten:", data);
        
        // Prüfen, ob die Antwort eine leere Analyse enthält
        if (!data || !data[0]?.output) {
          const errorMsg = "Keine gültige Analyse vom Server erhalten";
          setError(errorMsg);
          return { 
            success: false, 
            error: errorMsg 
          };
        }
        
        // Direkte Weiterleitung der unveränderten Response
        return { 
          success: true, 
          data, 
        };
      } else {
        // Andernfalls versuchen wir, die Antwort als Text zu behandeln
        const responseText = await response.text();
        console.log("Text-Antwort vom Webhook erhalten:", responseText);
        
        if (!responseText || responseText.trim() === "") {
          const errorMsg = "Leere Antwort vom Server erhalten";
          setError(errorMsg);
          return { 
            success: false, 
            error: errorMsg 
          };
        }
        
        // Text-Antwort in ein strukturiertes Format umwandeln oder direkt zurückgeben
        return {
          success: true,
          data: { rawText: responseText },
        };
      }
      
    } catch (error) {
      const errorMsg = String(error);
      setError(errorMsg);
      console.error("Fehler beim Senden zum n8n Webhook:", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { sendToN8n, isLoading, analysisResult, error, resetError };
}
