
import { AnalysisClause } from '../types/analysisTypes';

/**
 * Extracts structured data from a text section using German format patterns
 */
export function extractClauseFromSection(section: string, index: number): Partial<AnalysisClause> | null {
  console.log(`\n=== EXTRACTING CLAUSE ${index + 1} ===`);
  console.log(`Section preview: ${section.substring(0, 200)}...`);
  
  // Extract title after ### (can also have spaces)
  const titleMatch = section.match(/###\s*(.+?)(?:\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
  
  console.log(`Found title: "${title}"`);
  
  // PRECISE REGEX PATTERNS for exact German format
  
  // 1. Clause text extraction - between **Klauseltext** and **Analyse**
  const textPattern = /\*\*Klauseltext\*\*\s*\n([\s\S]*?)(?=\n\*\*Analyse\*\*)/i;
  const textMatch = section.match(textPattern);
  
  // 2. Analysis extraction - between **Analyse** and **Risiko-Einstufung**
  const analysisPattern = /\*\*Analyse\*\*\s*\n([\s\S]*?)(?=\n\*\*Risiko-Einstufung\*\*)/i;
  const analysisMatch = section.match(analysisPattern);
  
  // 3. Risk extraction - between **Risiko-Einstufung** and **Gesetzliche Referenz**
  const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n([\s\S]*?)(?=\n\*\*Gesetzliche Referenz\*\*)/i;
  const riskMatch = section.match(riskPattern);
  
  // 4. Legal reference extraction - between **Gesetzliche Referenz** and **Empfehlung**
  const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n([\s\S]*?)(?=\n\*\*Empfehlung\*\*)/i;
  const lawRefMatch = section.match(lawRefPattern);
  
  // 5. Recommendation extraction - after **Empfehlung** until end or next ---
  const recommendationPattern = /\*\*Empfehlung\*\*\s*\n([\s\S]*?)(?=\n---|\s*$)/i;
  const recommendationMatch = section.match(recommendationPattern);
  
  // Detailed logging for debugging
  console.log(`Clause ${index + 1} - Extraction results:`, {
    title,
    textExtracted: !!textMatch,
    textLength: textMatch ? textMatch[1].trim().length : 0,
    textPreview: textMatch ? `${textMatch[1].trim().substring(0, 100)}${textMatch[1].trim().length > 100 ? '...' : ''}` : 'Not found',
    analysisExtracted: !!analysisMatch,
    analysisLength: analysisMatch ? analysisMatch[1].trim().length : 0,
    riskExtracted: !!riskMatch,
    riskValue: riskMatch ? riskMatch[1].trim() : 'Not found',
    lawRefExtracted: !!lawRefMatch,
    lawRefLength: lawRefMatch ? lawRefMatch[1].trim().length : 0,
    recommendationExtracted: !!recommendationMatch,
    recommendationLength: recommendationMatch ? recommendationMatch[1].trim().length : 0
  });
  
  // Extract and clean values
  const text = textMatch ? textMatch[1].trim() : '';
  const analysis = analysisMatch ? analysisMatch[1].trim() : '';
  const extractedRisk = riskMatch ? riskMatch[1].trim() : 'Rechtskonform';
  const lawRefText = lawRefMatch ? lawRefMatch[1].trim() : '';
  const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';
  
  return {
    title,
    text,
    analysis,
    extractedRisk,
    lawRefText,
    recommendation
  };
}

/**
 * Splits response text into processable sections
 */
export function splitIntoSections(responseText: string): string[] {
  console.log("=== SPLITTING TEXT INTO SECTIONS ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 300));
  
  // OPTIMIZED clause separation for German format
  // Split between clauses using "---" between sections
  const sections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    return trimmed.length > 20 && trimmed.includes('###'); // Minimum length for valid clauses
  });
  
  console.log(`Found sections after --- splitting: ${sections.length}`);
  
  return sections;
}
