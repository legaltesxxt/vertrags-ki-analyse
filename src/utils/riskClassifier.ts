
/**
 * Classifies risk level from extracted German text
 */
export type RiskLevel = 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';

export function classifyRisk(extractedRisk: string): RiskLevel {
  const riskLower = extractedRisk.toLowerCase().trim();
  console.log(`Risk classification input: "${extractedRisk}" → "${riskLower}"`);
  
  // Precise mapping based on exact German terms from real webhook response
  if (riskLower.includes('rechtlich unzulässig') || riskLower.includes('unzulässig')) {
    console.log('Classified as: Rechtlich unzulässig');
    return 'Rechtlich unzulässig';
  } else if (riskLower.includes('rechtlich fraglich') || riskLower.includes('fraglich')) {
    console.log('Classified as: Rechtlich fraglich');
    return 'Rechtlich fraglich';
  } else if (riskLower.includes('rechtskonform') || riskLower.includes('konform')) {
    console.log('Classified as: Rechtskonform');
    return 'Rechtskonform';
  } else if (riskLower.includes('hoch') || riskLower.includes('hohes risiko')) {
    console.log('Classified as: hoch');
    return 'hoch';
  } else if (riskLower.includes('mittel') || riskLower.includes('mittleres risiko')) {
    console.log('Classified as: mittel');
    return 'mittel';
  } else if (riskLower.includes('niedrig') || riskLower.includes('niedriges risiko')) {
    console.log('Classified as: niedrig');
    return 'niedrig';
  } else {
    // Fallback to Rechtskonform for unclear cases
    console.log(`Unknown risk format: "${extractedRisk}", using fallback: Rechtskonform`);
    return 'Rechtskonform';
  }
}

/**
 * Determines overall risk based on individual clause risks
 */
export function calculateOverallRisk(clauses: Array<{ risk: RiskLevel }>): RiskLevel {
  const unzulassigCount = clauses.filter(c => 
    c.risk === 'Rechtlich unzulässig' || c.risk === 'hoch'
  ).length;
  const fraglichCount = clauses.filter(c => 
    c.risk === 'Rechtlich fraglich' || c.risk === 'mittel'
  ).length;
  
  console.log(`Overall risk calculation:`, {
    totalClauses: clauses.length,
    unzulassigCount,
    fraglichCount
  });
  
  if (unzulassigCount > 0) {
    return 'Rechtlich unzulässig';
  } else if (fraglichCount > 0) {
    return 'Rechtlich fraglich';
  } else {
    return 'Rechtskonform';
  }
}
