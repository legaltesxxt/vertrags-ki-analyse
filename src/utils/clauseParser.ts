
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("=== CLAUSE PARSER START ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 300));
  
  // Überprüfen, ob es sich um eine leere oder ungültige Antwort handelt
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }

  const clauses: AnalysisResult['clauses'] = [];
  
  // Verbesserte Klausel-Trennung: Split by ### followed by "Klausel" and then by ---
  // First, let's split by --- to get individual clause sections
  const sections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    return trimmed.length > 0 && trimmed.includes('###');
  });
  
  console.log(`Gefundene Abschnitte nach --- Trennung: ${sections.length}`);
  
  sections.forEach((section, index) => {
    console.log(`\n=== VERARBEITE ABSCHNITT ${index + 1} ===`);
    console.log(`Abschnitts-Preview: ${section.substring(0, 200)}...`);
    
    // Extrahiere den Titel nach ###
    const titleMatch = section.match(/###\s+(.+?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
    
    console.log(`Gefundener Titel: "${title}"`);
    
    // VERBESSERTE REGEX-MUSTER für deutsches Format
    
    // 1. Klauseltext-Extraktion - zwischen **Klauseltext** und **Analyse**
    const textPattern = /\*\*Klauseltext\*\*\s*\n([\s\S]*?)(?=\n\*\*Analyse\*\*)/;
    const textMatch = section.match(textPattern);
    
    // 2. Analyse-Extraktion - zwischen **Analyse** und **Risiko-Einstufung**
    const analysisPattern = /\*\*Analyse\*\*\s*\n([\s\S]*?)(?=\n\*\*Risiko-Einstufung\*\*)/;
    const analysisMatch = section.match(analysisPattern);
    
    // 3. Risiko-Extraktion - zwischen **Risiko-Einstufung** und **Gesetzliche Referenz**
    const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n([\s\S]*?)(?=\n\*\*Gesetzliche Referenz\*\*)/;
    const riskMatch = section.match(riskPattern);
    
    // 4. Gesetzliche Referenz-Extraktion - zwischen **Gesetzliche Referenz** und **Empfehlung**
    const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n([\s\S]*?)(?=\n\*\*Empfehlung\*\*)/;
    const lawRefMatch = section.match(lawRefPattern);
    
    // 5. Empfehlung-Extraktion - nach **Empfehlung** bis Ende des Abschnitts
    const recommendationPattern = /\*\*Empfehlung\*\*\s*\n([\s\S]*?)(?=\n---|\s*$)/;
    const recommendationMatch = section.match(recommendationPattern);
    
    // Detailliertes Logging für Debugging
    console.log(`Klausel ${index + 1} - Extraktionsergebnisse:`, {
      title,
      textExtracted: !!textMatch,
      textLength: textMatch ? textMatch[1].trim().length : 0,
      textPreview: textMatch ? `${textMatch[1].trim().substring(0, 100)}${textMatch[1].trim().length > 100 ? '...' : ''}` : 'Nicht gefunden',
      analysisExtracted: !!analysisMatch,
      analysisLength: analysisMatch ? analysisMatch[1].trim().length : 0,
      riskExtracted: !!riskMatch,
      riskValue: riskMatch ? riskMatch[1].trim() : 'Nicht gefunden',
      lawRefExtracted: !!lawRefMatch,
      lawRefLength: lawRefMatch ? lawRefMatch[1].trim().length : 0,
      lawRefPreview: lawRefMatch ? `${lawRefMatch[1].trim().substring(0, 100)}${lawRefMatch[1].trim().length > 100 ? '...' : ''}` : 'Nicht gefunden',
      recommendationExtracted: !!recommendationMatch,
      recommendationLength: recommendationMatch ? recommendationMatch[1].trim().length : 0
    });
    
    // Extrahierte Werte verarbeiten
    const text = textMatch ? textMatch[1].trim() : '';
    const analysis = analysisMatch ? analysisMatch[1].trim() : '';
    const extractedRisk = riskMatch ? riskMatch[1].trim() : 'Rechtskonform';
    const lawRefText = lawRefMatch ? lawRefMatch[1].trim() : '';
    const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';
    
    // VERBESSERTE Risiko-Klassifizierung für exakte Übereinstimmung
    let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
    
    const riskLower = extractedRisk.toLowerCase().trim();
    console.log(`Risiko-Text (lowercase): "${riskLower}"`);
    
    if (riskLower === 'rechtlich unzulässig' || riskLower.includes('unzulässig')) {
      risk = 'Rechtlich unzulässig';
    } else if (riskLower === 'rechtlich fraglich' || riskLower.includes('fraglich')) {
      risk = 'Rechtlich fraglich';
    } else if (riskLower === 'rechtskonform' || riskLower.includes('konform')) {
      risk = 'Rechtskonform';
    } else if (riskLower === 'hoch' || riskLower.includes('hohes risiko')) {
      risk = 'hoch';
    } else if (riskLower === 'mittel' || riskLower.includes('mittleres risiko')) {
      risk = 'mittel';
    } else if (riskLower === 'niedrig' || riskLower.includes('niedriges risiko')) {
      risk = 'niedrig';
    } else {
      // Fallback auf Rechtskonform
      risk = 'Rechtskonform';
      console.log(`Unbekanntes Risiko-Format: "${extractedRisk}", verwende Fallback: ${risk}`);
    }
    
    console.log(`Finales Risiko: ${risk}`);
    
    // Klausel erstellen, wenn mindestens Titel oder Text vorhanden ist
    if (title && (text || analysis)) {
      const clause = {
        id: `clause-${index + 1}`,
        title: title || `Klausel ${index + 1}`,
        text,
        analysis,
        risk,
        lawReference: {
          text: lawRefText,
          link: ''
        },
        recommendation
      };
      
      clauses.push(clause);
      console.log(`Klausel ${index + 1} erfolgreich erstellt:`, {
        id: clause.id,
        title: clause.title,
        textLength: clause.text.length,
        analysisLength: clause.analysis.length,
        risk: clause.risk,
        lawRefLength: clause.lawReference.text.length,
        recommendationLength: clause.recommendation.length
      });
    } else {
      console.log(`Klausel ${index + 1} übersprungen - unvollständige Daten`);
    }
  });
  
  console.log(`\n=== PARSING ABGESCHLOSSEN ===`);
  console.log(`Erfolgreich ${clauses.length} Klauseln extrahiert.`);
  
  // Wenn keine Klauseln gefunden wurden, Fallback-Methode versuchen
  if (clauses.length === 0) {
    console.warn("Keine Klauseln mit Standard-Methode gefunden, versuche Fallback-Extraktion");
    
    try {
      // Einfache Regex für eine Struktur wie "### Klausel X"
      const fallbackSections = responseText.split(/###\s+/).filter(Boolean);
      
      fallbackSections.forEach((section, index) => {
        const lines = section.split('\n');
        const title = lines[0].trim();
        
        if (title) {
          clauses.push({
            id: `clause-${index + 1}`,
            title: title || `Klausel ${index + 1}`,
            text: section.length > title.length ? section.substring(title.length).trim() : '[Klauseltext konnte nicht extrahiert werden]',
            analysis: 'Automatische Analyse nicht verfügbar',
            risk: 'Rechtlich fraglich',
            lawReference: {
              text: 'Keine gesetzliche Referenz verfügbar',
              link: ''
            },
            recommendation: 'Manuelle Überprüfung empfohlen'
          });
        }
      });
      
      console.log(`Fallback-Extraktion: ${clauses.length} Klauseln gefunden.`);
    } catch (e) {
      console.error("Fallback-Klausel-Extraktion fehlgeschlagen:", e);
      throw new Error("Keine Klauseln konnten in der Antwort identifiziert werden");
    }
  }
  
  // Gesamtrisiko bestimmen
  const unzulassigCount = clauses.filter(c => 
    c.risk === 'Rechtlich unzulässig' || c.risk === 'hoch'
  ).length;
  const fraglichCount = clauses.filter(c => 
    c.risk === 'Rechtlich fraglich' || c.risk === 'mittel'
  ).length;
  
  let overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  
  if (unzulassigCount > 0) {
    overallRisk = 'Rechtlich unzulässig';
  } else if (fraglichCount > 0) {
    overallRisk = 'Rechtlich fraglich';
  } else {
    overallRisk = 'Rechtskonform';
  }

  // Zusammenfassung erstellen
  const summary = `${clauses.length} Klauseln analysiert. ${
    unzulassigCount > 0 ? `${unzulassigCount} rechtlich unzulässige Klauseln. ` : ''
  }${
    fraglichCount > 0 ? `${fraglichCount} rechtlich fragliche Klauseln. ` : ''
  }${
    unzulassigCount === 0 && fraglichCount === 0 ? 'Alle Klauseln sind rechtskonform. ' : ''
  }`;
  
  console.log(`\n=== FINAL RESULT ===`);
  console.log(`Gesamtrisiko: ${overallRisk}`);
  console.log(`Zusammenfassung: ${summary}`);
  console.log("=== CLAUSE PARSER END ===\n");

  return {
    clauses,
    overallRisk,
    summary
  };
}
