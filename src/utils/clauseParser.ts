
import { AnalysisResult } from "../types/analysisTypes";
import { splitIntoSections, extractClauseFromSection } from './textExtractor';
import { classifyRisk, calculateOverallRisk } from './riskClassifier';
import { handleFallbackParsing } from './fallbackHandler';
import { generateSummary, countClausesByRisk } from './summaryGenerator';

/**
 * Parses a text response from webhook into a structured AnalysisResult object
 * Optimized for German format with ### headings and **Section** markings
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("=== CLAUSE PARSER START ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 300));
  
  // Check if response is empty or invalid
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }

  const clauses: AnalysisResult['clauses'] = [];
  
  // Split text into sections
  const sections = splitIntoSections(responseText);
  
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
  
  // Handle fallback if no clauses found
  if (clauses.length === 0) {
    const fallbackClauses = handleFallbackParsing(responseText);
    clauses.push(...fallbackClauses);
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
