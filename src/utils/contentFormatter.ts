
import { cn } from '@/lib/utils';

// Definiere einen Typ für die formatierte Rückgabe
interface FormattedContent {
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
  // Check if the content contains the risk assessment heading
  if (!content || !content.includes('**Risiko-Einstufung**')) {
    return content;
  }

  // Split the content based on the risk assessment heading
  const parts = content.split('**Risiko-Einstufung**');
  
  // Check if there's content after the heading
  if (parts.length < 2 || !parts[1]) {
    return content;
  }

  // Extract the risk assessment (take the first line after the heading)
  const afterHeading = parts[1].trim();
  const lines = afterHeading.split('\n');
  const riskText = lines[0].trim();
  
  // Logging für Debugging
  console.log("Gefundener Risikotext:", riskText);
  console.log("Gesamter Text nach Einstufung:", afterHeading);
  
  // Determine risk level and styling
  let riskLevel = '';
  let bgColor = '';
  let textColor = '';
  let iconClass = '';
  
  if (riskText === 'Rechtskonform') {
    riskLevel = 'Rechtskonform';
    bgColor = 'bg-[#F2FCE2]'; // Soft green
    textColor = 'text-green-700';
    iconClass = 'text-green-600';
  } else if (riskText === 'Rechtlich fraglich') {
    riskLevel = 'Rechtlich fraglich';
    bgColor = 'bg-[#FEF3C7]'; // Soft orange
    textColor = 'text-orange-700';
    iconClass = 'text-orange-600';
  } else if (riskText === 'Rechtlich unzulässig') {
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
  
  // For the actual rendering, we'll return the JSX element that can be used in React components
  const restContent = lines.slice(1).join('\n').trim();
  
  return {
    mainContent: parts[0],
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
