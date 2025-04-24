
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatContentWithRiskBox } from '@/utils/contentFormatter';
import { AnalysisResult } from '@/types/analysisTypes';
import { getRiskClass } from '@/utils/contentFormatter';

interface RiskSummaryProps {
  result: AnalysisResult;
}

const RiskSummary: React.FC<RiskSummaryProps> = ({ result }) => {
  // Format the summary content
  const formattedSummary = formatContentWithRiskBox(result.summary);
  
  // Render based on whether the content was specially formatted or not
  const renderSummary = () => {
    if (typeof formattedSummary === 'string') {
      return <p className="text-sm leading-relaxed">{formattedSummary}</p>;
    } else {
      return (
        <>
          {formattedSummary.mainContent && 
            <p className="text-sm leading-relaxed mb-4">{formattedSummary.mainContent}</p>
          }
          <div className={`flex items-center p-3 rounded-lg my-3 ${formattedSummary.bgColor}`}>
            <span className={`font-medium ${formattedSummary.textColor}`}>{formattedSummary.riskLevel}</span>
          </div>
          {formattedSummary.restContent && 
            <p className="text-sm mt-4 leading-relaxed">{formattedSummary.restContent}</p>
          }
        </>
      );
    }
  };

  return (
    <Card className="border-legal-primary/10 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-white to-legal-tertiary/30 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-legal-primary text-2xl font-light tracking-tight">
              Analyse-Zusammenfassung
            </CardTitle>
            <CardDescription className="text-legal-secondary/80">
              Juristische Bewertung
            </CardDescription>
          </div>
          <Badge 
            className={`px-3 py-1.5 text-sm font-medium ${getRiskClass(result.overallRisk)}`}
            variant="outline"
          >
            {result.overallRisk}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="prose prose-sm max-w-none">
          {renderSummary()}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSummary;
