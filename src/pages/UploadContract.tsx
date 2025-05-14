
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import FileUpload from '@/components/FileUpload';
import AnalysisSection from '@/components/analysis/AnalysisSection';

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
    
    const response = await sendToN8n(file);
      
    if (response.success && response.data) {
      console.log("Webhook response received in UploadContract:", response.data);
      
      // Parse the response into structured analysis result
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
        const outputText = response.data[0].output;
        console.log("Raw output text to parse in UploadContract:", outputText);
        
        // Parse the markdown content into structured data
        const clauses = outputText.split('### ').filter(Boolean).map((clauseText, index) => {
          const title = clauseText.split('\n')[0].trim();
          
          // Improved regex patterns with better boundary conditions for full text extraction
          const textMatch = clauseText.match(/\*\*(?:Klauseltext|Text)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Analyse|Bewertung)|\n\n\*\*(?:Analyse|Bewertung)|\s*$)/m);
          const analysisMatch = clauseText.match(/\*\*(?:Analyse|Bewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\n\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\s*$)/m);
          const riskMatch = clauseText.match(/\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\n\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\s*$)/m);
          
          // Enhanced pattern specifically for law references
          const lawRefMatch = clauseText.match(/\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n---|\n\n---|\s*$)/m);
          
          // Improved recommendation matching
          const recommendationMatch = clauseText.match(/\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n---|\n\n---|\n###|\n\n###|\s*$)/m);
          
          // Enhanced debugging output
          console.log(`UploadContract - Clause ${index + 1} (${title}) extraction:`, {
            fullClauseTextLen: clauseText.length,
            fullClauseTextSample: clauseText.substring(0, 200) + "...",
            textExtracted: !!textMatch,
            textSample: textMatch ? textMatch[1].trim().substring(0, 100) + (textMatch[1].length > 100 ? "..." : "") : "Not found",
            textLength: textMatch ? textMatch[1].trim().length : 0,
            hasAnalysis: !!analysisMatch,
            hasRisk: !!riskMatch,
            hasLawRef: !!lawRefMatch,
            lawRefContent: lawRefMatch ? lawRefMatch[1].trim().substring(0, 100) + "..." : "Not found",
            lawRefIncludesQuotes: lawRefMatch ? (lawRefMatch[1].includes('"') || lawRefMatch[1].includes('„')) : false,
            hasRecommendation: !!recommendationMatch,
            recommendationText: recommendationMatch ? recommendationMatch[1].trim().substring(0, 50) + "..." : "Not found"
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
        
        console.log("Structured analysis result in UploadContract:", analysisResult);
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
