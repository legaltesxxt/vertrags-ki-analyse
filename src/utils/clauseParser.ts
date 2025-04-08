
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("Verarbeite Text-Antwort vom Webhook");
  
  // Regex-Muster zum Erkennen von Klauseln
  const clauseRegex = /###\s*Klausel\s*(\d+):\s*(.*?)\s*\n\*\*Klauseltext:\*\*\s*(.*?)\s*\n\n\*\*Analyse:\*\*\s*(.*?)\s*\n\n\*\*Risiko-Einstufung:\*\*\s*(.*?)\s*\n\n\*\*Gesetzliche Referenz:\*\*\s*(.*?)\s*\n\n\*\*Handlungsbedarf:\*\*\s*(.*?)(?=\n---|\n###|$)/gs;
  
  const clauses: AnalysisResult['clauses'] = [];
  let match;
  
  // Extrahieren der Klauseln
  while ((match = clauseRegex.exec(responseText)) !== null) {
    const id = match[1] || '';
    const title = match[2] ? match[2].trim() : '';
    const text = match[3] ? match[3].trim().replace(/^"|"$/g, '') : '';
    const analysis = match[4] ? match[4].trim() : '';
    const riskEvaluation = match[5] ? match[5].trim() : '';
    const lawReference = match[6] ? match[6].trim() : '';
    const recommendation = match[7] ? match[7].trim() : '';
    
    // Risiko basierend auf Risiko-Einstufung bestimmen
    let risk: 'niedrig' | 'mittel' | 'hoch' = 'niedrig';
    if (riskEvaluation.toLowerCase().includes('kritisch') || 
        riskEvaluation.toLowerCase().includes('hoch')) {
      risk = 'hoch';
    } else if (riskEvaluation.toLowerCase().includes('prüfen') || 
               riskEvaluation.toLowerCase().includes('mittel') ||
               riskEvaluation.toLowerCase().includes('beachten')) {
      risk = 'mittel';
    } else if (riskEvaluation.toLowerCase().includes('unbedenklich') ||
               riskEvaluation.toLowerCase().includes('niedrig')) {
      risk = 'niedrig';
    }
    
    // Gesetzliche Referenz extrahieren
    let lawReferenceText = '';
    let lawReferenceLink = '';
    
    // Versuchen, den Link und Text zu extrahieren
    const refMatches = lawReference.match(/\*\*(.*?):\*\*\s*(.*?)(?=\n|$)/gm);
    if (refMatches && refMatches.length > 0) {
      lawReferenceText = lawReference;
    }
    
    clauses.push({
      id,
      title,
      text,
      risk,
      analysis,
      lawReference: {
        text: lawReferenceText,
        link: lawReferenceLink
      },
      recommendation
    });
  }
  
  // Gesamtrisiko berechnen basierend auf der Anzahl der hochriskanten Klauseln
  let overallRisk: 'niedrig' | 'mittel' | 'hoch' = 'niedrig';
  const riskCounts = {
    hoch: clauses.filter(c => c.risk === 'hoch').length,
    mittel: clauses.filter(c => c.risk === 'mittel').length,
    niedrig: clauses.filter(c => c.risk === 'niedrig').length
  };
  
  if (riskCounts.hoch > 0) {
    overallRisk = 'hoch';
  } else if (riskCounts.mittel > 0) {
    overallRisk = 'mittel';
  }
  
  // Zusammenfassung erstellen basierend auf der Analyse
  const summary = `Der Vertrag enthält ${clauses.length} geprüfte Klauseln. 
    ${riskCounts.niedrig} Klauseln sind unbedenklich, 
    ${riskCounts.mittel} Klauseln sind zu prüfen und 
    ${riskCounts.hoch} Klauseln sind kritisch zu betrachten. 
    ${overallRisk === 'niedrig' ? 'Der Vertrag ist insgesamt unbedenklich.' : 
      overallRisk === 'mittel' ? 'Der Vertrag enthält einige Punkte, die geprüft werden sollten.' : 
      'Der Vertrag enthält kritische Punkte, die überarbeitet werden sollten.'}`;
  
  return {
    clauses,
    overallRisk,
    summary
  };
}
