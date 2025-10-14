import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { CheckCircle, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FileUpload from '@/components/FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useN8nWebhook } from '@/hooks/useN8nWebhook';
import { useToast } from '@/hooks/use-toast';
import AnalysisSection from '@/components/analysis/AnalysisSection';

const AnalyseFreischalten = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
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

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast({
          title: 'Fehler',
          description: 'Keine Zahlungssitzung gefunden.',
          variant: 'destructive',
        });
        navigate('/preise');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId },
        });

        if (error) throw error;

        if (data.success) {
          setPaymentVerified(true);
        } else {
          toast({
            title: 'Zahlung fehlgeschlagen',
            description: 'Die Zahlung konnte nicht bestätigt werden.',
            variant: 'destructive',
          });
          navigate('/preise');
        }
      } catch (error) {
        console.error('Fehler bei der Zahlungsverifizierung:', error);
        toast({
          title: 'Fehler',
          description: 'Die Zahlung konnte nicht überprüft werden.',
          variant: 'destructive',
        });
        navigate('/preise');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, toast]);

  const handleFileSelected = useCallback(async (file: File) => {
    setSelectedFile(file);
    
    const response = await sendToN8n(file);
      
    if (response.success && response.analysisResult) {
      console.log("Analysis completed successfully, navigating to results...");
      
      navigate('/analyse-ergebnisse', { 
        state: { 
          analysisResult: response.analysisResult,
          analysisOutput: response.data,
          isPaidAnalysis: true,
        }
      });
    } else {
      console.error("Analysis failed:", response.error);
      toast({
        title: "Fehler bei der Verarbeitung",
        description: response.error || "Die Datei konnte nicht zur Analyse gesendet werden.",
        variant: "destructive",
      });
    }
  }, [sendToN8n, toast, navigate]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    resetError();
  }, [resetError]);

  if (verifying) {
    return (
      <AnalysisLayout>
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legal-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Zahlung wird überprüft...</p>
        </div>
      </AnalysisLayout>
    );
  }

  if (!paymentVerified) {
    return null;
  }

  return (
    <AnalysisLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Zahlung erfolgreich!</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Ihre Zahlung wurde erfolgreich verarbeitet. Sie können jetzt Ihren Vertrag hochladen und analysieren lassen.
          </p>
        </div>

        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <Download className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">Wichtiger Hinweis</AlertTitle>
          <AlertDescription className="text-amber-800">
            Ihre Analyse wird nicht gespeichert. Bitte laden Sie das PDF nach der Analyse herunter, um Ihre Ergebnisse zu sichern.
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <h2 className="text-2xl font-semibold text-legal-primary mb-6">Vertrag hochladen</h2>
          <FileUpload onFileSelected={handleFileSelected} isAnalyzing={isSendingToN8n} />
        </div>

        <AnalysisSection
          isAnalyzing={isSendingToN8n}
          webhookError={webhookError}
          webhookResult={webhookResult}
          useRealAnalysis={true}
          onReset={handleReset}
          getRemainingErrorTime={getRemainingErrorTime}
          canResetError={canResetError}
          getAnalysisElapsedTime={getAnalysisElapsedTime}
        />
      </div>
    </AnalysisLayout>
  );
};

export default AnalyseFreischalten;
