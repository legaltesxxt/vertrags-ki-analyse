
// Interface for temporary extraction data during parsing
interface ExtractionResult {
  title: string;
  text: string;
  analysis: string;
  extractedRisk: string;
  lawRefText: string;
  recommendation: string;
}

/**
 * Extracts structured data from a text section using the exact German format
 * Handles format: ### Title, **Klauseltext**, **Analyse**, etc.
 */
export function extractClauseFromSection(section: string, index: number): ExtractionResult | null {
  console.log(`\n=== EXTRACTING CLAUSE ${index + 1} ===`);
  console.log(`Section preview: ${section.substring(0, 200)}...`);
  
  // Extract title after ### (German format)
  const titleMatch = section.match(/###\s*(.+?)(?:\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
  
  console.log(`Found title: "${title}"`);
  
  // EXACT REGEX PATTERNS for the German format shown in example
  
  // 1. Klauseltext - between **Klauseltext** and **Analyse**
  const textPattern = /\*\*Klauseltext\*\*\s*\n([\s\S]*?)(?=\n\*\*Analyse\*\*)/i;
  const textMatch = section.match(textPattern);
  
  // 2. Analyse - between **Analyse** and **Risiko-Einstufung**
  const analysisPattern = /\*\*Analyse\*\*\s*\n([\s\S]*?)(?=\n\*\*Risiko-Einstufung\*\*)/i;
  const analysisMatch = section.match(analysisPattern);
  
  // 3. Risiko-Einstufung - between **Risiko-Einstufung** and **Gesetzliche Referenz**
  const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n([\s\S]*?)(?=\n\*\*Gesetzliche Referenz\*\*)/i;
  const riskMatch = section.match(riskPattern);
  
  // 4. Gesetzliche Referenz - between **Gesetzliche Referenz** and **Empfehlung**
  const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n([\s\S]*?)(?=\n\*\*Empfehlung\*\*)/i;
  const lawRefMatch = section.match(lawRefPattern);
  
  // 5. Empfehlung - after **Empfehlung** until end or next ---
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
 * Splits response text into processable sections for German format
 * Handles the exact format from the webhook response
 */
export function splitIntoSections(responseText: string): string[] {
  console.log("=== SPLITTING TEXT INTO SECTIONS ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 300));
  
  // Split on "---" separators between clauses (as shown in example)
  const sections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    return trimmed.length > 50 && trimmed.includes('###'); // Minimum length for valid clauses
  });
  
  console.log(`Found sections after --- splitting: ${sections.length}`);
  
  // If no sections found with ---, try alternative splitting
  if (sections.length === 0) {
    console.log("No --- separators found, trying alternative splitting...");
    const alternativeSections = responseText.split(/(?=###\s)/).filter(section => {
      const trimmed = section.trim();
      return trimmed.length > 50 && trimmed.includes('###');
    });
    console.log(`Alternative splitting found: ${alternativeSections.length} sections`);
    return alternativeSections;
  }
  
  return sections;
}
