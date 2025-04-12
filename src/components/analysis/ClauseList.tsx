
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { AnalysisClause } from '@/types/analysisTypes';
import ClauseItem from './ClauseItem';

interface ClauseListProps {
  clauses: AnalysisClause[];
}

const ClauseList: React.FC<ClauseListProps> = ({ clauses }) => {
  if (!clauses || clauses.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Keine Klauseln zur Analyse vorhanden.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-xl mb-4">Klauselanalyse</h3>
      <Accordion type="single" collapsible className="w-full mb-8">
        {clauses.map((clause) => (
          <ClauseItem key={clause.id} clause={clause} />
        ))}
      </Accordion>
    </div>
  );
};

export default ClauseList;
