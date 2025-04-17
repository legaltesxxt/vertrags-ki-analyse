
import { cn } from '@/lib/utils';

// Definiere einen Typ für die formatierte Rückgabe
export interface FormattedContent {
  mainContent: string;
  riskLevel: string;
  bgColor: string;
  textColor: string;
  iconClass: string;
  restContent: string;
}

/**
 * Formats content with special handling for risk classifications
 */
export const formatContentWithRiskBox = (content: string): string | FormattedContent => {
  // Verbesserte Risiko-Erkennung - prüfe verschiedene Varianten
  if (!content) return content;

  // Prüfe auf Risiko-Einstufung im Text - zwei Varianten
  let riskMatch = content.match(/\*\*Risiko-Einstufung\*\*\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i);
  
  // Wenn kein Match mit Sternen, prüfe ohne Formatierung
  if (!riskMatch) {
    riskMatch = content.match(/Risiko-Einstufung\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i);
  }
  
  if (!riskMatch) {
    console.log("Keine Risiko-Einstufung erkannt in:", content.substring(0, 100) + "...");
    return content;
  }
  
  // Extrahiere den Risikotext
  const riskText = riskMatch[1].trim();
  console.log("Gefundener Risikotext:", riskText);
  
  // Finde Position der Risiko-Einstufung im Content
  const risikoPos = content.indexOf(riskMatch[0]);
  const mainContent = risikoPos > 0 ? content.substring(0, risikoPos) : "";
  
  // Extrahiere den Rest nach dem Risikotext
  const restStartPos = risikoPos + riskMatch[0].length;
  let restContent = "";
  
  if (restStartPos < content.length) {
    restContent = content.substring(restStartPos).trim();
  }
  
  console.log("Main content length:", mainContent.length);
  console.log("Rest content:", restContent.substring(0, 50) + "...");
  
  // Determine risk level and styling
  let riskLevel = '';
  let bgColor = '';
  let textColor = '';
  let iconClass = '';
  
  if (riskText.includes('Rechtskonform')) {
    riskLevel = 'Rechtskonform';
    bgColor = 'bg-[#F2FCE2]'; // Soft green
    textColor = 'text-green-700';
    iconClass = 'text-green-600';
  } else if (riskText.includes('Rechtlich fraglich')) {
    riskLevel = 'Rechtlich fraglich';
    bgColor = 'bg-[#FEF3C7]'; // Soft orange
    textColor = 'text-orange-700';
    iconClass = 'text-orange-600';
  } else if (riskText.includes('Rechtlich unzulässig')) {
    riskLevel = 'Rechtlich unzulässig';
    bgColor = 'bg-[#FEE2E2]'; // Soft red
    textColor = 'text-red-700';
    iconClass = 'text-red-600';
  }
  
  // If no specific risk level was found, return the original content
  if (!riskLevel) {
    console.log("Kein Risiko-Level erkannt für:", riskText);
    return content;
  }

  console.log("Erkanntes Risiko-Level:", riskLevel);
  
  // Rückgabe des formatierten Inhalts
  return {
    mainContent,
    riskLevel,
    bgColor,
    textColor,
    iconClass,
    restContent
  };
};

/**
 * Returns the appropriate CSS class for a risk level
 */
export const getRiskClass = (risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig') => {
  switch (risk) {
    case 'niedrig':
    case 'Rechtskonform':
      return 'risk-low';
    case 'mittel':
    case 'Rechtlich fraglich':
      return 'risk-medium';
    case 'hoch':
    case 'Rechtlich unzulässig':
      return 'risk-high';
    default:
      return '';
  }
};
