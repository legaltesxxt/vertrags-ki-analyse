import { WebhookResponse } from '../types/webhookTypes';
import { WEBHOOK_CONFIG } from './webhookConfig';
import { createWebhookError } from './webhookErrorHandler';

export async function sendFileToWebhook(
  file: File, 
  webhookUrl: string,
  onError: (error: string, timestamp: number) => void,
  onSuccess: () => void
): Promise<WebhookResponse> {
  if (!webhookUrl) {
    const errorMsg = "Webhook URL ist nicht konfiguriert";
    onError(errorMsg, Date.now());
    return { success: false, error: errorMsg };
  }

  // Create AbortController with EXTENDED timeout (20 minutes for complex contracts)
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
      onError(errorMsg, Date.now());
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
          onSuccess();
          
          // Return the structured response for parsing
          return { 
            success: true, 
            data: data
          };
        } else {
          console.error("=== INVALID OUTPUT IN JSON ARRAY ===");
          const errorMsg = "Leere oder ungültige Analyse im JSON-Array erhalten";
          onError(errorMsg, Date.now());
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
          onSuccess();
          return { 
            success: true, 
            data: data
          };
        }
      }
      
      // If we reach here, the JSON doesn't contain expected data
      console.error("=== UNEXPECTED JSON FORMAT ===");
      const errorMsg = "Unerwartetes JSON-Format vom Server erhalten";
      onError(errorMsg, Date.now());
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
        onError(errorMsg, Date.now());
        return { 
          success: false, 
          error: errorMsg 
        };
      }
      
      // Reset error state on successful response
      onSuccess();
      
      return {
        success: true,
        data: { rawText: responseText },
      };
    }
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    const errorMsg = createWebhookError(error, WEBHOOK_CONFIG.TIMEOUT_DURATION);
    onError(errorMsg, Date.now());
    return { success: false, error: errorMsg };
  }
}
