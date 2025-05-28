
import { RiskLevel } from './riskClassifier';

/**
 * Generates analysis summary based on clause count and risk levels
 */
export function generateSummary(
  clauseCount: number,
  unzulassigCount: number,
  fraglichCount: number
): string {
  return `${clauseCount} Klausel${clauseCount === 1 ? '' : 'n'} analysiert. ${
    unzulassigCount > 0 ? `${unzulassigCount} rechtlich unzulässige Klausel${unzulassigCount === 1 ? '' : 'n'} gefunden. ` : ''
  }${
    fraglichCount > 0 ? `${fraglichCount} rechtlich fragliche Klausel${fraglichCount === 1 ? '' : 'n'} identifiziert. ` : ''
  }${
    unzulassigCount === 0 && fraglichCount === 0 ? 'Alle Klauseln sind rechtskonform. ' : ''
  }Detaillierte Empfehlungen verfügbar.`;
}

/**
 * Counts clauses by risk level
 */
export function countClausesByRisk(clauses: Array<{ risk: RiskLevel }>) {
  const unzulassigCount = clauses.filter(c => 
    c.risk === 'Rechtlich unzulässig' || c.risk === 'hoch'
  ).length;
  const fraglichCount = clauses.filter(c => 
    c.risk === 'Rechtlich fraglich' || c.risk === 'mittel'
  ).length;
  
  return { unzulassigCount, fraglichCount };
}
