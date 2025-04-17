
import React from 'react';
import { CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type RiskLevelType = 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';

interface RiskIndicatorProps {
  risk: RiskLevelType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ 
  risk, 
  size = 'md',
  className 
}) => {
  const getRiskIcon = (risk: RiskLevelType) => {
    switch (risk) {
      case 'niedrig':
      case 'Rechtskonform':
        return <CheckCircle className={`${getSizeClass(size)} text-legal-risk-low`} />;
      case 'mittel':
      case 'Rechtlich fraglich':
        return <HelpCircle className={`${getSizeClass(size)} text-legal-risk-medium`} />;
      case 'hoch':
      case 'Rechtlich unzulässig':
        return <AlertCircle className={`${getSizeClass(size)} text-legal-risk-high`} />;
      default:
        return <HelpCircle className={`${getSizeClass(size)} text-gray-400`} />;
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      case 'md':
      default: return 'h-5 w-5';
    }
  };

  const getRiskClass = (risk: RiskLevelType) => {
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

  return (
    <span className={cn(`risk-pill ${getRiskClass(risk)}`, className)}>
      <div className="flex items-center gap-1">
        {getRiskIcon(risk)}
        <span>{risk}</span>
      </div>
    </span>
  );
};

export default RiskIndicator;
