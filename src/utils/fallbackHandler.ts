
import { AnalysisClause } from '../types/analysisTypes';

/**
 * Handles fallback parsing when standard methods fail
 */
export function handleFallbackParsing(responseText: string): AnalysisClause[] {
  console.warn("⚠️ No clauses found with standard method, trying fallback extraction");
  
  const clauses: AnalysisClause[] = [];
  
  try {
    // Extended fallback: Try alternative separation patterns
    const alternativeSections = responseText.split(/(?=###\s)/);
    console.log(`Fallback: Found ${alternativeSections.length} alternative sections`);
    
    if (alternativeSections.length > 1) {
      // Process alternative sections
      alternativeSections.slice(1).forEach((section, index) => {
        const titleMatch = section.match(/###\s*(.+?)(?:\n|$)/);
        if (titleMatch && section.length > 50) {
          const fallbackClause: AnalysisClause = {
            id: `clause-fallback-${index + 1}`,
            title: titleMatch[1].trim(),
            text: section.substring(0, 500) + (section.length > 500 ? '...' : ''),
            analysis: 'Automatische Strukturierung teilweise fehlgeschlagen. Manuelle Überprüfung empfohlen.',
            risk: 'Rechtlich fraglich',
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
      // Last fallback: Create a single clause with everything
      const fallbackClause: AnalysisClause = {
        id: 'clause-complete',
        title: 'Vollständige Vertragsanalyse',
        text: responseText.substring(0, 1000) + (responseText.length > 1000 ? '...' : ''),
        analysis: 'Die automatische Strukturierung konnte nicht vollständig durchgeführt werden. Der gesamte Analysetext ist im Klauseltext verfügbar.',
        risk: 'Rechtlich fraglich',
        lawReference: {
          text: 'Automatische Extraktion fehlgeschlagen - vollständiger Text verfügbar',
          link: ''
        },
        recommendation: 'Gründliche manuelle Überprüfung durch einen Rechtsexperten dringend empfohlen'
      };
      
      clauses.push(fallbackClause);
      console.log(`🔄 Fallback clause created.`);
    }
  } catch (e) {
    console.error("❌ Fallback clause extraction failed:", e);
    throw new Error("Keine Klauseln konnten in der Antwort identifiziert werden - Format unbekannt");
  }
  
  return clauses;
}
