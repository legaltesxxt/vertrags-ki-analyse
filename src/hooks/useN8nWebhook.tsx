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
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
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
    setAnalysisStartTime(Date.now());

    // Create AbortController with extended timeout (10 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10 * 60 * 1000); // 10 minutes timeout

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`=== SENDING TO WEBHOOK ===`);
      console.log(`File: ${file.name} (${file.size} bytes)`);
      console.log(`Webhook URL: ${webhookUrl}`);
      console.log(`Request started at: ${new Date().toISOString()}`);
      
      // Hier wird die tatsächliche API-Anfrage an n8n gesendet mit erweitertem Timeout
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Keep-alive headers for better connection stability
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=600, max=1000'
        }
      });
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
      console.log(`=== WEBHOOK RESPONSE ===`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Response received at: ${new Date().toISOString()}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorMsg = `HTTP Error: ${response.status} - ${response.statusText}`;
        console.error("HTTP Error details:", errorMsg);
        setError(errorMsg);
        setErrorTimeStamp(Date.now());
        throw new Error(errorMsg);
      }
      
      // Prüfe, ob die Antwort JSON ist
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        // Wenn es JSON ist, parsen wir es als JSON
        const data = await response.json();
        console.log("=== JSON RESPONSE PARSED ===");
        console.log("Full JSON response:", data);
        
        // Prüfen, ob die Antwort eine leere Analyse enthält
        if (!data || (Array.isArray(data) && (!data.length || !data[0]?.output))) {
          const errorMsg = "Keine gültige Analyse vom Server erhalten";
          console.error("Empty analysis error:", { data, isArray: Array.isArray(data), length: data?.length });
          setError(errorMsg);
          setErrorTimeStamp(Date.now());
          return { 
            success: false, 
            error: errorMsg 
          };
        }
        
        // Protokolliere die genaue Struktur der JSON-Antwort für bessere Fehleranalyse
        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          console.log("=== VALID JSON RESPONSE STRUCTURE ===");
          console.log("Response analysis:", {
            isArray: Array.isArray(data),
            length: data.length,
            firstItemKeys: Object.keys(data[0]),
            hasOutput: !!data[0].output,
            outputLength: data[0].output?.length,
            outputPreview: data[0].output?.substring(0, 300) + "..."
          });
          
          // Check for specific content indicators
          const output = data[0].output;
          const hasClauseHeaders = output.includes("### Klausel") || output.includes("###");
          const hasLawRefs = output.includes("**Gesetzliche Referenz**");
          const hasRiskAssessment = output.includes("**Risiko-Einstufung**");
          
          console.log("Content indicators:", {
            hasClauseHeaders,
            hasLawRefs,
            hasRiskAssessment,
            sectionCount: (output.match(/###/g) || []).length
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
        console.log("=== TEXT RESPONSE ===");
        console.log("Text response length:", responseText.length);
        console.log("Text response preview:", responseText.substring(0, 300));
        
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
      clearTimeout(timeoutId);
      
      let errorMsg = String(error);
      
      // Handle different error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMsg = "Die Analyse dauert länger als erwartet. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, falls das Problem weiterhin besteht.";
        } else if (error.message.includes('fetch')) {
          errorMsg = "Verbindungsfehler zum Analyse-Server. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
        }
      }
      
      console.error("=== WEBHOOK ERROR ===");
      console.error("Error details:", error);
      console.error("Error type:", error instanceof Error ? error.name : typeof error);
      setError(errorMsg);
      setErrorTimeStamp(Date.now());
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
      setAnalysisStartTime(null);
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

  const getAnalysisElapsedTime = useCallback(() => {
    if (!analysisStartTime) return 0;
    
    const currentTime = Date.now();
    const elapsedMs = currentTime - analysisStartTime;
    
    return Math.floor(elapsedMs / 1000); // Return elapsed time in seconds
  }, [analysisStartTime]);

  return { 
    sendToN8n, 
    isLoading, 
    analysisResult, 
    error, 
    resetError, 
    getRemainingErrorTime, 
    canResetError,
    getAnalysisElapsedTime,
    analysisStartTime
  };
}
