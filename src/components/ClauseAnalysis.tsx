
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { AlertTriangle, CheckCircle, XOctagon, ExternalLink } from 'lucide-react';

interface Clause {
  id: string;
  title: string;
  text: string;
  risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  analysis: string;
  lawReference: {
    text: string;
    link: string;
  };
  recommendation: string;
}

interface ClauseAnalysisProps {
  clauses: Clause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  summary: string;
}

const ClauseAnalysis: React.FC<ClauseAnalysisProps> = ({ clauses, overallRisk, summary }) => {
  const [selectedClause, setSelectedClause] = useState<string | null>(null);

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
  
  const getAnalysisBoxStyle = (risk: string) => {
    switch (risk) {
      case 'niedrig':
      case 'Rechtskonform':
        return 'bg-[#F2FCE2] border-l-4 border-legal-risk-low';
      case 'mittel':
      case 'Rechtlich fraglich':
        return 'bg-[#FEF3C7] border-l-4 border-legal-risk-medium';
      case 'hoch':
      case 'Rechtlich unzulässig':
        return 'bg-[#FEE2E2] border-l-4 border-legal-risk-high';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vertragsanalyse</CardTitle>
              <CardDescription>Zusammenfassung und Risikobewertung</CardDescription>
            </div>
            <span className={`risk-pill ${getRiskClass(overallRisk)}`}>
              Gesamtrisiko: {overallRisk}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{summary}</p>
        </CardContent>
      </Card>

      <h3 className="font-semibold text-xl">Klauselanalyse</h3>
      
      <Accordion type="single" collapsible className="w-full">
        {clauses.map((clause) => (
          <AccordionItem key={clause.id} value={clause.id}>
            <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg">
              <div className="flex items-center space-x-3 text-left w-full">
                {getRiskIcon(clause.risk)}
                <div className="flex-1">
                  <h4 className="font-medium">{clause.title}</h4>
                  <p className="text-sm text-gray-500 truncate max-w-md">
                    {clause.text.substring(0, 60)}...
                  </p>
                </div>
                <span className={`risk-pill ${getRiskClass(clause.risk)}`}>
                  {clause.risk}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Klauseltext:</h5>
                  <p className="text-sm">{clause.text}</p>
                </div>
                
                {/* Analyse mit farbiger Box basierend auf Risikostufe */}
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-legal-primary" /> 
                    Analyse
                  </h5>
                  <div className={`p-4 rounded-lg ${getAnalysisBoxStyle(clause.risk)}`}>
                    <p className="text-sm">{clause.analysis}</p>
                  </div>
                </div>
                
                {/* Risiko-Einstufung ohne Box */}
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-2 mb-1">
                    {getRiskIcon(clause.risk)}
                    <span>Risiko-Einstufung</span>
                  </h5>
                  <p className="text-sm ml-6">{clause.risk}</p>
                </div>
                
                {/* Gesetzliche Referenz ohne Box */}
                <div>
                  <h5 className="text-sm font-medium text-legal-primary mb-1">Gesetzliche Referenz:</h5>
                  <p className="text-sm">{clause.lawReference.text}</p>
                  <a 
                    href={clause.lawReference.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-legal-secondary hover:underline inline-flex items-center mt-1"
                  >
                    Gesetzestext ansehen
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
                
                {/* Handlungsbedarf ohne Box */}
                <div>
                  <h5 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-legal-secondary" />
                    <span>Handlungsbedarf</span>
                  </h5>
                  <p className="text-sm ml-6">{clause.recommendation}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ClauseAnalysis;
