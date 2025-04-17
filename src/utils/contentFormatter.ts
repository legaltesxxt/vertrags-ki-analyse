
import { cn } from '@/lib/utils';

// Define a type for the formatted return
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
  // Return early if content is empty
  if (!content) return content;
  
  console.log("Formatting content:", content.substring(0, 100));

  // Check for risk classification in different formats
  const riskRegexes = [
    /\*\*Risiko-Einstufung\*\*\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    /Risiko-Einstufung\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    /\*\*Risiko\*\*\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i,
    /Risiko\s*\n\s*(Rechtskonform|Rechtlich fraglich|Rechtlich unzulässig)/i
  ];
  
  let riskMatch = null;
  
  // Try each regex pattern until we find a match
  for (const regex of riskRegexes) {
    const match = content.match(regex);
    if (match) {
      riskMatch = match;
      console.log("Matched risk with pattern:", regex);
      break;
    }
  }
  
  if (!riskMatch) {
    console.log("No risk assessment found in:", content.substring(0, 100) + "...");
    return content;
  }
  
  // Extract the risk text
  const riskText = riskMatch[1].trim();
  console.log("Found risk text:", riskText);
  
  // Find position of risk assessment in content
  const riskPos = content.indexOf(riskMatch[0]);
  const mainContent = riskPos > 0 ? content.substring(0, riskPos).trim() : "";
  
  // Extract rest of content after risk assessment
  const restStartPos = riskPos + riskMatch[0].length;
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
    console.log("No risk level matched for:", riskText);
    return content;
  }

  console.log("Identified risk level:", riskLevel, "with bgColor:", bgColor);
  
  // Return formatted content
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
