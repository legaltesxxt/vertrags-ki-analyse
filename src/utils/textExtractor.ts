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
  
  // Sanitize and clean the section
  const cleanSection = section.replace(/\u00A0/g, ' ').replace(/\r\n?/g, '\n').trim();
  console.log(`Section length: ${cleanSection.length}`);
  console.log(`Section start: ${cleanSection.substring(0, 100)}...`);
  
  // Extract title after ### (German format)
  const titleMatch = cleanSection.match(/###\s*(.+?)(?:\n|$)/);
  const title = titleMatch ? titleMatch[1].trim() : `Klausel ${index + 1}`;
  console.log(`Found title: "${title}"`);
  
  // ENHANCED REGEX PATTERNS - tolerant to colons and variable whitespace
  
  // 1. Klauseltext - between **Klauseltext:** and **Analyse:**
  // Tolerant to optional colons and NBSPs
  const textPattern = /\*\*Klauseltext(?::)?\*\*[:\s\u00A0]*\n+(.*?)(?=\n+\*\*Analyse(?::)?\*\*)/s;
  const textMatch = cleanSection.match(textPattern);
  
  // 2. Analyse - between **Analyse:** and **Risiko-Einstufung**
  // Handle multiple newlines and optional colons
  const analysisPattern = /\*\*Analyse(?::)?\*\*[:\s\u00A0]*\n+(.*?)(?=\n+\*\*Risiko[- ]Einstufung(?::)?\*\*)/s;
  const analysisMatch = cleanSection.match(analysisPattern);
  
  // 3. Risiko-Einstufung - tolerant to hyphens and colons
  const riskPattern = /\*\*Risiko[- ]Einstufung(?::)?\*\*[:\s\u00A0]*\n+(.*?)(?=\n+\*\*Gesetzliche Referenz(?::)?\*\*)/s;
  const riskMatch = cleanSection.match(riskPattern);
  
  // 4. Gesetzliche Referenz - tolerant to colons
  const lawRefPattern = /\*\*Gesetzliche Referenz(?::)?\*\*[:\s\u00A0]*\n+(.*?)(?=\n+\*\*Empfehlung(?::)?\*\*)/s;
  const lawRefMatch = cleanSection.match(lawRefPattern);
  
  // 5. Empfehlung - tolerant to colons and end patterns
  const recommendationPattern = /\*\*Empfehlung(?::)?\*\*[:\s\u00A0]*\n+(.*?)(?:\n+###|$)/s;
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
  
  // Sanitize input text first
  const sanitizedText = responseText.replace(/\u00A0/g, ' ').replace(/\r\n?/g, '\n');
  
  let sections: string[] = [];
  
  // Strategy 1: Try splitting on "---" separators first (original format)
  console.log("=== TRYING --- SEPARATOR SPLITTING ===");
  const dashSections = sanitizedText.split(/\n\s*---\s*\n/).filter(section => {
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
    const newlineSections = sanitizedText.split(/\n{2,}(?=###)/).filter(section => {
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
      
      const headerSections = sanitizedText.split(/(?=###\s)/).filter(section => {
        const trimmed = section.trim();
        return trimmed.length > 50 && trimmed.includes('###');
      });
      
      console.log(`Found sections with ### header splitting: ${headerSections.length}`);
      
      if (headerSections.length > 0) {
        sections = headerSections;
      } else {
        // Last resort: treat entire text as one section if it contains ###
        if (sanitizedText.includes('###')) {
          console.log("Treating entire text as single section");
          sections = [sanitizedText];
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
      containsKlauseltext: trimmed.includes('**Klauseltext') || trimmed.includes('**Klauseltext:**'),
      containsAnalyse: trimmed.includes('**Analyse') || trimmed.includes('**Analyse:**'),
      containsRisiko: trimmed.includes('**Risiko-Einstufung') || trimmed.includes('**Risiko-Einstufung:**'),
      containsGesetzlich: trimmed.includes('**Gesetzliche Referenz') || trimmed.includes('**Gesetzliche Referenz:**'),
      containsEmpfehlung: trimmed.includes('**Empfehlung') || trimmed.includes('**Empfehlung:**'),
      preview: trimmed.substring(0, 200)
    });
  });
  
  return sections;
}
