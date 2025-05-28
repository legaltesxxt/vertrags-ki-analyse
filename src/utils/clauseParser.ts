
import { AnalysisResult } from "../types/analysisTypes";
import { splitIntoSections, extractClauseFromSection } from './textExtractor';
import { classifyRisk, calculateOverallRisk } from './riskClassifier';
import { generateSummary, countClausesByRisk } from './summaryGenerator';

/**
 * Parses webhook response (JSON array format) into structured AnalysisResult
 * Handles format: [{"output": "### Title\n**Klauseltext**\n..."}]
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("=== CLAUSE PARSER START ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 300));
  
  // Check if response is empty or invalid
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }

  let actualText = responseText;
  
  // Handle JSON array format [{"output": "..."}]
  try {
    const parsed = JSON.parse(responseText);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
      actualText = parsed[0].output;
      console.log("=== EXTRACTED FROM JSON ARRAY ===");
      console.log("Extracted text length:", actualText.length);
      console.log("Extracted text preview:", actualText.substring(0, 300));
    }
  } catch (e) {
    // Not JSON, use as is
    console.log("Input is not JSON, using as plain text");
  }

  const clauses: AnalysisResult['clauses'] = [];
  
  // Split text into sections
  const sections = splitIntoSections(actualText);
  
  sections.forEach((section, index) => {
    console.log(`\n=== PROCESSING SECTION ${index + 1} ===`);
    
    const extracted = extractClauseFromSection(section, index);
    if (!extracted) {
      console.log(`❌ Clause ${index + 1} skipped - extraction failed`);
      return;
    }
    
    const { title, text, analysis, extractedRisk, lawRefText, recommendation } = extracted;
    
    // Classify risk level
    const risk = classifyRisk(extractedRisk || 'Rechtskonform');
    console.log(`Final risk: ${risk}`);
    
    // Create clause if minimum data is available
    if (title && (text.length > 10 || analysis.length > 10)) {
      const clause = {
        id: `clause-${index + 1}`,
        title: title || `Klausel ${index + 1}`,
        text: text || '',
        analysis: analysis || '',
        risk,
        lawReference: {
          text: lawRefText || '',
          link: ''
        },
        recommendation: recommendation || ''
      };
      
      clauses.push(clause);
      console.log(`✅ Clause ${index + 1} successfully created:`, {
        id: clause.id,
        title: clause.title,
        textLength: clause.text.length,
        analysisLength: clause.analysis.length,
        risk: clause.risk,
        lawRefLength: clause.lawReference.text.length,
        recommendationLength: clause.recommendation.length
      });
    } else {
      console.log(`❌ Clause ${index + 1} skipped - incomplete data:`, {
        title,
        textLength: text?.length || 0,
        analysisLength: analysis?.length || 0
      });
    }
  });
  
  console.log(`\n=== PARSING COMPLETED ===`);
  console.log(`✅ Successfully extracted ${clauses.length} clauses.`);
  
  // If no clauses found, show error (remove fallback)
  if (clauses.length === 0) {
    throw new Error("Keine gültigen Klauseln in der Antwort gefunden. Das Format entspricht nicht den Erwartungen.");
  }
  
  // Calculate overall risk and summary
  const overallRisk = calculateOverallRisk(clauses);
  const { unzulassigCount, fraglichCount } = countClausesByRisk(clauses);
  const summary = generateSummary(clauses.length, unzulassigCount, fraglichCount);
  
  console.log(`\n=== FINAL RESULT ===`);
  console.log(`📊 Overall risk: ${overallRisk}`);
  console.log(`📝 Summary: ${summary}`);
  console.log(`✅ Successfully processed ${clauses.length} clauses`);
  console.log("=== CLAUSE PARSER END ===\n");

  return {
    clauses,
    overallRisk,
    summary
  };
}
