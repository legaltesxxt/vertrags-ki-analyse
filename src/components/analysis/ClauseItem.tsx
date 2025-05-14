
import React, { useEffect } from 'react';
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, FileText, Lightbulb, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { AnalysisClause } from '@/types/analysisTypes';
import { cn } from '@/lib/utils';
import { cleanRecommendationText, isRecommendationMeaningful } from '@/utils/pdfUtils';

interface ClauseItemProps {
  clause: AnalysisClause;
}

const ClauseItem: React.FC<ClauseItemProps> = ({ clause }) => {
  useEffect(() => {
    // Enhanced debug logging to check content
    console.log(`ClauseItem ${clause.id} content:`, {
      id: clause.id,
      title: clause.title,
      textLength: clause.text?.length || 0,
      textFirstChars: clause.text?.substring(0, 100),
      textLastChars: clause.text?.length > 100 ? `...${clause.text?.substring(clause.text.length - 100)}` : '',
      lawReferenceLength: clause.lawReference.text?.length || 0,
      hasQuotes: clause.lawReference.text?.includes('"') || clause.lawReference.text?.includes('„'),
    });
  }, [clause]);

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

  // Format law reference text to preserve line breaks and formatting
  const formatLawReferenceText = (text: string) => {
    if (!text) return '';
    
    // Handle different types of line breaks
    const lines = text.split(/\n|\r\n/);
    
    return lines.map((line, index) => {
      // Preserve quotes and special characters
      const trimmedLine = line.trim();
      
      return (
        <React.Fragment key={index}>
          {trimmedLine}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Get the cleaned recommendation text
  const cleanedRecommendation = clause.recommendation ? cleanRecommendationText(clause.recommendation) : '';
  
  return (
    <AccordionItem value={clause.id} className="border-legal-primary/10">
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
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{clause.text}</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-legal-secondary" />
                <h5 className="text-sm font-medium text-legal-secondary">Analyse</h5>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{clause.analysis}</p>
            </div>
          </div>
          
          <div className="p-4 bg-legal-tertiary/30 rounded-lg border border-legal-tertiary">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-legal-primary" />
              <h5 className="text-sm font-medium text-legal-primary">Gesetzliche Referenz</h5>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {formatLawReferenceText(clause.lawReference.text)}
            </div>
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
          
          {clause.recommendation && isRecommendationMeaningful(cleanedRecommendation) && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-legal-secondary" />
                <h5 className="text-sm font-medium text-legal-secondary">Empfehlung</h5>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {cleanedRecommendation}
              </p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ClauseItem;
