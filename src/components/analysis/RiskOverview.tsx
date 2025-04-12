
import React from 'react';
import { AnalysisClause } from '@/types/analysisTypes';

interface RiskOverviewProps {
  clauses: AnalysisClause[];
}

const RiskOverview: React.FC<RiskOverviewProps> = ({ clauses }) => {
  // Zähle die Klauseln nach Risikostufe
  const riskCounts = {
    niedrig: clauses.filter(c => 
      c.risk === 'niedrig' || c.risk === 'Rechtskonform').length,
    mittel: clauses.filter(c => 
      c.risk === 'mittel' || c.risk === 'Rechtlich fraglich').length,
    hoch: clauses.filter(c => 
      c.risk === 'hoch' || c.risk === 'Rechtlich unzulässig').length
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h3 className="text-sm font-medium mb-2">Risiko-Übersicht</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-legal-risk-low/20 p-3 rounded">
          <span className="text-xl font-bold text-legal-risk-low">{riskCounts.niedrig}</span>
          <p className="text-sm">Rechtskonform</p>
        </div>
        <div className="bg-legal-risk-medium/20 p-3 rounded">
          <span className="text-xl font-bold text-legal-risk-medium">{riskCounts.mittel}</span>
          <p className="text-sm">Rechtlich fraglich</p>
        </div>
        <div className="bg-legal-risk-high/20 p-3 rounded">
          <span className="text-xl font-bold text-legal-risk-high">{riskCounts.hoch}</span>
          <p className="text-sm">Rechtlich unzulässig</p>
        </div>
      </div>
    </div>
  );
};

export default RiskOverview;
