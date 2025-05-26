
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import FileUpload from '@/components/FileUpload';
import AnalysisSection from '@/components/analysis/AnalysisSection';
import { parseClausesFromText } from '@/utils/clauseParser';

const UploadContract = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    sendToN8n, 
    isLoading: isSendingToN8n, 
    error, 
    resetError, 
    getRemainingErrorTime, 
    canResetError 
  } = useN8nWebhook();

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    
    console.log("=== FILE UPLOAD START ===");
    console.log("Selected file:", file.name, file.size, "bytes");
    
    const response = await sendToN8n(file);
    
    console.log("=== WEBHOOK RESPONSE RECEIVED ===");
    console.log("Response success:", response.success);
    console.log("Response data:", response.data);
      
    if (response.success && response.data) {
      console.log("Webhook response received in UploadContract:", response.data);
      
      // Handle JSON array response format
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
        const outputText = response.data[0].output;
        console.log("=== EXTRACTED OUTPUT TEXT ===");
        console.log("Output text length:", outputText.length);
        console.log("Output text preview:", outputText.substring(0, 500));
        
        try {
          // Use the parsing logic from clauseParser
          const analysisResult = parseClausesFromText(outputText);
          
          console.log("=== PARSING SUCCESSFUL ===");
          console.log("Structured analysis result:", analysisResult);
          console.log("Number of clauses:", analysisResult.clauses.length);
          
          if (analysisResult.clauses.length > 0) {
            console.log("First clause preview:", {
              id: analysisResult.clauses[0].id,
              title: analysisResult.clauses[0].title,
              textLength: analysisResult.clauses[0].text.length,
              risk: analysisResult.clauses[0].risk
            });
          }

          // Navigate to results page with structured data
          navigate('/analyse-ergebnisse', { 
            state: { 
              analysisResult,
              analysisOutput: outputText
            }
          });
          return;
        } catch (error) {
          console.error("=== PARSING ERROR ===");
          console.error("Error parsing clauses in UploadContract:", error);
          
          // Fallback: Navigate with raw text if parsing fails
          console.log("Using fallback: navigating with raw output text");
          navigate('/analyse-ergebnisse', { 
            state: { 
              analysisOutput: outputText
            }
          });
          
          toast({
            title: "Teilweise Analyse verfügbar",
            description: "Die Analyseergebnisse sind verfügbar, konnten aber nicht vollständig strukturiert werden.",
            variant: "default",
          });
          return;
        }
      }
      
      // Handle other response formats
      if (response.data.rawText) {
        console.log("=== RAW TEXT RESPONSE ===");
        console.log("Raw text length:", response.data.rawText.length);
        
        try {
          const analysisResult = parseClausesFromText(response.data.rawText);
          navigate('/analyse-ergebnisse', { 
            state: { 
              analysisResult,
              analysisOutput: response.data.rawText
            }
          });
          return;
        } catch (error) {
          console.error("Error parsing raw text:", error);
          navigate('/analyse-ergebnisse', { 
            state: { 
              analysisOutput: response.data.rawText
            }
          });
          return;
        }
      }
      
      // If no recognizable format, show error
      console.error("=== UNRECOGNIZED RESPONSE FORMAT ===");
      console.error("Response data:", response.data);
      toast({
        title: "Unbekanntes Antwortformat",
        description: "Die Antwort vom Server konnte nicht verarbeitet werden.",
        variant: "destructive",
      });
      
    } else {
      console.error("=== WEBHOOK ERROR ===");
      console.error("Error sending file to n8n:", response.error);
      toast({
        title: "Fehler bei der Verarbeitung",
        description: "Die Datei konnte nicht zur Analyse gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    }
  }, [sendToN8n, toast, navigate]);

  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Vertrag zur Analyse hochladen</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Laden Sie einen Vertrag im PDF-Format hoch, und unser KI-System analysiert ihn auf rechtliche Konformität nach Schweizer Recht.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-semibold text-legal-primary">PDF hochladen</h2>
          </div>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isSendingToN8n} />
        </div>
        
        {/* Add AnalysisSection to show progress during analysis */}
        <AnalysisSection 
          isAnalyzing={isSendingToN8n}
          webhookError={error}
          webhookResult={null}
          useRealAnalysis={true}
          onReset={resetError}
          getRemainingErrorTime={getRemainingErrorTime}
          canResetError={canResetError}
        />
        
        <div className="text-sm text-slate-500 text-center max-w-xl mx-auto">
          <p>Ihre Daten werden sicher verarbeitet und nach der Analyse automatisch gelöscht. 
          Vertraulichkeit ist garantiert.</p>
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default UploadContract;
