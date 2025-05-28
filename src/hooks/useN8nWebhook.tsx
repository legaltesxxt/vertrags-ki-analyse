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

    // Create AbortController with EXTENDED timeout (20 minutes for complex contracts)
    const controller = new AbortController();
    const timeoutDuration = 20 * 60 * 1000; // 20 minutes timeout
    const timeoutId = setTimeout(() => {
      console.log("=== TIMEOUT REACHED ===");
      console.log(`Request timed out after ${timeoutDuration / 1000} seconds`);
      controller.abort();
    }, timeoutDuration);

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`=== SENDING TO WEBHOOK ===`);
      console.log(`File: ${file.name} (${file.size} bytes)`);
      console.log(`Webhook URL: ${webhookUrl}`);
      console.log(`Request started at: ${new Date().toISOString()}`);
      console.log(`Timeout set to: ${timeoutDuration / 1000} seconds (${timeoutDuration / 60000} minutes)`);
      
      // Extended timeout fetch with robust headers
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          // Extended keep-alive headers for very long requests
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=1200, max=1000' // 20 minutes keep-alive
        }
      });
      
      // Clear timeout since request completed successfully
      clearTimeout(timeoutId);
      
      console.log(`=== WEBHOOK RESPONSE RECEIVED ===`);
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
      
      // Check content type
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        // Parse JSON response
        const data = await response.json();
        console.log("=== JSON RESPONSE PARSED ===");
        console.log("Full JSON response:", data);
        console.log("Response structure analysis:", {
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'Not an array',
          dataType: typeof data,
          firstItemKeys: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : 'No first item'
        });
        
        // IMPROVED: Handle JSON array format specifically  
        if (Array.isArray(data) && data.length > 0) {
          console.log("=== PROCESSING JSON ARRAY RESPONSE ===");
          const firstItem = data[0];
          console.log("First item analysis:", {
            hasOutput: !!firstItem.output,
            outputType: typeof firstItem.output,
            outputLength: firstItem.output?.length || 0,
            outputPreview: firstItem.output?.substring(0, 200) + "..."
          });
          
          if (firstItem.output && typeof firstItem.output === 'string' && firstItem.output.trim()) {
            console.log("=== VALID JSON ARRAY WITH OUTPUT ===");
            
            // Reset error state on successful response
            setError(null);
            setErrorTimeStamp(null);
            
            // Return the structured response for parsing
            return { 
              success: true, 
              data: data
            };
          } else {
            console.error("=== INVALID OUTPUT IN JSON ARRAY ===");
            const errorMsg = "Leere oder ungültige Analyse im JSON-Array erhalten";
            setError(errorMsg);
            setErrorTimeStamp(Date.now());
            return { 
              success: false, 
              error: errorMsg 
            };
          }
        }
        
        // Handle other JSON formats
        if (data && !Array.isArray(data)) {
          console.log("=== NON-ARRAY JSON RESPONSE ===");
          if (data.output || data.rawText) {
            setError(null);
            setErrorTimeStamp(null);
            return { 
              success: true, 
              data: data
            };
          }
        }
        
        // If we reach here, the JSON doesn't contain expected data
        console.error("=== UNEXPECTED JSON FORMAT ===");
        const errorMsg = "Unerwartetes JSON-Format vom Server erhalten";
        setError(errorMsg);
        setErrorTimeStamp(Date.now());
        return { 
          success: false, 
          error: errorMsg 
        };
        
      } else {
        // Handle text response
        const responseText = await response.text();
        console.log("=== TEXT RESPONSE ===");
        console.log("Text response length:", responseText.length);
        console.log("Text response preview:", responseText.substring(0, 300));
        
        if (!responseText || responseText.trim() === "") {
          const errorMsg = "Leere Textantwort vom Server erhalten";
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
        
        return {
          success: true,
          data: { rawText: responseText },
        };
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      let errorMsg = String(error);
      
      // Enhanced error handling with specific timeout detection
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMsg = `Die Analyse dauerte länger als ${timeoutDuration / 60000} Minuten und wurde abgebrochen. Dies kann bei sehr komplexen Verträgen vorkommen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.`;
          console.error("=== TIMEOUT ERROR ===");
          console.error(`Analysis timed out after ${timeoutDuration / 1000} seconds`);
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMsg = "Netzwerkfehler beim Verbinden zum Analyse-Server. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
          console.error("=== NETWORK ERROR ===");
        } else if (error.message.includes('Failed to fetch')) {
          errorMsg = "Verbindung zum Server unterbrochen. Dies kann bei sehr langen Analysen vorkommen. Bitte versuchen Sie es erneut.";
          console.error("=== FETCH ERROR ===");
        }
      }
      
      console.error("=== WEBHOOK ERROR ===");
      console.error("Error details:", error);
      console.error("Error type:", error instanceof Error ? error.name : typeof error);
      console.error("Error message:", error instanceof Error ? error.message : error);
      
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
