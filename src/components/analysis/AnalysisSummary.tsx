
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { AnalysisClause } from '@/types/analysisTypes';
import RiskOverview from './RiskOverview';

interface AnalysisSummaryProps {
  summary: string;
  overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  clauses: AnalysisClause[];
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ summary, overallRisk, clauses }) => {
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

  return (
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
        <div className="space-y-4">
          <p className="text-gray-700">{summary}</p>
          <RiskOverview clauses={clauses} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummary;
