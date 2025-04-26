
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import FeatureCards from '@/components/features/FeatureCards';
import ProcessSteps from '@/components/home/ProcessSteps';
import AnalysisSection from '@/components/analysis/AnalysisSection';

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { sendToN8n, isLoading: isSendingToN8n, analysisResult: webhookResult, error: webhookError, resetError } = useN8nWebhook();
  const [useRealAnalysis, setUseRealAnalysis] = useState(true);
  const { toast } = useToast();

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    
    const response = await sendToN8n(file);
      
    if (response.success && response.data) {
      console.log("Webhook response received:", response.data);
      
      // Parse the response into structured analysis result
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
        const outputText = response.data[0].output;
        
        // Parse the markdown content into structured data
        const clauses = outputText.split('### ').filter(Boolean).map((clauseText, index) => {
          const title = clauseText.split('\n')[0].trim();
          const matches = {
            text: clauseText.match(/\*\*Klauseltext\*\*\s*\n([^*]+)/m)?.[1]?.trim() || '',
            analysis: clauseText.match(/\*\*Analyse\*\*\s*\n([^*]+)/m)?.[1]?.trim() || '',
            risk: (clauseText.match(/\*\*Risiko-Einstufung\*\*\s*\n([^*]+)/m)?.[1]?.trim() || 'Rechtskonform') as 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig',
            lawReference: {
              text: clauseText.match(/\*\*Gesetzliche Referenz\*\*\s*\n([^*]+)/m)?.[1]?.trim() || '',
              link: ''
            },
            recommendation: clauseText.match(/\*\*Handlungsbedarf\*\*\s*\n([^*]+)/m)?.[1]?.trim() || ''
          };

          return {
            id: `clause-${index + 1}`,
            title,
            ...matches
          };
        });

        const analysisResult = {
          clauses,
          overallRisk: clauses.some(c => c.risk === 'Rechtlich unzulässig') 
            ? 'Rechtlich unzulässig' 
            : clauses.some(c => c.risk === 'Rechtlich fraglich') 
              ? 'Rechtlich fraglich' 
              : 'Rechtskonform',
          summary: 'Vertragliche Analyse abgeschlossen'
        };

        navigate('/analysis-results', { 
          state: { 
            analysisResult,
            analysisOutput: outputText
          }
        });
        return;
      }
    } else {
      console.error("Error sending file to n8n:", response.error);
      toast({
        title: "Fehler bei der Verarbeitung",
        description: "Die Datei konnte nicht zur Analyse gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  }, [sendToN8n, toast, navigate]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    resetError();
    setUseRealAnalysis(true);
  }, [resetError]);

  return (
    <div className="min-h-screen flex flex-col bg-legal-light">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <Header />
        <FeatureCards />
        <ProcessSteps />

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <h2 className="text-2xl font-semibold mb-6 text-legal-primary">PDF-Vertrag hochladen</h2>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isSendingToN8n} />
        </div>
        
        <AnalysisSection
          isAnalyzing={isSendingToN8n}
          webhookError={webhookError}
          webhookResult={webhookResult}
          useRealAnalysis={useRealAnalysis}
          onReset={handleReset}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
