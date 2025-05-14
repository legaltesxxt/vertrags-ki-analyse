
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

  // Vollständige Klauselextraktion mit verbesserten Regex-Mustern
  const clauses: AnalysisResult['clauses'] = [];
  
  // Zuerst versuchen wir, die Klauseln durch die ### Überschriften zu trennen
  const sections = responseText.split(/###\s+/).filter(Boolean);
  console.log(`Gefundene Abschnitte: ${sections.length}`);
  
  if (sections.length > 0) {
    sections.forEach((section, index) => {
      // Extrahiere den Titel (erste Zeile)
      const lines = section.split('\n');
      const title = lines[0].trim();
      
      console.log(`Verarbeite Abschnitt ${index + 1}: "${title}"`);
      console.log(`Abschnittstext (erste 100 Zeichen): ${section.substring(0, 100)}...`);
      
      // VERBESSERTE REGEX-MUSTER mit genaueren Grenzen
      // 1. Verbesserte Klauseltext-Extraktion
      const textMatch = section.match(/\*\*(?:Klauseltext|Text)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Analyse|Bewertung)|\n\n\*\*(?:Analyse|Bewertung)|\s*$)/m);
      
      // 2. Verbesserte Analyse-Extraktion
      const analysisMatch = section.match(/\*\*(?:Analyse|Bewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\n\n\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)|\s*$)/m);
      
      // 3. Verbesserte Risiko-Extraktion
      const riskMatch = section.match(/\*\*(?:Risiko-Einstufung|Risiko|Risikobewertung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\n\n\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)|\s*$)/m);
      
      // 4. Verbesserte gesetzliche Referenz-Extraktion
      const lawRefMatch = section.match(/\*\*(?:Gesetzliche Referenz|Gesetz|Rechtsgrundlage)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n\n\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)|\n---|\n\n---|\s*$)/m);
      
      // 5. Verbesserte Empfehlungs-Extraktion
      const recommendationMatch = section.match(/\*\*(?:Empfehlung|Handlungsbedarf|Handlungsempfehlung)\*\*(?:\s*\n|\s*\:\s*)([\s\S]*?)(?=\n---|\n\n---|\s*$)/m);
      
      // Detailliertes Logging zur Fehleranalyse
      console.log(`Klausel ${index + 1} - Extraktionsergebnisse:`, {
        title,
        textExtracted: !!textMatch,
        textLength: textMatch ? textMatch[1].trim().length : 0,
        textPreview: textMatch ? `${textMatch[1].trim().substring(0, 100)}${textMatch[1].trim().length > 100 ? '...' : ''}` : 'Nicht gefunden',
        analysisExtracted: !!analysisMatch,
        riskExtracted: !!riskMatch,
        riskValue: riskMatch ? riskMatch[1].trim() : 'Nicht gefunden',
        lawRefExtracted: !!lawRefMatch,
        lawRefLength: lawRefMatch ? lawRefMatch[1].trim().length : 0,
        recommendationExtracted: !!recommendationMatch
      });
      
      // Extrahierte Werte einsetzen oder Fallbacks verwenden
      const text = textMatch ? textMatch[1].trim() : '';
      const analysis = analysisMatch ? analysisMatch[1].trim() : '';
      const extractedRisk = riskMatch ? riskMatch[1].trim() : 'Rechtskonform';
      const lawRefText = lawRefMatch ? lawRefMatch[1].trim() : '';
      const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';
      
      // Risiko-Klassifizierung
      let risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
      
      if (extractedRisk.toLowerCase().includes('unzulässig') || 
          extractedRisk.toLowerCase().includes('hoch')) {
        risk = 'Rechtlich unzulässig';
      } else if (extractedRisk.toLowerCase().includes('fraglich') || 
                 extractedRisk.toLowerCase().includes('mittel') ||
                 extractedRisk.toLowerCase().includes('zu prüfen')) {
        risk = 'Rechtlich fraglich';
      } else {
        risk = 'Rechtskonform';
      }
      
      // Klausel zum Ergebnis hinzufügen
      if (title || text) { // Nur hinzufügen, wenn mindestens Titel oder Text vorhanden ist
        clauses.push({
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
        });
      }
    });
    
    console.log(`Erfolgreich ${clauses.length} Klauseln extrahiert.`);
  } else {
    throw new Error("Keine Klauselabschnitte in der Antwort gefunden");
  }
  
  // Wenn keine Klauseln gefunden wurden, versuchen wir eine alternative Methode
  if (clauses.length === 0) {
    console.warn("Keine Klauseln mit Standard-Methode gefunden, versuche alternative Extraktion");
    
    // Fallback-Methode: Versuch einer einfachen Extraktion von Klauseln
    try {
      // Einfache Regex für eine Struktur wie "### Klausel X"
      const clauseRegex = /#+\s+(.*?)(?=\n#+\s+|$)/gs;
      let match;
      let i = 0;
      
      while ((match = clauseRegex.exec(responseText)) !== null) {
        i++;
        const clauseTitle = match[1].trim();
        
        clauses.push({
          id: `clause-${i}`,
          title: clauseTitle || `Klausel ${i}`,
          text: `[Klauseltext konnte nicht extrahiert werden]`,
          analysis: '',
          risk: 'Rechtlich fraglich', // Default-Risiko, wenn wir unsicher sind
          lawReference: {
            text: '',
            link: ''
          },
          recommendation: ''
        });
      }
      
      console.log(`Alternative Extraktion: ${clauses.length} Klauseln gefunden.`);
    } catch (e) {
      console.error("Alternative Klausel-Extraktion fehlgeschlagen:", e);
      throw new Error("Keine Klauseln konnten in der Antwort identifiziert werden");
    }
  }
  
  // Gesamtrisiko bestimmen
  const unzulassigCount = clauses.filter(c => c.risk === 'Rechtlich unzulässig' || c.risk === 'hoch').length;
  const fraglichCount = clauses.filter(c => c.risk === 'Rechtlich fraglich' || c.risk === 'mittel').length;
  
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
  
  console.log(`Analyse abgeschlossen. Gesamtrisiko: ${overallRisk}, ${clauses.length} Klauseln gefunden.`);

  return {
    clauses,
    overallRisk,
    summary
  };
}
