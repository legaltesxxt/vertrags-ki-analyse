
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/home/Header';
import Footer from '@/components/Footer';
import FeatureCards from '@/components/features/FeatureCards';
import ProcessSteps from '@/components/home/ProcessSteps';
import AnalysisSection from '@/components/analysis/AnalysisSection';
import FlipCardsGrid from '@/components/home/FlipCardsGrid';
import FAQ from '@/components/home/FAQ';
import { parseClausesFromText } from '@/utils/clauseParser';

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    sendToN8n, 
    isLoading: isSendingToN8n, 
    analysisResult: webhookResult, 
    error: webhookError, 
    resetError,
    getRemainingErrorTime,
    canResetError,
    getAnalysisElapsedTime
  } = useN8nWebhook();
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
        console.log("Raw output text to parse:", outputText);
        
        try {
          // Use the unified parsing logic from clauseParser
          const analysisResult = parseClausesFromText(outputText);
          
          console.log("Structured analysis result:", analysisResult);
          if (analysisResult.clauses.length > 0) {
            console.log("First clause text length:", analysisResult.clauses[0]?.text?.length);
            console.log("First clause text preview:", analysisResult.clauses[0]?.text?.substring(0, 200));
          }

          navigate('/analyse-ergebnisse', { 
            state: { 
              analysisResult,
              analysisOutput: outputText
            }
          });
          return;
        } catch (error) {
          console.error("Error parsing clauses:", error);
          toast({
            title: "Fehler bei der Analyse",
            description: "Die Analyseergebnisse konnten nicht korrekt verarbeitet werden.",
            variant: "destructive",
          });
        }
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
        <FlipCardsGrid />
        <FAQ />
        
        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-legal-primary">PDF-Vertrag hochladen</h2>
          </div>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isSendingToN8n} />
        </div>
        
        <AnalysisSection
          isAnalyzing={isSendingToN8n}
          webhookError={webhookError}
          webhookResult={webhookResult}
          useRealAnalysis={useRealAnalysis}
          onReset={handleReset}
          getRemainingErrorTime={getRemainingErrorTime}
          canResetError={canResetError}
          getAnalysisElapsedTime={getAnalysisElapsedTime}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
