
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("Verarbeite Text-Antwort vom Webhook:", responseText);
  
  // Überprüfen, ob es sich um eine leere oder ungültige Antwort handelt
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }

  // Verbessertes Regex-Muster zum Erkennen von Klauseln
  // Unterstützt verschiedene Formate und ist flexibler bei Zeilenumbrüchen
  const clauseRegex = /###\s*(?:Klausel\s*)?(\d+)(?:\.|\:|\s*-)?[^\n]*\n(?:\s*\n)?(?:\*\*Klauseltext\:\*\*|\*\*Text\:\*\*)?\s*(.*?)(?:\n|\r\n)\s*(?:\*\*Analyse\:\*\*|\*\*Bewertung\:\*\*)\s*(.*?)(?:\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\:\*\*\s*(.*?))?(?:\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\:\*\*\s*(?:\[(.*?)\]\((.*?)\)|(.*?)))?(?:\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)\:\*\*)?\s*(.*?)(?=\n###|\n\n###|\n---|\n\n---|\n\*\*|\n\n\*\*|$)/gs;
  
  const clauses: AnalysisResult['clauses'] = [];
  let match;
  let clauseCount = 0;
  
  // Extrahieren der Klauseln mit verbesserter Fehlerbehandlung
  while ((match = clauseRegex.exec(responseText)) !== null) {
    clauseCount++;
    console.log(`Verarbeite Klausel ${clauseCount}:`, match[0]);
    
    const id = match[1] || String(clauseCount);
    const text = match[2] ? match[2].trim() : '';
    const analysis = match[3] ? match[3].trim() : '';
    const extractedRisk = match[4] ? match[4].trim() : '';
    const lawRefText = match[5] || match[7] || '';
    const lawRefLink = match[6] || '';
    const recommendation = match[8] ? match[8].trim() : '';

    // Verbesserte Risiko-Mapping-Logik
    let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
    
    if (extractedRisk) {
      if (extractedRisk.toLowerCase().includes('rechtskonform') || 
          extractedRisk.toLowerCase().includes('unbedenklich') || 
          extractedRisk.toLowerCase().includes('zulässig')) {
        risk = 'Rechtskonform';
      } else if (extractedRisk.toLowerCase().includes('fraglich') || 
                 extractedRisk.toLowerCase().includes('zu prüfen') || 
                 extractedRisk.toLowerCase().includes('mittel')) {
        risk = 'Rechtlich fraglich';
      } else {
        risk = 'Rechtlich unzulässig';
      }
    } else {
      // Fallback zur Text-Analyse
      if (analysis.toLowerCase().includes('unzulässig') || 
          analysis.toLowerCase().includes('rechtswidrig')) {
        risk = 'Rechtlich unzulässig';
      } else if (analysis.toLowerCase().includes('fraglich') || 
                 analysis.toLowerCase().includes('zu prüfen')) {
        risk = 'Rechtlich fraglich';
      } else {
        risk = 'Rechtskonform';
      }
    }

    console.log(`Erkannte Klausel ${id}:`, {
      text: text.substring(0, 100) + '...',
      risk,
      hasAnalysis: !!analysis,
      hasLawRef: !!lawRefText,
      hasRecommendation: !!recommendation
    });

    clauses.push({
      id,
      title: `Klausel ${id}`,
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

  console.log(`Insgesamt ${clauses.length} Klauseln erkannt`);

  if (clauses.length === 0) {
    console.log("Keine Klauseln gefunden, versuche JSON-Parsing");
    try {
      const jsonResponse = JSON.parse(responseText);
      if (Array.isArray(jsonResponse) && jsonResponse[0]?.output) {
        return parseClausesFromText(jsonResponse[0].output);
      }
      throw new Error("Keine Klauseln gefunden und JSON Format nicht erkannt");
    } catch (e) {
      console.error("JSON-Parsing fehlgeschlagen:", e);
      throw new Error("Die Antwort konnte nicht als Vertragsanalyse erkannt werden");
    }
  }

  // Gesamtrisiko bestimmen
  let overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  
  const unzulassigCount = clauses.filter(c => c.risk === 'Rechtlich unzulässig').length;
  const fraglichCount = clauses.filter(c => c.risk === 'Rechtlich fraglich').length;
  
  if (unzulassigCount > 0) {
    overallRisk = 'Rechtlich unzulässig';
  } else if (fraglichCount > 0) {
    overallRisk = 'Rechtlich fraglich';
  } else {
    overallRisk = 'Rechtskonform';
  }

  console.log(`Gesamtrisiko bestimmt als: ${overallRisk}`);

  // Zusammenfassung erstellen
  const summary = `${clauses.length} Klauseln analysiert. ${
    unzulassigCount > 0 ? `${unzulassigCount} rechtlich unzulässige Klauseln. ` : ''
  }${
    fraglichCount > 0 ? `${fraglichCount} rechtlich fragliche Klauseln. ` : ''
  }${
    unzulassigCount === 0 && fraglichCount === 0 ? 'Alle Klauseln sind rechtskonform. ' : ''
  }`;

  return {
    clauses,
    overallRisk,
    summary
  };
}

