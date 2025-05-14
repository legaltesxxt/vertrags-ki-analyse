
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { parseClausesFromText } from '../utils/clauseParser';
import { WebhookResponse, AnalysisResult } from '../types/analysisTypes';

export type { AnalysisClause, AnalysisResult } from '../types/analysisTypes';

// Constants for error timeout
const ERROR_DISPLAY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const ERROR_STORAGE_KEY = 'webhook_error_timestamp';

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorTimestamp, setErrorTimestamp] = useState<number | null>(null);
  const { toast } = useToast();

  // Get the stored webhook URL or use the test URL as fallback
  const storedWebhookUrl = localStorage.getItem('n8nWebhookUrl');
  const webhookUrl = storedWebhookUrl || "https://vertrags.app.n8n.cloud/webhook-test/Vertrags-analyse";
  
  console.log("Using webhook URL:", webhookUrl);

  // Load error timestamp from localStorage on mount
  useEffect(() => {
    const storedErrorData = localStorage.getItem(ERROR_STORAGE_KEY);
    if (storedErrorData) {
      try {
        const { error, timestamp } = JSON.parse(storedErrorData);
        const timeRemaining = timestamp + ERROR_DISPLAY_DURATION - Date.now();
        
        // Only restore if there's time remaining
        if (timeRemaining > 0) {
          setError(error);
          setErrorTimestamp(timestamp);
        } else {
          // Clear storage if time has expired
          localStorage.removeItem(ERROR_STORAGE_KEY);
        }
      } catch (e) {
        // If any parsing error occurs, remove the item
        localStorage.removeItem(ERROR_STORAGE_KEY);
      }
    }
  }, []);

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      const errorMsg = "Webhook URL ist nicht konfiguriert";
      setErrorWithTimestamp(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setErrorTimestamp(null);
    localStorage.removeItem(ERROR_STORAGE_KEY);

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
        setErrorWithTimestamp(errorMsg);
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
          setErrorWithTimestamp(errorMsg);
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
          setErrorWithTimestamp(errorMsg);
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
      setErrorWithTimestamp(errorMsg);
      console.error("Fehler beim Senden zum n8n Webhook:", errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl]); 

  // Helper function to set error with timestamp
  const setErrorWithTimestamp = useCallback((errorMsg: string) => {
    const timestamp = Date.now();
    setError(errorMsg);
    setErrorTimestamp(timestamp);
    
    // Store in localStorage to persist across page reloads
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify({
      error: errorMsg,
      timestamp: timestamp
    }));
  }, []);

  // Calculate time remaining (in milliseconds)
  const getTimeRemaining = useCallback((): number => {
    if (!errorTimestamp) return 0;
    
    const elapsed = Date.now() - errorTimestamp;
    const remaining = Math.max(0, ERROR_DISPLAY_DURATION - elapsed);
    return remaining;
  }, [errorTimestamp]);

  // Check if error can be reset
  const canResetError = useCallback((): boolean => {
    return getTimeRemaining() === 0;
  }, [getTimeRemaining]);

  const resetError = useCallback(() => {
    // Only allow reset if display time has passed
    if (canResetError()) {
      setError(null);
      setErrorTimestamp(null);
      localStorage.removeItem(ERROR_STORAGE_KEY);
    } else {
      // Show toast message when trying to reset too early
      const remainingSeconds = Math.ceil(getTimeRemaining() / 1000);
      toast({
        title: "Fehler kann noch nicht zurückgesetzt werden",
        description: `Bitte warten Sie noch ${remainingSeconds} Sekunden.`,
        variant: "destructive",
      });
    }
  }, [canResetError, getTimeRemaining, toast]);

  return { 
    sendToN8n, 
    isLoading, 
    analysisResult, 
    error, 
    resetError,
    getTimeRemaining,
    canResetError,
    ERROR_DISPLAY_DURATION
  };
}
