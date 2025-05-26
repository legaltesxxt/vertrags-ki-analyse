import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { parseClausesFromText } from '../utils/clauseParser';
import { WebhookResponse, AnalysisResult } from '../types/analysisTypes';

export type { AnalysisClause, AnalysisResult } from '../types/analysisTypes';

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeStamp, setErrorTimeStamp] = useState<number | null>(null);
  const { toast } = useToast();

  // Get the stored webhook URL or use the test URL as fallback
  const storedWebhookUrl = localStorage.getItem('n8nWebhookUrl');
  const webhookUrl = storedWebhookUrl || "https://vertrags.app.n8n.cloud/webhook-test/3277c1f9-d2d0-48e5-b4b8-2cb84381f86e";
  
  console.log("Using webhook URL:", webhookUrl);

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      const errorMsg = "Webhook URL ist nicht konfiguriert";
      setError(errorMsg);
      setErrorTimeStamp(Date.now());
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setErrorTimeStamp(null);

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
        setErrorTimeStamp(Date.now());
        throw new Error(errorMsg);
      }
      
      // Prüfe, ob die Antwort JSON ist
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // Wenn es JSON ist, parsen wir es als JSON
        const data = await response.json();
        console.log("JSON-Antwort vom Webhook erhalten:", data);
        
        // Prüfen, ob die Antwort eine leere Analyse enthält
        if (!data || (Array.isArray(data) && (!data.length || !data[0]?.output))) {
          const errorMsg = "Keine gültige Analyse vom Server erhalten";
          setError(errorMsg);
          setErrorTimeStamp(Date.now());
          return { 
            success: false, 
            error: errorMsg 
          };
        }
        
        // Protokolliere die genaue Struktur der JSON-Antwort für bessere Fehleranalyse
        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          console.log("Webhook Response Format:", {
            isArray: Array.isArray(data),
            length: data.length,
            firstItem: data[0],
            hasOutput: !!data[0].output,
            outputLength: data[0].output?.length,
            outputSample: data[0].output?.substring(0, 200) + "..."
          });
          
          // Check for legal references in the output to debug
          const hasLawRefs = data[0].output.includes("**Gesetzliche Referenz**") || 
                             data[0].output.includes("**Gesetz**") || 
                             data[0].output.includes("**Rechtsgrundlage**");
          
          console.log("Legal reference check:", {
            hasLawRefs,
            includesQuotes: data[0].output.includes('"') || data[0].output.includes('„')
          });
          
          // Reset error state on successful response
          setError(null);
          setErrorTimeStamp(null);
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
          setErrorTimeStamp(Date.now());
          return { 
            success: false, 
            error: errorMsg 
          };
        }
        
        // Reset error state on successful response
        setError(null);
        setErrorTimeStamp(null);
        
        // Text-Antwort in ein strukturiertes Format umwandeln oder direkt zurückgeben
        return {
          success: true,
          data: { rawText: responseText },
        };
      }
      
    } catch (error) {
      const errorMsg = String(error);
      setError(errorMsg);
      setErrorTimeStamp(Date.now());
      console.error("Fehler beim Senden zum n8n Webhook:", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl]); 

  const resetError = useCallback(() => {
    // Check if minimum display time has passed (5 minutes = 300000 ms)
    const minTimeMs = 300000; // 5 minutes in milliseconds
    const currentTime = Date.now();
    const timeElapsed = errorTimeStamp ? currentTime - errorTimeStamp : minTimeMs;
    
    if (timeElapsed >= minTimeMs) {
      setError(null);
      setErrorTimeStamp(null);
    } else {
      console.log(`Fehler kann erst nach 5 Minuten zurückgesetzt werden. Verbleibende Zeit: ${Math.ceil((minTimeMs - timeElapsed) / 1000)} Sekunden`);
    }
  }, [errorTimeStamp]);

  const getRemainingErrorTime = useCallback(() => {
    if (!errorTimeStamp) return 0;
    
    const minTimeMs = 300000; // 5 minutes in milliseconds
    const currentTime = Date.now();
    const timeElapsed = currentTime - errorTimeStamp;
    const remainingMs = Math.max(0, minTimeMs - timeElapsed);
    
    return Math.ceil(remainingMs / 1000); // Return remaining time in seconds
  }, [errorTimeStamp]);

  const canResetError = useCallback(() => {
    if (!errorTimeStamp) return true;
    
    const minTimeMs = 300000; // 5 minutes in milliseconds
    const currentTime = Date.now();
    const timeElapsed = currentTime - errorTimeStamp;
    
    return timeElapsed >= minTimeMs;
  }, [errorTimeStamp]);

  return { sendToN8n, isLoading, analysisResult, error, resetError, getRemainingErrorTime, canResetError };
}
