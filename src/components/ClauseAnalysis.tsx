
import React from 'react';
import { ClauseAnalysisProps } from '@/types/analysisTypes';
import ClauseList from './analysis/ClauseList';
import AnalysisSummary from './analysis/AnalysisSummary';

const ClauseAnalysis: React.FC<ClauseAnalysisProps> = ({ clauses, overallRisk, summary }) => {
  return (
    <div className="space-y-6">
      {/* First show clause analysis */}
      <ClauseList clauses={clauses} />

      {/* Then show summary and risk assessment */}
      <AnalysisSummary 
        summary={summary} 
        overallRisk={overallRisk} 
        clauses={clauses} 
      />
    </div>
  );
};

export default ClauseAnalysis;
