import { WebhookResponse } from '../types/webhookTypes';
import { WEBHOOK_CONFIG } from './webhookConfig';
import { createWebhookError } from './webhookErrorHandler';

export async function sendFileToWebhook(
  file: File, 
  webhookUrl: string,
  onError: (error: string, timestamp: number, isNetworkError?: boolean) => void,
  onSuccess: () => void
): Promise<WebhookResponse> {
  if (!webhookUrl) {
    const errorMsg = "Webhook URL ist nicht konfiguriert";
    onError(errorMsg, Date.now(), false);
    return { success: false, error: errorMsg };
  }

  // Create AbortController with 25 minute timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("=== TIMEOUT REACHED ===");
    console.log(`Request timed out after ${WEBHOOK_CONFIG.TIMEOUT_DURATION / 1000} seconds`);
    controller.abort();
  }, WEBHOOK_CONFIG.TIMEOUT_DURATION);

  try {
    // FormData erstellen für den Datei-Upload
    const formData = new FormData();
    formData.append('file', file);
    
    console.log(`=== SENDING TO WEBHOOK ===`);
    console.log(`File: ${file.name} (${file.size} bytes)`);
    console.log(`Webhook URL: ${webhookUrl}`);
    console.log(`Request started at: ${new Date().toISOString()}`);
    console.log(`Timeout set to: ${WEBHOOK_CONFIG.TIMEOUT_DURATION / 1000} seconds (${WEBHOOK_CONFIG.TIMEOUT_DURATION / 60000} minutes)`);
    
    // Extended timeout fetch with robust headers
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        // Extended keep-alive headers for very long requests
        'Connection': 'keep-alive',
        'Keep-Alive': 'timeout=1500, max=1000' // 25 minutes keep-alive
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
      
      // Determine if this is a network error that should be retried
      const isNetworkError = response.status >= 500 || response.status === 502 || response.status === 503 || response.status === 504;
      onError(errorMsg, Date.now(), isNetworkError);
      throw new Error(errorMsg);
    }
    
    // Get response as text first for logging
    const responseText = await response.text();
    console.log("=== RAW RESPONSE TEXT ===");
    console.log("Response text length:", responseText.length);
    console.log("Response text preview:", responseText.substring(0, 500));
    
    if (!responseText || responseText.trim() === "") {
      const errorMsg = "Leere Antwort vom Server erhalten";
      onError(errorMsg, Date.now(), false);
      return { 
        success: false, 
        error: errorMsg 
      };
    }
    
    // Validate response format before calling onSuccess
    let hasValidData = false;
    
    // Try to parse as JSON first
    try {
      const jsonData = JSON.parse(responseText);
      console.log("=== JSON PARSING SUCCESSFUL ===");
      console.log("Parsed JSON structure:", {
        isArray: Array.isArray(jsonData),
        length: Array.isArray(jsonData) ? jsonData.length : 'Not an array',
        firstItemKeys: Array.isArray(jsonData) && jsonData.length > 0 ? Object.keys(jsonData[0]) : 'No first item'
      });
      
      // Handle JSON array format [{"output": "..."}]
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const firstItem = jsonData[0];
        if (firstItem.output && typeof firstItem.output === 'string' && firstItem.output.trim()) {
          console.log("=== VALID JSON ARRAY WITH OUTPUT FOUND ===");
          console.log("Output preview:", firstItem.output.substring(0, 300));
          hasValidData = true;
        }
      }
      
      // Handle other JSON formats
      if (jsonData && !Array.isArray(jsonData) && (jsonData.output || jsonData.rawText)) {
        console.log("=== NON-ARRAY JSON WITH CONTENT ===");
        hasValidData = true;
      }
      
    } catch (jsonError) {
      // Not valid JSON, check if it looks like valid text content
      console.log("=== NOT JSON, CHECKING AS PLAIN TEXT ===");
      console.log("JSON parse error:", jsonError);
      
      // Basic validation for plain text response
      if (responseText.trim().length > 100 && responseText.includes('###')) {
        console.log("=== VALID PLAIN TEXT FORMAT DETECTED ===");
        hasValidData = true;
      }
    }
    
    // Only call onSuccess if we have valid, parseable data
    if (hasValidData) {
      console.log("=== VALID DATA CONFIRMED - DO NOT CALL onSuccess YET ===");
      console.log("Success will be called after successful parsing in useN8nWebhook");
    } else {
      const errorMsg = "Antwort enthält keine gültigen, verarbeitbaren Daten";
      console.error("=== INVALID RESPONSE FORMAT ===");
      onError(errorMsg, Date.now(), false);
      return { 
        success: false, 
        error: errorMsg 
      };
    }
    
    // Return success but don't call onSuccess yet - that will happen after parsing
    return {
      success: true,
      data: responseText,
    };
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Determine if this is a network error based on error type
    const isNetworkError = error instanceof Error && (
      error.name === 'AbortError' ||
      error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('TypeError: Failed to fetch')
    );
    
    const errorMsg = createWebhookError(error, WEBHOOK_CONFIG.TIMEOUT_DURATION);
    onError(errorMsg, Date.now(), isNetworkError);
    return { success: false, error: errorMsg };
  }
}
