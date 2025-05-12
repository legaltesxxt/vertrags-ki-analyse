
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

  // Verbessertes Regex-Muster zum Erkennen von Klauseln mit flexibler Formatierung
  const clauseRegex = /###\s*(?:Klausel\s*)?(\d+)(?:\.|\:|\s*-)?[^\n]*\n(?:\s*\n)?(?:\*\*Klauseltext\:\*\*|\*\*Text\:\*\*|\*\*Klauseltext\*\*)\s*([\s\S]*?)(?=\n\*\*(?:Analyse|Bewertung)|\n\n\*\*(?:Analyse|Bewertung)|\n\*\*)\s*(?:\*\*(?:Analyse|Bewertung)\:\*\*|\*\*(?:Analyse|Bewertung)\*\*)\s*([\s\S]*?)(?=\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\n\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\n\*\*)(?:\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\:\*\*|\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\*\*)\s*([\s\S]*?)(?=\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\n\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\n\*\*)(?:\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\:\*\*|\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\*\*)\s*(?:\[(.*?)\]\((.*?)\)|([\s\S]*?))(?=\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)|\n\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)|\n---|\n\n---|\n###|\n\n###|$)(?:\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)\:\*\*|\n\*\*(?:Handlungsbedarf|Empfehlung|Handlungsempfehlung)\*\*)?(?:\s*([\s\S]*?))?(?=\n###|\n\n###|\n---|\n\n---|\n\*\*|\n\n\*\*|$)/g;
  
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

    console.log(`Extrahierte Daten für Klausel ${id}:`, {
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      analysis: analysis.substring(0, 50) + (analysis.length > 50 ? '...' : ''),
      risk: extractedRisk,
      lawRef: lawRefText.substring(0, 50) + (lawRefText.length > 50 ? '...' : ''),
      recommendation: recommendation.substring(0, 50) + (recommendation.length > 50 ? '...' : '')
    });

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
    console.log("Keine Klauseln gefunden, versuche alternativen Parsing-Ansatz mit einfacherer Teilung");
    
    // Alternativer Ansatz mit einfacherem Split bei den Überschriften
    try {
      const simpleSections = responseText.split(/###\s+/).filter(Boolean);
      console.log(`Einfaches Splitting ergab ${simpleSections.length} Abschnitte`);
      
      if (simpleSections.length > 0) {
        simpleSections.forEach((section, index) => {
          const lines = section.split('\n');
          const title = lines[0].trim();
          
          // Vereinfachtes Extrahieren mit flexibleren Patterns
          const textMatch = section.match(/\*\*(?:Klauseltext|Text)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*|$)/m);
          const analysisMatch = section.match(/\*\*(?:Analyse|Bewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*|$)/m);
          const riskMatch = section.match(/\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*|$)/m);
          const lawRefMatch = section.match(/\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*|$)/m);
          const recommendationMatch = section.match(/\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*|$|[\n\s]*$)/m);
          
          const text = textMatch ? textMatch[1].trim() : '';
          const analysis = analysisMatch ? analysisMatch[1].trim() : '';
          const extractedRisk = riskMatch ? riskMatch[1].trim() : 'Rechtskonform';
          const lawRefText = lawRefMatch ? lawRefMatch[1].trim() : '';
          const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';
          
          // Risiko-Mapping wie zuvor
          let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig' = 'Rechtskonform';
          if (extractedRisk.toLowerCase().includes('unzulässig')) {
            risk = 'Rechtlich unzulässig';
          } else if (extractedRisk.toLowerCase().includes('fraglich')) {
            risk = 'Rechtlich fraglich';
          }
          
          clauses.push({
            id: `clause-${index + 1}`,
            title,
            text,
            analysis,
            risk,
            lawReference: {
              text: lawRefText,
              link: ''
            },
            recommendation
          });
          
          console.log(`Alternative Parsing: Klausel ${index + 1} erkannt:`, {
            title,
            hasText: !!text,
            hasAnalysis: !!analysis,
            risk,
            hasRecommendation: !!recommendation,
            recommendation: recommendation.substring(0, 50) + (recommendation.length > 50 ? '...' : '')
          });
        });
      }
    } catch (e) {
      console.error("Alternativer Parsing-Ansatz fehlgeschlagen:", e);
    }
    
    // Wenn immer noch keine Klauseln gefunden wurden, versuche JSON-Parsing als letzten Ausweg
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
