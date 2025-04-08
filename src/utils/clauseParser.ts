
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("Verarbeite Text-Antwort vom Webhook");
  
  // Regex-Muster zum Erkennen von Klauseln
  const clauseRegex = /###\s*(\d+)\.\s*Klausel:\s*(.*?)\n\*\*Klauseltext:\*\*(.*?)\n\*\*Analyse:\*\*(.*?)(?:\n\*\*Gesetzliche Referenz:\*\*\s*\[(.*?)\]\((.*?)\))?(?:\n\*\*Empfehlung:\*\*)?(.*?)(?=\n---|\n###|$)/gs;
  
  // Regex-Muster für die allgemeine Risikoeinschätzung
  const riskAssessmentRegex = /Risikoeinschätzung:(.*?)(?:-\s*Handlungsempfehlung:|$)/s;
  
  // Regex-Muster für die Handlungsempfehlung
  const recommendationRegex = /-\s*Handlungsempfehlung:(.*?)$/s;
  
  const clauses: AnalysisResult['clauses'] = [];
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
}
