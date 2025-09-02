
import { AnalysisResult } from "../types/analysisTypes";
import { splitIntoSections, extractClauseFromSection } from './textExtractor';
import { classifyRisk, calculateOverallRisk } from './riskClassifier';
import { generateSummary, countClausesByRisk } from './summaryGenerator';

/**
 * Enhanced parser for webhook responses supporting multiple formats
 * Handles format: [{"output": "### Title\n**Klauseltext**\n..."}]
 */
export function parseClausesFromText(responseText: string): AnalysisResult {
  console.log("=== ENHANCED CLAUSE PARSER START ===");
  console.log("Input text length:", responseText.length);
  console.log("Input text preview:", responseText.substring(0, 500));
  
  // Check if response is empty or invalid
  if (!responseText || responseText.trim() === "") {
    throw new Error("Die erhaltene Antwort ist leer oder ungültig");
  }

  let actualText = responseText;
  
  // Handle JSON array format [{"output": "..."}] or single object {"output": "..."}
  try {
    const parsed = JSON.parse(responseText);
    console.log("=== JSON PARSING ATTEMPT ===");
    console.log("Parsed type:", typeof parsed);
    console.log("Is array:", Array.isArray(parsed));
    
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
      actualText = parsed[0].output;
      console.log("=== EXTRACTED FROM JSON ARRAY ===");
      console.log("Extracted text length:", actualText.length);
      console.log("Extracted text preview:", actualText.substring(0, 500));
    } else if (parsed && typeof parsed === 'object' && parsed.output) {
      actualText = parsed.output;
      console.log("=== EXTRACTED FROM JSON OBJECT ===");
      console.log("Extracted text length:", actualText.length);
      console.log("Extracted text preview:", actualText.substring(0, 500));
    } else {
      console.log("JSON structure doesn't match expected format");
    }
  } catch (e) {
    console.log("Input is not JSON, using as plain text");
  }

  // Sanitize text: remove NBSPs and normalize line endings
  actualText = actualText.replace(/\u00A0/g, ' ').replace(/\r\n?/g, '\n');
  console.log("=== TEXT SANITIZATION COMPLETE ===");
  console.log("Sanitized text length:", actualText.length);

  const clauses: AnalysisResult['clauses'] = [];
  
  // Use enhanced section splitting that handles multiple formats
  const sections = splitIntoSections(actualText);
  console.log(`=== ENHANCED SECTION SPLITTING COMPLETE ===`);
  console.log(`Found ${sections.length} sections using flexible parsing`);
  
  sections.forEach((section, index) => {
    console.log(`\n=== PROCESSING SECTION ${index + 1} ===`);
    console.log(`Section preview: ${section.substring(0, 200)}...`);
    
    const extracted = extractClauseFromSection(section, index);
    if (!extracted) {
      console.log(`❌ Clause ${index + 1} skipped - extraction failed`);
      return;
    }
    
    const { title, text, analysis, extractedRisk, lawRefText, recommendation } = extracted;
    
    // Classify risk level
    const risk = classifyRisk(extractedRisk || 'Rechtskonform');
    console.log(`Risk classification: ${extractedRisk} → ${risk}`);
    
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
  
  console.log(`\n=== ENHANCED PARSING COMPLETED ===`);
  console.log(`✅ Successfully extracted ${clauses.length} clauses with flexible parser.`);
  
  // If no clauses found, show detailed debug info
  if (clauses.length === 0) {
    console.log("=== DEBUG INFO FOR EMPTY RESULT ===");
    console.log("Original response text preview:", responseText.substring(0, 1000));
    console.log("Actual text preview:", actualText.substring(0, 1000));
    console.log("Sections found:", sections.length);
    sections.forEach((section, i) => {
      console.log(`Section ${i + 1} preview:`, section.substring(0, 300));
      console.log(`Section ${i + 1} contains ###:`, section.includes('###'));
      console.log(`Section ${i + 1} contains **Klauseltext**:`, section.includes('**Klauseltext**'));
    });
    
    throw new Error("Keine gültigen Klauseln in der Antwort gefunden. Das Format entspricht nicht den Erwartungen.");
  }
  
  // Calculate overall risk and summary
  const overallRisk = calculateOverallRisk(clauses);
  const { unzulassigCount, fraglichCount } = countClausesByRisk(clauses);
  const summary = generateSummary(clauses.length, unzulassigCount, fraglichCount);
  
  console.log(`\n=== FINAL ENHANCED RESULT ===`);
  console.log(`📊 Overall risk: ${overallRisk}`);
  console.log(`📝 Summary: ${summary}`);
  console.log(`✅ Successfully processed ${clauses.length} clauses with enhanced parser`);
  console.log("=== ENHANCED CLAUSE PARSER END ===\n");

  return {
    clauses,
    overallRisk,
    summary
  };
}
