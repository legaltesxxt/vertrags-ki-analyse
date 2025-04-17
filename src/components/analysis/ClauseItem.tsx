
import React from 'react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';
import { AnalysisClause } from '@/types/analysisTypes';
import RiskMeter from '../RiskMeter';
import { CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { formatContentWithRiskBox } from '@/utils/contentFormatter';

interface ClauseItemProps {
  clause: AnalysisClause;
}

const ClauseItem: React.FC<ClauseItemProps> = ({ clause }) => {
  const getRiskIcon = (risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig') => {
    switch (risk) {
      case 'niedrig':
      case 'Rechtskonform':
        return <CheckCircle className="h-5 w-5 text-legal-risk-low" />;
      case 'mittel':
      case 'Rechtlich fraglich':
        return <HelpCircle className="h-5 w-5 text-legal-risk-medium" />;
      case 'hoch':
      case 'Rechtlich unzulässig':
        return <AlertCircle className="h-5 w-5 text-legal-risk-high" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskClass = (risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig') => {
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
    <AccordionItem key={clause.id} value={clause.id}>
      <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
        <div className="flex items-center space-x-3 text-left w-full">
          {getRiskIcon(clause.risk)}
          <div className="flex-1">
            <h4 className="font-medium">{clause.title}</h4>
            <p className="text-sm text-gray-500 truncate max-w-md">
              {clause.text && clause.text.length > 60 
                ? `${clause.text.substring(0, 60)}...` 
                : clause.text}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RiskMeter risk={clause.risk} size="sm" showLabel={false} />
            <span className={`risk-pill ${getRiskClass(clause.risk)}`}>
              {clause.risk}
            </span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2">
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Klauseltext:</h5>
            <p className="text-sm">{clause.text}</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <h5 className="text-sm font-medium text-gray-700 mb-1">Analyse:</h5>
              {formatContentWithRiskBox(clause.analysis)}
            </div>
            <div className="md:w-36 flex justify-center">
              <RiskMeter risk={clause.risk} size="md" />
            </div>
          </div>
          
          {clause.lawReference && clause.lawReference.text && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-legal-primary mb-1">Gesetzliche Referenz:</h5>
              <p className="text-sm">{clause.lawReference.text}</p>
              {clause.lawReference.link && (
                <a 
                  href={clause.lawReference.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-legal-secondary hover:underline inline-flex items-center mt-1"
                >
                  Gesetzestext ansehen
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          )}
          
          {clause.recommendation && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Empfehlung:</h5>
              <p className="text-sm">{clause.recommendation}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ClauseItem;
