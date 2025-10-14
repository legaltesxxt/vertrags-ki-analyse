
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalysisResult } from '@/types/analysisTypes';

interface WebhookResponseItem {
  output: string;
}

export const useAnalysisData = () => {
  const location = useLocation();
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [structuredResult, setStructuredResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (location.state) {
      if (location.state.analysisResult) {
        console.log('Received structured analysis result:', location.state.analysisResult);
        setStructuredResult(location.state.analysisResult);
      }
      
      if (location.state.webhookResponse) {
        const response = location.state.webhookResponse;
        console.log('Received webhook response:', response);
        
        if (Array.isArray(response) && response.length > 0) {
          const outputData = response[0];
          if (outputData.output) {
            setAnalysisOutput(outputData.output);
          }
        }
      }
      
      if (location.state.analysisOutput) {
        console.log('Received analysis output:', location.state.analysisOutput);
        setAnalysisOutput(location.state.analysisOutput);
      }
    }
  }, [location.state]);

  const hasContent = !!(analysisOutput || structuredResult);
  const isPaidAnalysis = location.state?.isPaidAnalysis || false;

  return {
    analysisOutput,
    structuredResult,
    hasContent,
    isPaidAnalysis
  };
};
