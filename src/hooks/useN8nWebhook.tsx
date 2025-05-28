
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { parseClausesFromText } from '../utils/clauseParser';
import { WebhookResponse, AnalysisResult } from '../types/analysisTypes';
import { getWebhookUrl } from '../utils/webhookConfig';
import { canResetError, getRemainingErrorTime } from '../utils/webhookErrorHandler';
import { sendFileToWebhook } from '../utils/webhookRequest';

export type { AnalysisClause, AnalysisResult } from '../types/analysisTypes';

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeStamp, setErrorTimeStamp] = useState<number | null>(null);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();

  const webhookUrl = getWebhookUrl();
  console.log("Using webhook URL:", webhookUrl);

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setErrorTimeStamp(null);
    setAnalysisStartTime(Date.now());
    setIsRetrying(false);

    const handleError = (errorMsg: string, timestamp: number, isNetworkError: boolean = false) => {
      console.log("=== ERROR HANDLER CALLED ===");
      console.log("Error message:", errorMsg);
      console.log("Is network error:", isNetworkError);
      
      setError(errorMsg);
      setErrorTimeStamp(timestamp);
      
      // Only stop loading for non-network errors or final failures
      if (!isNetworkError) {
        setIsLoading(false);
        setAnalysisStartTime(null);
      }
    };

    const handleSuccess = () => {
      setError(null);
      setErrorTimeStamp(null);
      setIsLoading(false);
      setAnalysisStartTime(null);
      setIsRetrying(false);
    };

    const attemptAnalysis = async (retryCount: number = 0): Promise<WebhookResponse> => {
      try {
        if (retryCount > 0) {
          setIsRetrying(true);
          console.log(`=== RETRY ATTEMPT ${retryCount} ===`);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const response = await sendFileToWebhook(file, webhookUrl, handleError, handleSuccess);
        
        if (response.success && response.data) {
          console.log("=== WEBHOOK SUCCESS - PARSING RESPONSE ===");
          console.log("Response data type:", typeof response.data);
          console.log("Response data preview:", response.data.substring ? response.data.substring(0, 300) : response.data);
          
          try {
            // Parse the response using the updated parser that handles JSON arrays
            const analysisResult = parseClausesFromText(response.data);
            
            console.log("=== PARSING SUCCESSFUL ===");
            console.log("Analysis result:", analysisResult);
            console.log("Number of clauses:", analysisResult.clauses.length);
            
            setAnalysisResult(analysisResult);
            handleSuccess();
            
            return {
              success: true,
              data: response.data,
              analysisResult
            };
            
          } catch (parseError) {
            console.error("=== PARSING ERROR ===");
            console.error("Parse error:", parseError);
            
            const errorMsg = `Fehler beim Verarbeiten der Analyseergebnisse: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
            handleError(errorMsg, Date.now(), false);
            
            return {
              success: false,
              error: errorMsg
            };
          }
        } else if (!response.success && response.error) {
          // Check if this is a network/timeout error that we should retry
          const isNetworkError = response.error.includes('Netzwerkfehler') || 
                                response.error.includes('Verbindung') || 
                                response.error.includes('Timeout') ||
                                response.error.includes('abgebrochen');
          
          if (isNetworkError && retryCount < 3) {
            console.log(`=== NETWORK ERROR - WILL RETRY (${retryCount + 1}/3) ===`);
            console.log("Error:", response.error);
            
            // Show user we're retrying
            const retryMsg = `Verbindungsproblem erkannt. Erneuter Versuch ${retryCount + 1}/3...`;
            handleError(retryMsg, Date.now(), true);
            
            // Retry the analysis
            return attemptAnalysis(retryCount + 1);
          } else {
            // Final error or non-network error
            console.log("=== FINAL ERROR OR NON-NETWORK ERROR ===");
            handleError(response.error, Date.now(), false);
            return response;
          }
        }
        
        return response;
        
      } catch (unexpectedError) {
        console.error("=== UNEXPECTED ERROR IN ATTEMPT ===");
        console.error("Unexpected error:", unexpectedError);
        
        const errorMsg = `Unerwarteter Fehler: ${unexpectedError instanceof Error ? unexpectedError.message : String(unexpectedError)}`;
        handleError(errorMsg, Date.now(), false);
        
        return {
          success: false,
          error: errorMsg
        };
      }
    };

    return attemptAnalysis();
  }, [webhookUrl]); 

  const resetError = useCallback(() => {
    // Check if minimum display time has passed (5 minutes = 300000 ms)
    const currentCanReset = canResetError(errorTimeStamp);
    
    if (currentCanReset) {
      setError(null);
      setErrorTimeStamp(null);
      setIsLoading(false);
      setAnalysisStartTime(null);
      setIsRetrying(false);
    } else {
      const remainingTime = getRemainingErrorTime(errorTimeStamp);
      console.log(`Fehler kann erst nach 5 Minuten zurückgesetzt werden. Verbleibende Zeit: ${remainingTime} Sekunden`);
    }
  }, [errorTimeStamp]);

  const getRemainingErrorTimeCallback = useCallback(() => {
    return getRemainingErrorTime(errorTimeStamp);
  }, [errorTimeStamp]);

  const canResetErrorCallback = useCallback(() => {
    return canResetError(errorTimeStamp);
  }, [errorTimeStamp]);

  const getAnalysisElapsedTime = useCallback(() => {
    if (!analysisStartTime) return 0;
    
    const currentTime = Date.now();
    const elapsedMs = currentTime - analysisStartTime;
    
    return Math.floor(elapsedMs / 1000); // Return elapsed time in seconds
  }, [analysisStartTime]);

  return { 
    sendToN8n, 
    isLoading: isLoading || isRetrying, 
    analysisResult, 
    error, 
    resetError, 
    getRemainingErrorTime: getRemainingErrorTimeCallback, 
    canResetError: canResetErrorCallback,
    getAnalysisElapsedTime,
    analysisStartTime,
    isRetrying
  };
}
