import { cn } from '@/lib/utils';

export interface FormattedContent {
  mainContent: string;
  riskLevel: string;
  bgColor: string;
  textColor: string;
  iconClass: string;
  restContent: string;
}

export const formatContentWithRiskBox = (content: string): string | FormattedContent => {
  if (!content) return content;
  
  console.log("=== Formatting Content Analysis ===");
  console.log("Raw content:", content);

  // Erweiterte Regex-Muster für verschiedene Formate der Risiko-Einstufung
  const riskRegexes = [
    // Markdown Format mit Sternchen
    /\*\*(?:Risiko-Einstufung|Risiko)\*\*\s*(?:\:|\n)?\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    // Plain Text Format
    /(?:Risiko-Einstufung|Risiko)\s*(?:\:|\n)?\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    // Format mit Bindestrich
    /(?:Risiko|Risiko-Einstufung)\s*-\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    // Format mit Doppelpunkt
    /(?:Risiko|Risiko-Einstufung)\:\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i
  ];
  
  let riskMatch = null;
  let matchedPattern = '';
  
  // Teste jedes Regex-Muster
  for (const regex of riskRegexes) {
    const match = content.match(regex);
    if (match) {
      riskMatch = match;
      matchedPattern = regex.toString();
      console.log("Matched risk pattern:", matchedPattern);
      console.log("Extracted risk:", match[1]);
      break;
    }
  }
  
  if (!riskMatch) {
    console.log("No risk assessment found - Full content:", content);
    return content;
  }
  
  // Extrahiere den Risikotext
  const riskText = riskMatch[1].trim();
  
  // Position der Risikobewertung im Text finden
  const riskPos = content.indexOf(riskMatch[0]);
  
  // Hauptinhalt (vor der Risikobewertung)
  const mainContent = riskPos > 0 ? content.substring(0, riskPos).trim() : "";
  console.log("Main content:", mainContent);
  
  // Restinhalt (nach der Risikobewertung)
  const restStartPos = riskPos + riskMatch[0].length;
  let restContent = "";
  
  if (restStartPos < content.length) {
    // Suche nach dem nächsten Abschnitt (z.B. "Gesetzliche Referenz" oder "Handlungsbedarf")
    const nextSectionRegex = /\n\*\*(?:Gesetzliche Referenz|Handlungsbedarf)\:\*\*/i;
    const nextSection = content.substring(restStartPos).match(nextSectionRegex);
    
    if (nextSection) {
      restContent = content.substring(restStartPos, restStartPos + nextSection.index).trim();
    } else {
      restContent = content.substring(restStartPos).trim();
    }
  }
  
  console.log("Rest content:", restContent);
  
  // Styling basierend auf Risikobewertung
  let riskLevel = '';
  let bgColor = '';
  let textColor = '';
  let iconClass = '';
  
  // Normalisiere den Risikotext für den Vergleich
  const normalizedRisk = riskText.toLowerCase().trim();
  
  if (normalizedRisk.includes('rechtskonform')) {
    riskLevel = 'Rechtskonform';
    bgColor = 'bg-[#F2FCE2]';
    textColor = 'text-green-700';
    iconClass = 'text-green-600';
  } else if (normalizedRisk.includes('rechtlich fraglich')) {
    riskLevel = 'Rechtlich fraglich';
    bgColor = 'bg-[#FEF3C7]';
    textColor = 'text-orange-700';
    iconClass = 'text-orange-600';
  } else if (normalizedRisk.includes('rechtlich unzulässig')) {
    riskLevel = 'Rechtlich unzulässig';
    bgColor = 'bg-[#FEE2E2]';
    textColor = 'text-red-700';
    iconClass = 'text-red-600';
  }
  
  console.log("Final risk level:", riskLevel);
  console.log("=== End Content Analysis ===");
  
  return {
    mainContent,
    riskLevel,
    bgColor,
    textColor,
    iconClass,
    restContent
  };
};

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
