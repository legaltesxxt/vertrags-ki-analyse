
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import RiskMeter from '../RiskMeter';
import { formatContentWithRiskBox } from '@/utils/contentFormatter';
import { AnalysisResult } from '@/types/analysisTypes';
import { getRiskClass } from '@/utils/contentFormatter';
import { CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiskSummaryProps {
  result: AnalysisResult;
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ result }) => {
  // Count clauses by risk level
  const riskCounts = {
    niedrig: result.clauses.filter(c => c.risk === 'niedrig' || c.risk === 'Rechtskonform').length,
    mittel: result.clauses.filter(c => c.risk === 'mittel' || c.risk === 'Rechtlich fraglich').length,
    hoch: result.clauses.filter(c => c.risk === 'hoch' || c.risk === 'Rechtlich unzulässig').length
  };

  // Format the summary content
  const formattedSummary = formatContentWithRiskBox(result.summary);
  console.log("Formatted summary type:", typeof formattedSummary);
  
  // Render based on whether the content was specially formatted or not
  const renderSummary = () => {
    if (typeof formattedSummary === 'string') {
      console.log("Summary - Returning plain string content");
      return <p className="text-sm">{formattedSummary}</p>;
    } else {
      // It's a FormattedContent object
      console.log("Summary - Rendering formatted box with risk level:", formattedSummary.riskLevel);
      return (
        <>
          {formattedSummary.mainContent && 
            <p className="text-sm mb-2">{formattedSummary.mainContent}</p>
          }
          <div className={cn("flex items-center p-2 rounded-md my-2", formattedSummary.bgColor)}>
            {formattedSummary.riskLevel === 'Rechtskonform' && (
              <CheckCircle className={`h-4 w-4 mr-1.5 ${formattedSummary.iconClass}`} />
            )}
            {formattedSummary.riskLevel === 'Rechtlich fraglich' && (
              <HelpCircle className={`h-4 w-4 mr-1.5 ${formattedSummary.iconClass}`} />
            )}
            {formattedSummary.riskLevel === 'Rechtlich unzulässig' && (
              <AlertCircle className={`h-4 w-4 mr-1.5 ${formattedSummary.iconClass}`} />
            )}
            <span className={cn("font-medium", formattedSummary.textColor)}>{formattedSummary.riskLevel}</span>
          </div>
          {formattedSummary.restContent && <p className="text-sm mt-2">{formattedSummary.restContent}</p>}
        </>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vertragsanalyse</CardTitle>
            <CardDescription>Zusammenfassung und Risikobewertung</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <RiskMeter risk={result.overallRisk} size="md" showLabel={false} />
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
              {renderSummary()}
            </div>
            <div className="md:w-48 flex justify-center">
              <RiskMeter risk={result.overallRisk} size="lg" />
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
  );
};

export default RiskSummary;
