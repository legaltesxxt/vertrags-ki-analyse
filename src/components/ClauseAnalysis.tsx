
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
import { AlertTriangle, CheckCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Clause {
  id: string;
  title: string;
  text: string;
  risk: 'niedrig' | 'mittel' | 'hoch';
  analysis: string;
  lawReference: {
    text: string;
    link: string;
  };
  recommendation: string;
}

interface ClauseAnalysisProps {
  clauses: Clause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch';
  summary: string;
}

const ClauseAnalysis: React.FC<ClauseAnalysisProps> = ({ clauses, overallRisk, summary }) => {
  const [selectedClause, setSelectedClause] = useState<string | null>(null);

  const getRiskIcon = (risk: 'niedrig' | 'mittel' | 'hoch') => {
    switch (risk) {
      case 'niedrig':
        return <CheckCircle className="h-5 w-5 text-legal-risk-low" />;
      case 'mittel':
        return <AlertTriangle className="h-5 w-5 text-legal-risk-medium" />;
      case 'hoch':
        return <AlertTriangle className="h-5 w-5 text-legal-risk-high" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskClass = (risk: 'niedrig' | 'mittel' | 'hoch') => {
    switch (risk) {
      case 'niedrig':
        return 'risk-low';
      case 'mittel':
        return 'risk-medium';
      case 'hoch':
        return 'risk-high';
      default:
        return '';
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
            <div>
              <span className={`risk-pill ${getRiskClass(overallRisk)}`}>
                Gesamtrisiko: {overallRisk}
              </span>
            </div>
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
                  <p className="text-sm text-gray-500 truncate max-w-md">{clause.text.substring(0, 60)}...</p>
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
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Analyse:</h5>
                  <p className="text-sm">{clause.analysis}</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
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
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Empfehlung:</h5>
                  <p className="text-sm">{clause.recommendation}</p>
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
