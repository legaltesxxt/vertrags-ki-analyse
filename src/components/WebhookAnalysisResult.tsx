
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AnalysisResult } from '@/types/analysisTypes';
import ClauseItem from './analysis/ClauseItem';
import RiskSummary from './analysis/RiskSummary';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* First the clause analysis */}
      <h3 className="font-semibold text-xl">Klauselanalyse</h3>
      
      <Accordion type="single" collapsible className="w-full mb-8">
        {result.clauses.map((clause) => (
          <ClauseItem key={clause.id} clause={clause} />
        ))}
      </Accordion>

      {/* Then the summary and risk assessment */}
      <RiskSummary result={result} />
    </div>
  );
};

export default WebhookAnalysisResult;
