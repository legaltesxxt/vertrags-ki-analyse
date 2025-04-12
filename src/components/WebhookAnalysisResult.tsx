
import React from 'react';
import { AnalysisResult } from '@/types/analysisTypes';
import ClauseList from './analysis/ClauseList';
import AnalysisSummary from './analysis/AnalysisSummary';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Zuerst die Klauselanalyse */}
      <ClauseList clauses={result.clauses} />

      {/* Danach die Zusammenfassung und Risikobewertung */}
      <AnalysisSummary 
        summary={result.summary} 
        overallRisk={result.overallRisk} 
        clauses={result.clauses} 
      />
    </div>
  );
};

export default WebhookAnalysisResult;
