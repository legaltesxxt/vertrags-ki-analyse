
import React from 'react';
import { CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Formats content with special handling for risk classifications
 */
export const formatContentWithRiskBox = (content: string) => {
  // Check if the content contains the risk assessment heading
  if (!content || !content.includes('**Risiko-Einstufung**')) {
    return <p className="text-sm">{content}</p>;
  }

  // Split the content based on the risk assessment heading
  const parts = content.split('**Risiko-Einstufung**');
  
  // Check if there's content after the heading
  if (parts.length < 2 || !parts[1]) {
    return <p className="text-sm">{content}</p>;
  }

  // Extract the risk assessment (take the first line after the heading)
  const afterHeading = parts[1].trim();
  const lines = afterHeading.split('\n');
  const riskText = lines[0].trim();
  
  // Determine risk level and styling
  let riskLevel = '';
  let bgColor = '';
  let textColor = '';
  let icon = null;
  
  if (riskText === 'Rechtskonform') {
    riskLevel = 'Rechtskonform';
    bgColor = 'bg-[#F2FCE2]'; // Soft green
    textColor = 'text-green-700';
    icon = <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />;
  } else if (riskText === 'Rechtlich fraglich') {
    riskLevel = 'Rechtlich fraglich';
    bgColor = 'bg-[#FEF3C7]'; // Soft orange
    textColor = 'text-orange-700';
    icon = <HelpCircle className="h-4 w-4 mr-1.5 text-orange-600" />;
  } else if (riskText === 'Rechtlich unzulässig') {
    riskLevel = 'Rechtlich unzulässig';
    bgColor = 'bg-[#FEE2E2]'; // Soft red
    textColor = 'text-red-700';
    icon = <AlertCircle className="h-4 w-4 mr-1.5 text-red-600" />;
  }
  
  // Create content with special formatting for risk assessment
  if (riskLevel) {
    const restContent = lines.slice(1).join('\n').trim();
    
    return (
      <>
        <p className="text-sm">{parts[0]}<strong>Risiko-Einstufung</strong></p>
        <div className={cn("flex items-center p-2 rounded-md my-2", bgColor)}>
          {icon}
          <span className={cn("font-medium", textColor)}>{riskLevel}</span>
        </div>
        {restContent && <p className="text-sm mt-2">{restContent}</p>}
      </>
    );
  }
  
  // Fallback to regular formatting if no specific risk level was found
  return <p className="text-sm">{content}</p>;
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
