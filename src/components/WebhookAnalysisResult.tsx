
import React from 'react';
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
import { AnalysisResult } from '@/types/analysisTypes';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

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
  
  const getAnalysisBoxClass = (risk: string) => {
    switch (risk) {
      case 'niedrig':
      case 'Rechtskonform':
        return 'analysis-box-rechtskonform';
      case 'mittel':
      case 'Rechtlich fraglich':
        return 'analysis-box-fraglich';
      case 'hoch':
      case 'Rechtlich unzulässig':
        return 'analysis-box-unzulassig';
      default:
        return '';
    }
  };

  // Zähle die Klauseln nach Risikostufe
  const riskCounts = {
    niedrig: result.clauses.filter(c => 
      c.risk === 'niedrig' || c.risk === 'Rechtskonform').length,
    mittel: result.clauses.filter(c => 
      c.risk === 'mittel' || c.risk === 'Rechtlich fraglich').length,
    hoch: result.clauses.filter(c => 
      c.risk === 'hoch' || c.risk === 'Rechtlich unzulässig').length
  };

  return (
    <div className="space-y-6">
      {/* Zuerst die Klauselanalyse */}
      <h3 className="font-semibold text-xl">Klauselanalyse</h3>
      
      <Accordion type="single" collapsible className="w-full mb-8">
        {result.clauses.map((clause) => (
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
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Klauseltext:</h5>
                  <p className="text-sm">{clause.text}</p>
                </div>
                
                {/* Analyse mit farbiger Box basierend auf Risikostufe */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Analyse:</h5>
                  <div className={`analysis-box ${getAnalysisBoxClass(clause.risk)}`}>
                    <p className="text-sm">{clause.analysis}</p>
                  </div>
                </div>
                
                {/* Risiko-Einstufung ohne farbige Box */}
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
        ))}
      </Accordion>

      {/* Danach die Zusammenfassung und Risikobewertung */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vertragsanalyse</CardTitle>
              <CardDescription>Zusammenfassung und Risikobewertung</CardDescription>
            </div>
            <span className={`risk-pill ${getRiskClass(result.overallRisk)}`}>
              Gesamtrisiko: {result.overallRisk}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">{result.summary}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Risiko-Übersicht</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-legal-risk-low/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-low">{riskCounts.niedrig}</span>
                  <p className="text-sm">Rechtskonform</p>
                </div>
                <div className="bg-legal-risk-medium/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-medium">{riskCounts.mittel}</span>
                  <p className="text-sm">Rechtlich fraglich</p>
                </div>
                <div className="bg-legal-risk-high/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-high">{riskCounts.hoch}</span>
                  <p className="text-sm">Rechtlich unzulässig</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookAnalysisResult;
