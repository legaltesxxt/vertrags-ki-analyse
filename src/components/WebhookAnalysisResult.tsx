
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
import { AlertTriangle, CheckCircle, HelpCircle, ExternalLink, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '@/types/analysisTypes';
import RiskMeter from './RiskMeter';
import { cn } from '@/lib/utils';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

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

  const formatContentWithRiskBox = (content: string) => {
    // Check if the content contains the risk assessment heading
    if (!content || !content.includes('**Risiko-Einstufung**')) {
      return <p className="text-sm">{content}</p>;
    }

    // Split content by the risk assessment heading
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
      bgColor = 'bg-[#FEC6A1]'; // Soft orange
      textColor = 'text-orange-700';
      icon = <HelpCircle className="h-4 w-4 mr-1.5 text-orange-600" />;
    } else if (riskText === 'Rechtlich unzulässig') {
      riskLevel = 'Rechtlich unzulässig';
      bgColor = 'bg-[#ea384c]/10'; // Red with opacity
      textColor = 'text-red-700';
      icon = <AlertTriangle className="h-4 w-4 mr-1.5 text-red-600" />;
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
    
    // Fall back to regular formatting if no specific risk level is found
    return <p className="text-sm">{content}</p>;
  };

  // Zähle die Klauseln nach Risikostufe
  const riskCounts = {
    niedrig: result.clauses.filter(c => c.risk === 'niedrig' || c.risk === 'Rechtskonform').length,
    mittel: result.clauses.filter(c => c.risk === 'mittel' || c.risk === 'Rechtlich fraglich').length,
    hoch: result.clauses.filter(c => c.risk === 'hoch' || c.risk === 'Rechtlich unzulässig').length
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
                <div className="flex items-center gap-3">
                  <RiskMeter risk={clause.risk as 'niedrig' | 'mittel' | 'hoch'} size="sm" showLabel={false} />
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
                    <RiskMeter risk={clause.risk as 'niedrig' | 'mittel' | 'hoch'} size="md" />
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
            <div className="flex items-center gap-4">
              <RiskMeter risk={result.overallRisk as 'niedrig' | 'mittel' | 'hoch'} size="md" showLabel={false} />
              <span className={`risk-pill ${getRiskClass(result.overallRisk)}`}>
                Gesamtrisiko: {result.overallRisk}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {formatContentWithRiskBox(result.summary)}
              </div>
              <div className="md:w-48 flex justify-center">
                <RiskMeter risk={result.overallRisk as 'niedrig' | 'mittel' | 'hoch'} size="lg" />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Risiko-Übersicht</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-legal-risk-low/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-low">{riskCounts.niedrig}</span>
                  <p className="text-sm">Niedriges Risiko</p>
                </div>
                <div className="bg-legal-risk-medium/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-medium">{riskCounts.mittel}</span>
                  <p className="text-sm">Mittleres Risiko</p>
                </div>
                <div className="bg-legal-risk-high/20 p-3 rounded">
                  <span className="text-xl font-bold text-legal-risk-high">{riskCounts.hoch}</span>
                  <p className="text-sm">Hohes Risiko</p>
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
