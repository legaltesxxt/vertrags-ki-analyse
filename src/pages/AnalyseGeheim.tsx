
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { FileText, AlertTriangle } from 'lucide-react';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import FileUpload from '@/components/FileUpload';
import AnalysisSection from '@/components/analysis/AnalysisSection';

const AnalyseGeheim = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { 
    sendToN8n, 
    isLoading: isSendingToN8n, 
    error, 
    resetError, 
    getRemainingErrorTime, 
    canResetError,
    getAnalysisElapsedTime
  } = useN8nWebhook();

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    
    console.log("=== FILE UPLOAD START ===");
    console.log("Selected file:", file.name, file.size, "bytes");
    
    const response = await sendToN8n(file);
    
    console.log("=== WEBHOOK RESPONSE RECEIVED ===");
    console.log("Response success:", response.success);
      
    if (response.success && response.analysisResult) {
      console.log("Analysis completed successfully in AnalyseGeheim");
      console.log("Analysis result:", response.analysisResult);
      console.log("Number of clauses:", response.analysisResult.clauses.length);

      // Navigate to results page with structured data
      navigate('/analyse-ergebnisse', { 
        state: { 
          analysisResult: response.analysisResult,
          analysisOutput: response.data
        }
      });
    } else {
      console.error("=== ANALYSIS FAILED ===");
      console.error("Error:", response.error);
      toast({
        title: "Fehler bei der Verarbeitung",
        description: response.error || "Die Datei konnte nicht zur Analyse gesendet werden.",
        variant: "destructive",
      });
    }
  }, [sendToN8n, toast, navigate]);

  return (
    <>
      <Helmet>
        <title>Analyse – Vertragsklar</title>
        <meta name="description" content="KI-Vertragsanalyse für Schweizer Miet- und Arbeitsverträge." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AnalysisLayout>
        <div className="max-w-3xl mx-auto">
          {/* Hinweis für zahlende Nutzer */}
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Hinweis: Diese Seite ist nur für zahlende Nutzer zugänglich.
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Direkter Zugriff ohne Zahlung ist nicht vorgesehen.
                </p>
              </div>
            </div>
          </div>
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
        
        <AnalysisSection 
          isAnalyzing={isSendingToN8n}
          webhookError={error}
          webhookResult={null}
          useRealAnalysis={true}
          onReset={resetError}
          getRemainingErrorTime={getRemainingErrorTime}
          canResetError={canResetError}
          getAnalysisElapsedTime={getAnalysisElapsedTime}
        />
        
        <div className="text-sm text-slate-500 text-center max-w-xl mx-auto">
          <p>Ihre Daten werden sicher verarbeitet und nach der Analyse automatisch gelöscht. 
          Vertraulichkeit ist garantiert.</p>
        </div>
        </div>
      </AnalysisLayout>
    </>
  );
};

export default AnalyseGeheim;
