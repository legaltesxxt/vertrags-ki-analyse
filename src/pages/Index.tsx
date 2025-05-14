
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/home/Header';
import Footer from '@/components/Footer';
import FeatureCards from '@/components/features/FeatureCards';
import ProcessSteps from '@/components/home/ProcessSteps';
import AnalysisSection from '@/components/analysis/AnalysisSection';
import FlipCardsGrid from '@/components/home/FlipCardsGrid';
import FAQ from '@/components/home/FAQ';

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
    canResetError
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
        
        // Parse the markdown content into structured data
        const clauses = outputText.split('### ').filter(Boolean).map((clauseText, index) => {
          const title = clauseText.split('\n')[0].trim();
          
          // Improved regex patterns with better boundary conditions for full text extraction
          // Specifically modified to capture text until the next section heading
          const textMatch = clauseText.match(/\*\*(?:Klauseltext|Text)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Analyse|Bewertung)|\n\n\*\*(?:Analyse|Bewertung)|\s*$)/m);
          const analysisMatch = clauseText.match(/\*\*(?:Analyse|Bewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\n\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\s*$)/m);
          const riskMatch = clauseText.match(/\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\n\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\s*$)/m);
          
          // Enhanced pattern specifically for law references with proper boundaries
          const lawRefMatch = clauseText.match(/\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n---|\n\n---|\s*$)/m);
          
          // Improved recommendation matching with correct boundaries
          const recommendationMatch = clauseText.match(/\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n---|\n\n---|\n###|\n\n###|\s*$)/m);
          
          // Enhanced logging to debug extraction issues
          console.log(`Index page - Clause ${index + 1} (${title}) extraction:`, {
            fullClauseTextLen: clauseText.length,
            fullClauseTextSample: clauseText.substring(0, 200) + "...",
            textExtracted: !!textMatch,
            textSample: textMatch ? textMatch[1].trim().substring(0, 100) + (textMatch[1].length > 100 ? "..." : "") : "Not found",
            textLength: textMatch ? textMatch[1].trim().length : 0,
            analysisExtracted: !!analysisMatch,
            analysisLength: analysisMatch ? analysisMatch[1].trim().length : 0,
            riskExtracted: !!riskMatch,
            riskValue: riskMatch ? riskMatch[1].trim() : "Not found",
            lawRefExtracted: !!lawRefMatch,
            lawRefSample: lawRefMatch ? lawRefMatch[1].trim().substring(0, 100) + (lawRefMatch[1].length > 100 ? "..." : "") : "Not found",
            lawRefLength: lawRefMatch ? lawRefMatch[1].trim().length : 0,
            recommendationExtracted: !!recommendationMatch,
            recommendationSample: recommendationMatch ? recommendationMatch[1].trim().substring(0, 100) + (recommendationMatch[1].length > 100 ? "..." : "") : "Not found"
          });
          
          const matches = {
            text: textMatch ? textMatch[1].trim() : '',
            analysis: analysisMatch ? analysisMatch[1].trim() : '',
            risk: (riskMatch ? riskMatch[1].trim() : 'Rechtskonform') as 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig',
            lawReference: {
              text: lawRefMatch ? lawRefMatch[1].trim() : '',
              link: ''
            },
            recommendation: recommendationMatch ? recommendationMatch[1].trim() : ''
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

        console.log("Structured analysis result:", analysisResult);
        console.log("First clause text length:", analysisResult.clauses[0]?.text?.length);
        console.log("First clause text preview:", analysisResult.clauses[0]?.text?.substring(0, 200));
        
        navigate('/analyse-ergebnisse', { 
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
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
