
import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { AlertTriangle, CheckCircle, ExternalLink, XOctagon } from 'lucide-react';
import { AnalysisClause } from '@/types/analysisTypes';

interface ClauseItemProps {
  clause: AnalysisClause;
}

const ClauseItem: React.FC<ClauseItemProps> = ({ clause }) => {
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'niedrig':
      case 'Rechtskonform':
        return <CheckCircle className="h-5 w-5 text-legal-risk-low" />;
      case 'mittel':
      case 'Rechtlich fraglich':
        return <AlertTriangle className="h-5 w-5 text-legal-risk-medium" />;
      case 'hoch':
      case 'Rechtlich unzulässig':
        return <XOctagon className="h-5 w-5 text-legal-risk-high" />;
      default:
        return null;
    }
  };

  const getRiskClass = (risk: string) => {
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

  // Determine if this clause needs the orange box
  const isFraglich = clause.risk === 'Rechtlich fraglich' || clause.risk === 'mittel';

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
          <span className={`risk-pill ${getRiskClass(clause.risk)}`}>
            {clause.risk}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pt-2">
        <div className={`space-y-4 ${isFraglich ? 'p-3 border-2 border-legal-risk-medium bg-legal-risk-medium/10 rounded-lg' : ''}`}>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-700 mb-1">Klauseltext:</h5>
            <p className="text-sm">{clause.text}</p>
          </div>
          
          {/* Analyse mit grüner Box */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-1">Analyse:</h5>
            <div className="analysis-box">
              <p className="text-sm">{clause.analysis}</p>
            </div>
          </div>
          
          {/* Risiko-Einstufung ohne Box */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-1">Risiko-Einstufung:</h5>
            <p className="text-sm flex items-center gap-2">
              {getRiskIcon(clause.risk)}
              <span>{clause.risk}</span>
            </p>
          </div>
          
          {/* Gesetzliche Referenz ohne Box */}
          {clause.lawReference && clause.lawReference.text && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Gesetzliche Referenz:</h5>
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
          
          {/* Handlungsbedarf ohne Box */}
          {clause.recommendation && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Handlungsbedarf:</h5>
              <p className="text-sm">{clause.recommendation}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ClauseItem;
