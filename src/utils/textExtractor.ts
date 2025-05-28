
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
  
  // Clean the section - remove extra whitespace but preserve structure
  const cleanSection = section.trim();
  console.log(`Section length: ${cleanSection.length}`);
  console.log(`Section start: ${cleanSection.substring(0, 100)}...`);
  
  // Extract title after ### (German format)
  const titleMatch = cleanSection.match(/###\s*(.+?)(?:\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
  console.log(`Found title: "${title}"`);
  
  // EXACT REGEX PATTERNS for the German format from the real webhook response
  
  // 1. Klauseltext - between **Klauseltext** and **Analyse**
  const textPattern = /\*\*Klauseltext\*\*\s*\n(.*?)(?=\n\*\*Analyse\*\*)/s;
  const textMatch = cleanSection.match(textPattern);
  
  // 2. Analyse - between **Analyse** and **Risiko-Einstufung**
  const analysisPattern = /\*\*Analyse\*\*\s*\n(.*?)(?=\n\*\*Risiko-Einstufung\*\*)/s;
  const analysisMatch = cleanSection.match(analysisPattern);
  
  // 3. Risiko-Einstufung - between **Risiko-Einstufung** and **Gesetzliche Referenz**
  const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n(.*?)(?=\n\*\*Gesetzliche Referenz\*\*)/s;
  const riskMatch = cleanSection.match(riskPattern);
  
  // 4. Gesetzliche Referenz - between **Gesetzliche Referenz** and **Empfehlung**
  const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n(.*?)(?=\n\*\*Empfehlung\*\*)/s;
  const lawRefMatch = cleanSection.match(lawRefPattern);
  
  // 5. Empfehlung - after **Empfehlung** until end or next ---
  const recommendationPattern = /\*\*Empfehlung\*\*\s*\n(.*?)(?=\n---|$)/s;
  const recommendationMatch = cleanSection.match(recommendationPattern);
  
  // Detailed logging for debugging
  console.log(`Clause ${index + 1} - Extraction results:`, {
    title,
    textExtracted: !!textMatch,
    textLength: textMatch ? textMatch[1].trim().length : 0,
    textPreview: textMatch ? `${textMatch[1].trim().substring(0, 100)}${textMatch[1].trim().length > 100 ? '...' : ''}` : 'Not found',
    analysisExtracted: !!analysisMatch,
    analysisLength: analysisMatch ? analysisMatch[1].trim().length : 0,
    analysisPreview: analysisMatch ? `${analysisMatch[1].trim().substring(0, 100)}${analysisMatch[1].trim().length > 100 ? '...' : ''}` : 'Not found',
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
  
  console.log(`Final extracted values:`, {
    textLength: text.length,
    analysisLength: analysis.length,
    risk: extractedRisk,
    lawRefLength: lawRefText.length,
    recommendationLength: recommendation.length
  });
  
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
 * Handles the exact format from the webhook response using --- separators
 */
export function splitIntoSections(responseText: string): string[] {
  console.log("=== SPLITTING TEXT INTO SECTIONS ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 500));
  
  // Split on "---" separators between clauses (as shown in real example)
  // Use \n---\n to ensure we split on standalone --- lines
  const sections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    // Must contain ### for title and have reasonable length
    return trimmed.length > 50 && trimmed.includes('###');
  });
  
  console.log(`Found sections after --- splitting: ${sections.length}`);
  
  // Enhanced debugging for section splitting
  sections.forEach((section, i) => {
    console.log(`Section ${i + 1}:`, {
      length: section.length,
      startsWithHash: section.trim().startsWith('###'),
      containsKlauseltext: section.includes('**Klauseltext**'),
      containsAnalyse: section.includes('**Analyse**'),
      preview: section.substring(0, 200)
    });
  });
  
  // If no sections found with ---, try alternative splitting
  if (sections.length === 0) {
    console.log("No --- separators found, trying alternative splitting...");
    
    // Try splitting on ### headers
    const alternativeSections = responseText.split(/(?=###\s)/).filter(section => {
      const trimmed = section.trim();
      return trimmed.length > 50 && trimmed.includes('###');
    });
    
    console.log(`Alternative splitting found: ${alternativeSections.length} sections`);
    
    if (alternativeSections.length > 0) {
      return alternativeSections;
    }
    
    // Last resort: treat entire text as one section if it contains ###
    if (responseText.includes('###')) {
      console.log("Treating entire text as single section");
      return [responseText];
    }
  }
  
  return sections;
}
