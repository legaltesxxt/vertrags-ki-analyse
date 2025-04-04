
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface AnalysisClause {
  id: string;
  title: string;
  text: string;
  risk: 'niedrig' | 'mittel' | 'hoch';
  analysis: string;
  lawReference: {
    text: string;
    link: string;
  };
  recommendation: string;
}

export interface AnalysisResult {
  clauses: AnalysisClause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch';
  summary: string;
}

interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  analysisResult?: AnalysisResult;
}

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  // Die konfigurierte n8n Webhook URL
  const webhookUrl = "https://vertrags.app.n8n.cloud/webhook-test/Vertrags-analyse";

  const parseClausesFromText = (responseText: string): AnalysisResult => {
    console.log("Verarbeite Text-Antwort vom Webhook");
    
    // Regex-Muster zum Erkennen von Klauseln
    const clauseRegex = /###\s*(\d+)\.\s*Klausel:\s*(.*?)\n\*\*Klauseltext:\*\*(.*?)\n\*\*Analyse:\*\*(.*?)(?:\n\*\*Gesetzliche Referenz:\*\*\s*\[(.*?)\]\((.*?)\))?(?:\n\*\*Empfehlung:\*\*)?(.*?)(?=\n---|\n###|$)/gs;
    
    // Regex-Muster für die allgemeine Risikoeinschätzung
    const riskAssessmentRegex = /Risikoeinschätzung:(.*?)(?:-\s*Handlungsempfehlung:|$)/s;
    
    // Regex-Muster für die Handlungsempfehlung
    const recommendationRegex = /-\s*Handlungsempfehlung:(.*?)$/s;
    
    const clauses: AnalysisClause[] = [];
    let match;
    
    // Extrahieren der Klauseln
    while ((match = clauseRegex.exec(responseText)) !== null) {
      const id = match[1] || '';
      const title = match[2] ? match[2].trim() : '';
      const text = match[3] ? match[3].trim() : '';
      const analysis = match[4] ? match[4].trim() : '';
      const lawRefText = match[5] ? match[5].trim() : '';
      const lawRefLink = match[6] ? match[6].trim() : '';
      const recommendation = match[7] ? match[7].trim() : '';
      
      // Risiko basierend auf Inhalt bestimmen
      let risk: 'niedrig' | 'mittel' | 'hoch' = 'niedrig';
      if (analysis.toLowerCase().includes('problematisch') || 
          analysis.toLowerCase().includes('anfechtbar') || 
          analysis.toLowerCase().includes('nicht konform')) {
        risk = 'hoch';
      } else if (analysis.toLowerCase().includes('beachten') || 
                 analysis.toLowerCase().includes('könnte') || 
                 analysis.toLowerCase().includes('möglicherweise')) {
        risk = 'mittel';
      }
      
      clauses.push({
        id,
        title,
        text,
        risk,
        analysis,
        lawReference: {
          text: lawRefText,
          link: lawRefLink
        },
        recommendation
      });
    }
    
    // Extrahieren der Risikoeinschätzung
    const riskMatch = riskAssessmentRegex.exec(responseText);
    const riskText = riskMatch ? riskMatch[1].trim() : '';
    
    // Extrahieren der Handlungsempfehlung
    const recommendationMatch = recommendationRegex.exec(responseText);
    const recommendationText = recommendationMatch ? recommendationMatch[1].trim() : '';
    
    // Gesamtrisiko bestimmen
    let overallRisk: 'niedrig' | 'mittel' | 'hoch' = 'niedrig';
    if (riskText.toLowerCase().includes('problematisch') || 
        riskText.toLowerCase().includes('nicht vollständig konform') ||
        riskText.toLowerCase().includes('hohe')) {
      overallRisk = 'hoch';
    } else if (riskText.toLowerCase().includes('teilweise') || 
              riskText.toLowerCase().includes('mittlere') ||
              riskText.toLowerCase().includes('möglicherweise')) {
      overallRisk = 'mittel';
    }
    
    // Zusammenfassung erstellen aus Risiko und Handlungsempfehlung
    const summary = `${riskText} ${recommendationText}`.trim();
    
    return {
      clauses,
      overallRisk,
      summary
    };
  };

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      console.error("Webhook URL ist nicht konfiguriert");
      return { success: false, error: "Webhook nicht konfiguriert" };
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Senden von ${file.name} an n8n Webhook: ${webhookUrl}`);
      
      // Hier wird die tatsächliche API-Anfrage an n8n gesendet
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        // Bei Bedarf können hier weitere Header hinzugefügt werden
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      // Prüfe, ob die Antwort JSON oder Text ist
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        // Wenn es JSON ist, parsen wir es als JSON
        data = await response.json();
        console.log("JSON-Antwort vom Webhook erhalten:", data);
        
        // Wenn eine Analyse-Antwort vorhanden ist, verarbeiten wir diese
        if (data.analysisResult) {
          setAnalysisResult(data.analysisResult);
          return { 
            success: true, 
            data, 
            analysisResult: data.analysisResult 
          };
        }
      } else {
        // Andernfalls versuchen wir, die Antwort als Text zu behandeln
        const responseText = await response.text();
        console.log("Text-Antwort vom Webhook erhalten:", responseText);
        
        // Text-Antwort in ein strukturiertes Format umwandeln
        if (responseText) {
          try {
            const parsedResult = parseClausesFromText(responseText);
            console.log("Geparste Analyse-Ergebnisse:", parsedResult);
            setAnalysisResult(parsedResult);
            return {
              success: true,
              data: { rawText: responseText },
              analysisResult: parsedResult
            };
          } catch (parseError) {
            console.error("Fehler beim Parsen der Webhook-Antwort:", parseError);
            return { success: false, error: "Konnte die Antwort nicht verarbeiten" };
          }
        }
      }
      
      // Fallback, wenn keine Ergebnisse geparst werden konnten
      return { success: true, data: data || {} };
      
    } catch (error) {
      console.error("Fehler beim Senden zum n8n Webhook:", error);
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendToN8n, isLoading, analysisResult };
}
