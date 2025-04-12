
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("Verarbeite Text-Antwort vom Webhook");
  
  // Überprüfen, ob es sich um eine leere oder ungültige Antwort handelt
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }
  
  // Regex-Muster zum Erkennen von Klauseln
  // Unterstützt verschiedene Formate der Antwort
  const clauseRegex = /###\s*(?:Klausel\s*)?(\d+)(?:\.|\:)?\s*(?:Klausel\:)?\s*(.*?)(?:\n|\r\n)\s*\*\*Klauseltext\:\*\*\s*(.*?)(?:\n|\r\n)\s*\*\*Analyse\:\*\*\s*(.*?)(?:\n\*\*(?:Risiko-Einstufung|Risiko)\:\*\*\s*(.*?))?(?:\n\*\*Gesetzliche Referenz\:\*\*\s*(?:\[(.*?)\]\((.*?)\)|(.*?)))?(?:\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)\:\*\*)?(.*?)(?=\n---|\n###|$)/gs;
  
  // Regex-Muster für die allgemeine Risikoeinschätzung
  const riskAssessmentRegex = /(?:Risikoeinschätzung|Gesamtrisikoeinschätzung)\:(.*?)(?:-\s*Handlungsempfehlung:|$)/s;
  
  // Regex-Muster für die Handlungsempfehlung
  const recommendationRegex = /-\s*(?:Handlungsempfehlung|Empfehlung)\:(.*?)$/s;
  
  const clauses: AnalysisResult['clauses'] = [];
  let match;
  
  // Extrahieren der Klauseln
  while ((match = clauseRegex.exec(responseText)) !== null) {
    const id = match[1] || '';
    const title = match[2] ? match[2].trim() : '';
    const text = match[3] ? match[3].trim() : '';
    const analysis = match[4] ? match[4].trim() : '';
    
    // Direkte Risiko-Einstufung aus dem Text extrahieren, wenn vorhanden
    let extractedRisk = match[5] ? match[5].trim() : '';
    
    const lawRefText = match[6] || match[8] || '';
    const lawRefLink = match[7] || '';
    const recommendation = match[9] ? match[9].trim() : '';
    
    // Risiko basierend auf expliziter Angabe oder Inhalt bestimmen
    let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
    
    if (extractedRisk) {
      if (extractedRisk.toLowerCase().includes('unbedenklich') || 
          extractedRisk.toLowerCase().includes('rechtskonform')) {
        risk = 'Rechtskonform';
      } else if (extractedRisk.toLowerCase().includes('kritisch zu prüfen') || 
                extractedRisk.toLowerCase().includes('zu beachten') ||
                extractedRisk.toLowerCase().includes('rechtlich fraglich')) {
        risk = 'Rechtlich fraglich';
      } else if (extractedRisk.toLowerCase().includes('problematisch') || 
                extractedRisk.toLowerCase().includes('bedenklich') ||
                extractedRisk.toLowerCase().includes('rechtlich unzulässig')) {
        risk = 'Rechtlich unzulässig';
      } else if (extractedRisk.toLowerCase().includes('niedrig') || 
                extractedRisk.toLowerCase().includes('gering')) {
        risk = 'niedrig';  // Fallback für alte Formate
      } else if (extractedRisk.toLowerCase().includes('mittel')) {
        risk = 'mittel';   // Fallback für alte Formate
      } else if (extractedRisk.toLowerCase().includes('hoch')) {
        risk = 'hoch';     // Fallback für alte Formate
      } else {
        // Fallback zur Inhaltsanalyse
        risk = mapRiskLevel(getRiskFromAnalysisText(analysis));
      }
    } else {
      // Fallback zur Inhaltsanalyse
      risk = mapRiskLevel(getRiskFromAnalysisText(analysis));
    }
    
    clauses.push({
      id,
      title,
      text,
      risk,
      analysis,
      lawReference: {
        text: lawRefText.trim(),
        link: lawRefLink.trim()
      },
      recommendation
    });
  }
  
  // Falls keine Klauseln gefunden wurden, versuche JSON zu parsen
  if (clauses.length === 0) {
    try {
      // Versuchen ob responseText ein JSON Array mit einem output Feld ist
      const jsonResponse = JSON.parse(responseText);
      if (Array.isArray(jsonResponse) && jsonResponse[0]?.output) {
        return parseClausesFromText(jsonResponse[0].output);
      }
      throw new Error("Keine Klauseln gefunden und JSON Format nicht erkannt");
    } catch (e) {
      throw new Error("Die Antwort konnte nicht als Vertragsanalyse erkannt werden");
    }
  }
  
  // Extrahieren der Risikoeinschätzung
  const riskMatch = riskAssessmentRegex.exec(responseText);
  const riskText = riskMatch ? riskMatch[1].trim() : '';
  
  // Extrahieren der Handlungsempfehlung
  const recommendationMatch = recommendationRegex.exec(responseText);
  const recommendationText = recommendationMatch ? recommendationMatch[1].trim() : '';
  
  // Gesamtrisiko bestimmen
  let overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  
  // Zähle die Klauseln nach Risikostufe für die Gesamtbewertung
  const highRiskCount = clauses.filter(c => 
    c.risk === 'hoch' || c.risk === 'Rechtlich unzulässig').length;
  const mediumRiskCount = clauses.filter(c => 
    c.risk === 'mittel' || c.risk === 'Rechtlich fraglich').length;
  
  // Zuerst basierend auf dem Text der Risikoeinschätzung
  if (riskText.toLowerCase().includes('problematisch') || 
      riskText.toLowerCase().includes('nicht vollständig konform') ||
      riskText.toLowerCase().includes('hohe')) {
    overallRisk = 'Rechtlich unzulässig';
  } else if (riskText.toLowerCase().includes('teilweise') || 
             riskText.toLowerCase().includes('mittlere') ||
             riskText.toLowerCase().includes('möglicherweise') ||
             riskText.toLowerCase().includes('fraglich')) {
    overallRisk = 'Rechtlich fraglich';
  } else if (riskText.toLowerCase().includes('konform') ||
             riskText.toLowerCase().includes('unbedenklich')) {
    overallRisk = 'Rechtskonform';
  } else if (highRiskCount > 0) {
    overallRisk = 'Rechtlich unzulässig';
  } else if (mediumRiskCount > 0) {
    overallRisk = 'Rechtlich fraglich';
  } else {
    overallRisk = 'Rechtskonform';
  }
  
  // Zusammenfassung erstellen aus Risiko und Handlungsempfehlung
  const summary = riskText || recommendationText ? 
    `${riskText} ${recommendationText}`.trim() : 
    `Vertrag mit ${clauses.length} analysierten Klauseln. Gesamtrisikobewertung: ${overallRisk}.`;
  
  return {
    clauses,
    overallRisk,
    summary
  };
}

/**
 * Hilfsfunktion zur Bestimmung des Risikos anhand des Analysetextes
 */
function getRiskFromAnalysisText(analysisText: string): 'niedrig' | 'mittel' | 'hoch' {
  const text = analysisText.toLowerCase();
  
  if (text.includes('problematisch') || 
      text.includes('anfechtbar') || 
      text.includes('nicht konform') ||
      text.includes('rechtswidrig') || 
      text.includes('unzulässig')) {
    return 'hoch';
  } else if (text.includes('beachten') || 
             text.includes('könnte') || 
             text.includes('möglicherweise') ||
             text.includes('zu prüfen') ||
             text.includes('unklar') ||
             text.includes('fraglich')) {
    return 'mittel';
  }
  
  return 'niedrig';
}

/**
 * Wandelt das alte Risikoformat in das neue Format um
 */
function mapRiskLevel(risk: 'niedrig' | 'mittel' | 'hoch'): 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig' {
  switch (risk) {
    case 'niedrig':
      return 'Rechtskonform';
    case 'mittel':
      return 'Rechtlich fraglich';
    case 'hoch':
      return 'Rechtlich unzulässig';
  }
}
