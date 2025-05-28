
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
  const { toast } = useToast();

  const webhookUrl = getWebhookUrl();
  console.log("Using webhook URL:", webhookUrl);

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setErrorTimeStamp(null);
    setAnalysisStartTime(Date.now());

    const handleError = (errorMsg: string, timestamp: number) => {
      setError(errorMsg);
      setErrorTimeStamp(timestamp);
    };

    const handleSuccess = () => {
      setError(null);
      setErrorTimeStamp(null);
    };

    try {
      const response = await sendFileToWebhook(file, webhookUrl, handleError, handleSuccess);
      return response;
    } finally {
      setIsLoading(false);
      setAnalysisStartTime(null);
    }
  }, [webhookUrl]); 

  const resetError = useCallback(() => {
    // Check if minimum display time has passed (5 minutes = 300000 ms)
    const currentCanReset = canResetError(errorTimeStamp);
    
    if (currentCanReset) {
      setError(null);
      setErrorTimeStamp(null);
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
    isLoading, 
    analysisResult, 
    error, 
    resetError, 
    getRemainingErrorTime: getRemainingErrorTimeCallback, 
    canResetError: canResetErrorCallback,
    getAnalysisElapsedTime,
    analysisStartTime
  };
}
