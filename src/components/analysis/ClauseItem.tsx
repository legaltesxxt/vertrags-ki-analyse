
import React from 'react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, FileText, Lightbulb } from 'lucide-react';
import { AnalysisClause } from '@/types/analysisTypes';
import { CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { formatContentWithRiskBox } from '@/utils/contentFormatter';
import { cn } from '@/lib/utils';

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
        return 'bg-legal-risk-low/10 text-legal-risk-low border-legal-risk-low/30';
      case 'mittel':
      case 'Rechtlich fraglich':
        return 'bg-legal-risk-medium/10 text-legal-risk-medium border-legal-risk-medium/30';
      case 'hoch':
      case 'Rechtlich unzulässig':
        return 'bg-legal-risk-high/10 text-legal-risk-high border-legal-risk-high/30';
      default:
        return '';
    }
  };

  // Format the analysis content
  const formattedContent = formatContentWithRiskBox(clause.analysis);
  
  // Render based on whether the content was specially formatted or not
  const renderAnalysis = () => {
    if (typeof formattedContent === 'string') {
      return <p className="text-sm text-slate-700 leading-relaxed">{formattedContent}</p>;
    } else {
      return (
        <>
          {formattedContent.mainContent && 
            <p className="text-sm text-slate-700 leading-relaxed mb-3">{formattedContent.mainContent}</p>
          }
          <div className={cn("flex items-center p-3 rounded-md my-3", formattedContent.bgColor)}>
            {formattedContent.riskLevel === 'Rechtskonform' && (
              <CheckCircle className={`h-4 w-4 mr-2 ${formattedContent.iconClass}`} />
            )}
            {formattedContent.riskLevel === 'Rechtlich fraglich' && (
              <HelpCircle className={`h-4 w-4 mr-2 ${formattedContent.iconClass}`} />
            )}
            {formattedContent.riskLevel === 'Rechtlich unzulässig' && (
              <AlertCircle className={`h-4 w-4 mr-2 ${formattedContent.iconClass}`} />
            )}
            <span className={cn("font-medium", formattedContent.textColor)}>{formattedContent.riskLevel}</span>
          </div>
          {formattedContent.restContent && <p className="text-sm mt-3 text-slate-700 leading-relaxed">{formattedContent.restContent}</p>}
        </>
      );
    }
  };

  return (
    <AccordionItem key={clause.id} value={clause.id} className="border-legal-primary/10">
      <AccordionTrigger className="hover:bg-slate-50 px-4 py-3 rounded-lg transition-all">
        <div className="flex items-center space-x-3 text-left w-full">
          {getRiskIcon(clause.risk)}
          <div className="flex-1">
            <h4 className="font-medium text-legal-primary">{clause.title}</h4>
            <p className="text-sm text-slate-500 truncate max-w-md">
              {clause.text && clause.text.length > 60 
                ? `${clause.text.substring(0, 60)}...` 
                : clause.text}
            </p>
          </div>
          <Badge className={`ml-2 border ${getRiskClass(clause.risk)}`}>
            {clause.risk}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-6 pt-3 pb-5">
        <div className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-legal-secondary" />
              <h5 className="text-sm font-medium text-legal-secondary">Klauseltext</h5>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{clause.text}</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-legal-secondary" />
                <h5 className="text-sm font-medium text-legal-secondary">Analyse</h5>
              </div>
              {renderAnalysis()}
            </div>
          </div>
          
          {clause.lawReference && clause.lawReference.text && (
            <div className="p-4 bg-legal-tertiary/30 rounded-lg border border-legal-tertiary">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-legal-primary" />
                <h5 className="text-sm font-medium text-legal-primary">Gesetzliche Referenz</h5>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{clause.lawReference.text}</p>
              {clause.lawReference.link && (
                <a 
                  href={clause.lawReference.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-legal-secondary hover:text-legal-primary hover:underline inline-flex items-center mt-2 transition-colors"
                >
                  Gesetzestext ansehen
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
          )}
          
          {clause.recommendation && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-legal-secondary" />
                <h5 className="text-sm font-medium text-legal-secondary">Empfehlung</h5>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{clause.recommendation}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ClauseItem;
