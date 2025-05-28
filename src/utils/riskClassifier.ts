
/**
 * Classifies risk level from extracted German text
 */
export type RiskLevel = 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';

export function classifyRisk(extractedRisk: string): RiskLevel {
  const riskLower = extractedRisk.toLowerCase().trim();
  console.log(`Risk text (lowercase): "${riskLower}"`);
  
  // Precise mapping based on exact German terms
  if (riskLower.includes('rechtlich unzulässig') || riskLower.includes('unzulässig')) {
    return 'Rechtlich unzulässig';
  } else if (riskLower.includes('rechtlich fraglich') || riskLower.includes('fraglich')) {
    return 'Rechtlich fraglich';
  } else if (riskLower.includes('rechtskonform') || riskLower.includes('konform')) {
    return 'Rechtskonform';
  } else if (riskLower.includes('hoch') || riskLower.includes('hohes risiko')) {
    return 'hoch';
  } else if (riskLower.includes('mittel') || riskLower.includes('mittleres risiko')) {
    return 'mittel';
  } else if (riskLower.includes('niedrig') || riskLower.includes('niedriges risiko')) {
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
  
  if (unzulassigCount > 0) {
    return 'Rechtlich unzulässig';
  } else if (fraglichCount > 0) {
    return 'Rechtlich fraglich';
  } else {
    return 'Rechtskonform';
  }
}
