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
  
  // ENHANCED REGEX PATTERNS for better newline handling
  
  // 1. Klauseltext - between **Klauseltext** and **Analyse**
  // More flexible with whitespace and newlines
  const textPattern = /\*\*Klauseltext\*\*\s*\n+(.*?)(?=\n+\*\*Analyse\*\*)/s;
  const textMatch = cleanSection.match(textPattern);
  
  // 2. Analyse - between **Analyse** and **Risiko-Einstufung**
  // Handle multiple newlines before next section
  const analysisPattern = /\*\*Analyse\*\*\s*\n+(.*?)(?=\n+\*\*Risiko-Einstufung\*\*)/s;
  const analysisMatch = cleanSection.match(analysisPattern);
  
  // 3. Risiko-Einstufung - between **Risiko-Einstufung** and **Gesetzliche Referenz**
  const riskPattern = /\*\*Risiko-Einstufung\*\*\s*\n+(.*?)(?=\n+\*\*Gesetzliche Referenz\*\*)/s;
  const riskMatch = cleanSection.match(riskPattern);
  
  // 4. Gesetzliche Referenz - between **Gesetzliche Referenz** and **Empfehlung**
  const lawRefPattern = /\*\*Gesetzliche Referenz\*\*\s*\n+(.*?)(?=\n+\*\*Empfehlung\*\*)/s;
  const lawRefMatch = cleanSection.match(lawRefPattern);
  
  // 5. Empfehlung - after **Empfehlung** until end
  // Enhanced to handle end of section more reliably
  const recommendationPattern = /\*\*Empfehlung\*\*\s*\n+(.*?)(?:\n+###|$)/s;
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
 * Enhanced function to split response text into processable sections
 * Handles both --- separators and \n\n+### patterns flexibly
 */
export function splitIntoSections(responseText: string): string[] {
  console.log("=== ENHANCED SPLITTING TEXT INTO SECTIONS ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 500));
  
  let sections: string[] = [];
  
  // Strategy 1: Try splitting on "---" separators first (original format)
  console.log("=== TRYING --- SEPARATOR SPLITTING ===");
  const dashSections = responseText.split(/\n---\n/).filter(section => {
    const trimmed = section.trim();
    return trimmed.length > 50 && trimmed.includes('###');
  });
  
  console.log(`Found sections with --- splitting: ${dashSections.length}`);
  
  if (dashSections.length > 1) {
    console.log("Using --- separator splitting");
    sections = dashSections;
  } else {
    // Strategy 2: Try splitting on multiple newlines before ### (new format)
    console.log("=== TRYING \\n\\n+### PATTERN SPLITTING ===");
    
    // Split on pattern: 2 or more newlines followed by ###
    // Use positive lookahead to keep the ### with each section
    const newlineSections = responseText.split(/\n{2,}(?=###)/).filter(section => {
      const trimmed = section.trim();
      return trimmed.length > 50 && trimmed.includes('###');
    });
    
    console.log(`Found sections with \\n\\n+### splitting: ${newlineSections.length}`);
    
    if (newlineSections.length > 1) {
      console.log("Using \\n\\n+### pattern splitting");
      sections = newlineSections;
    } else {
      // Strategy 3: Fallback - split on ### headers directly
      console.log("=== FALLBACK: SPLITTING ON ### HEADERS ===");
      
      const headerSections = responseText.split(/(?=###\s)/).filter(section => {
        const trimmed = section.trim();
        return trimmed.length > 50 && trimmed.includes('###');
      });
      
      console.log(`Found sections with ### header splitting: ${headerSections.length}`);
      
      if (headerSections.length > 0) {
        sections = headerSections;
      } else {
        // Last resort: treat entire text as one section if it contains ###
        if (responseText.includes('###')) {
          console.log("Treating entire text as single section");
          sections = [responseText];
        }
      }
    }
  }
  
  // Enhanced debugging for section splitting
  console.log(`=== FINAL SECTION SPLITTING RESULT ===`);
  console.log(`Total sections found: ${sections.length}`);
  
  sections.forEach((section, i) => {
    const trimmed = section.trim();
    console.log(`Section ${i + 1}:`, {
      length: trimmed.length,
      startsWithHash: trimmed.startsWith('###'),
      containsKlauseltext: trimmed.includes('**Klauseltext**'),
      containsAnalyse: trimmed.includes('**Analyse**'),
      containsRisiko: trimmed.includes('**Risiko-Einstufung**'),
      containsGesetzlich: trimmed.includes('**Gesetzliche Referenz**'),
      containsEmpfehlung: trimmed.includes('**Empfehlung**'),
      preview: trimmed.substring(0, 200)
    });
  });
  
  return sections;
}
