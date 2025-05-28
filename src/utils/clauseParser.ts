
import { AnalysisResult } from "../types/analysisTypes";

/**
 * Parst eine Textantwort vom Webhook in ein strukturiertes AnalysisResult-Objekt
 * Optimiert für das deutsche Format mit ### Überschriften und **Abschnitt** Markierungen
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
  
  // OPTIMIERTE Klausel-Trennung speziell für das deutsche Format
  // Trennung zwischen Klauseln durch "---" zwischen Abschnitten
  const sections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    return trimmed.length > 20 && trimmed.includes('###'); // Mindestlänge für gültige Klauseln
  });
  
  console.log(`Gefundene Abschnitte nach --- Trennung: ${sections.length}`);
  
  sections.forEach((section, index) => {
    console.log(`\n=== VERARBEITE ABSCHNITT ${index + 1} ===`);
    console.log(`Abschnitts-Preview: ${section.substring(0, 200)}...`);
    
    // Extrahiere den Titel nach ### (kann auch mit Leerzeichen sein)
    const titleMatch = section.match(/###\s*(.+?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
    
    console.log(`Gefundener Titel: "${title}"`);
    
    // PRÄZISE REGEX-MUSTER für exaktes deutsches Format aus dem JSON
    
    // 1. Klauseltext-Extraktion - zwischen **Klauseltext** und **Analyse**
    const textPattern = /\*\*Klauseltext\*\*\s*\n([\s\S]*?)(?=\n\*\*Analyse\*\*)/i;
    const textMatch = section.match(textPattern);
    
    // 2. Analyse-Extraktion - zwischen **Analyse** und **Risiko-Einstufung**
    const analysisPattern = /\*\*Analyse\*\*\s*\n([\s\S]*?)(?=\n\*\*Risiko-Einstufung\*\*)/i;
    const analysisMatch = section.match(analysisPattern);
    
    // 3. Risiko-Extraktion - zwischen **Risiko-Einstufung** und **Gesetzliche Referenz**
    const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n([\s\S]*?)(?=\n\*\*Gesetzliche Referenz\*\*)/i;
    const riskMatch = section.match(riskPattern);
    
    // 4. Gesetzliche Referenz-Extraktion - zwischen **Gesetzliche Referenz** und **Empfehlung**
    const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n([\s\S]*?)(?=\n\*\*Empfehlung\*\*)/i;
    const lawRefMatch = section.match(lawRefPattern);
    
    // 5. Empfehlung-Extraktion - nach **Empfehlung** bis Ende oder nächster ---
    const recommendationPattern = /\*\*Empfehlung\*\*\s*\n([\s\S]*?)(?=\n---|\s*$)/i;
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
      recommendationExtracted: !!recommendationMatch,
      recommendationLength: recommendationMatch ? recommendationMatch[1].trim().length : 0
    });
    
    // Extrahierte Werte verarbeiten und bereinigen
    const text = textMatch ? textMatch[1].trim() : '';
    const analysis = analysisMatch ? analysisMatch[1].trim() : '';
    const extractedRisk = riskMatch ? riskMatch[1].trim() : 'Rechtskonform';
    const lawRefText = lawRefMatch ? lawRefMatch[1].trim() : '';
    const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';
    
    // EXAKTE Risiko-Klassifizierung basierend auf deutschem Format
    let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
    
    const riskLower = extractedRisk.toLowerCase().trim();
    console.log(`Risiko-Text (lowercase): "${riskLower}"`);
    
    // Präzise Zuordnung basierend auf den exakten deutschen Begriffen
    if (riskLower.includes('rechtlich unzulässig') || riskLower.includes('unzulässig')) {
      risk = 'Rechtlich unzulässig';
    } else if (riskLower.includes('rechtlich fraglich') || riskLower.includes('fraglich')) {
      risk = 'Rechtlich fraglich';
    } else if (riskLower.includes('rechtskonform') || riskLower.includes('konform')) {
      risk = 'Rechtskonform';
    } else if (riskLower.includes('hoch') || riskLower.includes('hohes risiko')) {
      risk = 'hoch';
    } else if (riskLower.includes('mittel') || riskLower.includes('mittleres risiko')) {
      risk = 'mittel';
    } else if (riskLower.includes('niedrig') || riskLower.includes('niedriges risiko')) {
      risk = 'niedrig';
    } else {
      // Fallback auf Rechtskonform bei unklaren Angaben
      risk = 'Rechtskonform';
      console.log(`Unbekanntes Risiko-Format: "${extractedRisk}", verwende Fallback: ${risk}`);
    }
    
    console.log(`Finales Risiko: ${risk}`);
    
    // Klausel erstellen, wenn mindestens Titel UND (Text oder Analyse) vorhanden sind
    if (title && (text.length > 10 || analysis.length > 10)) {
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
      console.log(`✅ Klausel ${index + 1} erfolgreich erstellt:`, {
        id: clause.id,
        title: clause.title,
        textLength: clause.text.length,
        analysisLength: clause.analysis.length,
        risk: clause.risk,
        lawRefLength: clause.lawReference.text.length,
        recommendationLength: clause.recommendation.length
      });
    } else {
      console.log(`❌ Klausel ${index + 1} übersprungen - unvollständige Daten:`, {
        title,
        textLength: text.length,
        analysisLength: analysis.length
      });
    }
  });
  
  console.log(`\n=== PARSING ABGESCHLOSSEN ===`);
  console.log(`✅ Erfolgreich ${clauses.length} Klauseln extrahiert.`);
  
  // Wenn keine Klauseln gefunden wurden, erweiterte Fallback-Methode
  if (clauses.length === 0) {
    console.warn("⚠️ Keine Klauseln mit Standard-Methode gefunden, versuche Fallback-Extraktion");
    
    try {
      // Erweiterte Fallback: Versuche alternative Trennmuster
      const alternativeSections = responseText.split(/(?=###\s)/);
      console.log(`Fallback: Gefunden ${alternativeSections.length} alternative Abschnitte`);
      
      if (alternativeSections.length > 1) {
        // Verarbeite alternative Abschnitte
        alternativeSections.slice(1).forEach((section, index) => {
          const titleMatch = section.match(/###\s*(.+?)(?:\n|$)/);
          if (titleMatch && section.length > 50) {
            const fallbackClause = {
              id: `clause-fallback-${index + 1}`,
              title: titleMatch[1].trim(),
              text: section.substring(0, 500) + (section.length > 500 ? '...' : ''),
              analysis: 'Automatische Strukturierung teilweise fehlgeschlagen. Manuelle Überprüfung empfohlen.',
              risk: 'Rechtlich fraglich' as const,
              lawReference: {
                text: 'Automatische Extraktion unvollständig',
                link: ''
              },
              recommendation: 'Manuelle Überprüfung durch einen Rechtsexperten empfohlen'
            };
            clauses.push(fallbackClause);
          }
        });
      }
      
      if (clauses.length === 0) {
        // Letzter Fallback: Erstelle eine einzelne Klausel mit allem
        const fallbackClause = {
          id: 'clause-complete',
          title: 'Vollständige Vertragsanalyse',
          text: responseText.substring(0, 1000) + (responseText.length > 1000 ? '...' : ''),
          analysis: 'Die automatische Strukturierung konnte nicht vollständig durchgeführt werden. Der gesamte Analysetext ist im Klauseltext verfügbar.',
          risk: 'Rechtlich fraglich' as const,
          lawReference: {
            text: 'Automatische Extraktion fehlgeschlagen - vollständiger Text verfügbar',
            link: ''
          },
          recommendation: 'Gründliche manuelle Überprüfung durch einen Rechtsexperten dringend empfohlen'
        };
        
        clauses.push(fallbackClause);
        console.log(`🔄 Fallback-Klausel erstellt.`);
      }
    } catch (e) {
      console.error("❌ Fallback-Klausel-Extraktion fehlgeschlagen:", e);
      throw new Error("Keine Klauseln konnten in der Antwort identifiziert werden - Format unbekannt");
    }
  }
  
  // Gesamtrisiko bestimmen basierend auf den gefundenen Klauseln
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

  // Verbesserte Zusammenfassung erstellen
  const summary = `${clauses.length} Klausel${clauses.length === 1 ? '' : 'n'} analysiert. ${
    unzulassigCount > 0 ? `${unzulassigCount} rechtlich unzulässige Klausel${unzulassigCount === 1 ? '' : 'n'} gefunden. ` : ''
  }${
    fraglichCount > 0 ? `${fraglichCount} rechtlich fragliche Klausel${fraglichCount === 1 ? '' : 'n'} identifiziert. ` : ''
  }${
    unzulassigCount === 0 && fraglichCount === 0 ? 'Alle Klauseln sind rechtskonform. ' : ''
  }Detaillierte Empfehlungen verfügbar.`;
  
  console.log(`\n=== FINAL RESULT ===`);
  console.log(`📊 Gesamtrisiko: ${overallRisk}`);
  console.log(`📝 Zusammenfassung: ${summary}`);
  console.log(`✅ Erfolgreich ${clauses.length} Klauseln verarbeitet`);
  console.log("=== CLAUSE PARSER END ===\n");

  return {
    clauses,
    overallRisk,
    summary
  };
}
