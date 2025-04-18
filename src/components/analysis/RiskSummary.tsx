
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import RiskMeter from '../RiskMeter';
import { formatContentWithRiskBox } from '@/utils/contentFormatter';
import { AnalysisResult } from '@/types/analysisTypes';
import { getRiskClass } from '@/utils/contentFormatter';
import { CheckCircle, HelpCircle, AlertCircle, BarChart3 } from 'lucide-react';
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
      return <p className="text-sm leading-relaxed">{formattedSummary}</p>;
    } else {
      // It's a FormattedContent object
      console.log("Summary - Rendering formatted box with risk level:", formattedSummary.riskLevel);
      return (
        <>
          {formattedSummary.mainContent && 
            <p className="text-sm leading-relaxed mb-4">{formattedSummary.mainContent}</p>
          }
          <div className={cn("flex items-center p-3 rounded-lg my-3", formattedSummary.bgColor)}>
            {formattedSummary.riskLevel === 'Rechtskonform' && (
              <CheckCircle className={`h-5 w-5 mr-2 ${formattedSummary.iconClass}`} />
            )}
            {formattedSummary.riskLevel === 'Rechtlich fraglich' && (
              <HelpCircle className={`h-5 w-5 mr-2 ${formattedSummary.iconClass}`} />
            )}
            {formattedSummary.riskLevel === 'Rechtlich unzulässig' && (
              <AlertCircle className={`h-5 w-5 mr-2 ${formattedSummary.iconClass}`} />
            )}
            <span className={cn("font-medium", formattedSummary.textColor)}>{formattedSummary.riskLevel}</span>
          </div>
          {formattedSummary.restContent && <p className="text-sm mt-4 leading-relaxed">{formattedSummary.restContent}</p>}
        </>
      );
    }
  };

  return (
    <Card className="border-legal-primary/10 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-white to-legal-tertiary/30 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-legal-primary text-2xl font-light tracking-tight">Analyse-Zusammenfassung</CardTitle>
            <CardDescription className="text-legal-secondary/80">Juristische Bewertung und Risikoeinstufung</CardDescription>
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
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="prose prose-sm max-w-none">
                {renderSummary()}
              </div>
            </div>
            <div className="md:w-48 flex justify-center">
              <RiskMeter risk={result.overallRisk} size="lg" />
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="rounded-lg bg-slate-50 p-5">
            <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-legal-primary">
              <BarChart3 size={18} />
              Risiko-Übersicht
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-legal-risk-low/10 p-3 rounded-lg border border-legal-risk-low/20 transition-all hover:shadow-sm">
                <span className="text-xl font-bold text-legal-risk-low">{riskCounts.niedrig}</span>
                <p className="text-sm text-slate-600 mt-1">Niedriges Risiko</p>
              </div>
              <div className="bg-legal-risk-medium/10 p-3 rounded-lg border border-legal-risk-medium/20 transition-all hover:shadow-sm">
                <span className="text-xl font-bold text-legal-risk-medium">{riskCounts.mittel}</span>
                <p className="text-sm text-slate-600 mt-1">Mittleres Risiko</p>
              </div>
              <div className="bg-legal-risk-high/10 p-3 rounded-lg border border-legal-risk-high/20 transition-all hover:shadow-sm">
                <span className="text-xl font-bold text-legal-risk-high">{riskCounts.hoch}</span>
                <p className="text-sm text-slate-600 mt-1">Hohes Risiko</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskSummary;
