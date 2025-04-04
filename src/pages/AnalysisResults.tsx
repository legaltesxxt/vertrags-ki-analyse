
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface WebhookResponseItem {
  output: string;
}

const AnalysisResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisOutput, setAnalysisOutput] = useState('');

  // Extract analysis output from location state or raw webhook response
  useEffect(() => {
    if (location.state) {
      if (location.state.analysisOutput) {
        // Direct string output from state
        setAnalysisOutput(location.state.analysisOutput);
      } else if (location.state.webhookResponse) {
        // Array response from webhook
        const response = location.state.webhookResponse;
        if (Array.isArray(response) && response.length > 0 && response[0].output) {
          setAnalysisOutput(response[0].output);
        }
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-legal-primary">Analyse des Vertrags</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
            Neuen Vertrag hochladen
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            {analysisOutput ? (
              <MarkdownRenderer content={analysisOutput} />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Keine Analyseergebnisse verfügbar.</p>
                <p className="mt-2 text-sm">Bitte laden Sie einen Vertrag hoch, um eine Analyse zu erhalten.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};

export default AnalysisResults;
