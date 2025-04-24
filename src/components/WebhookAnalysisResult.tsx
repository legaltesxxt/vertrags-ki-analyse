
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AnalysisResult } from '@/types/analysisTypes';
import ClauseItem from './analysis/ClauseItem';

interface WebhookAnalysisResultProps {
  result: AnalysisResult | null;
}

const WebhookAnalysisResult: React.FC<WebhookAnalysisResultProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mt-8">
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
