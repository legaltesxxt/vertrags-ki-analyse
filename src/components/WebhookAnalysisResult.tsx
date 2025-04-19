
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AnalysisResult } from '@/types/analysisTypes';
import ClauseItem from './analysis/ClauseItem';
import RiskSummary from './analysis/RiskSummary';
import DownloadAnalysisButton from './DownloadAnalysisButton';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* First the summary and risk assessment */}
      <RiskSummary result={result} />
      
      {/* Then the clause analysis */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-xl text-legal-primary tracking-tight">Klausel-Analyse</h3>
          <DownloadAnalysisButton result={result} />
        </div>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {result.clauses.map((clause) => (
            <ClauseItem key={clause.id} clause={clause} />
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default WebhookAnalysisResult;
