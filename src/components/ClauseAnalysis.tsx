
import React from 'react';
import { ClauseAnalysisProps } from '@/types/analysisTypes';
import ClauseList from './analysis/ClauseList';
import AnalysisSummary from './analysis/AnalysisSummary';

// We need to add this interface to the types file
<lov-write file_path="src/types/analysisTypes.ts">
// Definitionen für die Analyse-Ergebnisse

export interface AnalysisClause {
  id: string;
  title: string;
  text: string;
  risk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  analysis: string;
  lawReference: {
    text: string;
    link: string;
  };
  recommendation: string;
}

export interface AnalysisResult {
  clauses: AnalysisClause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  summary: string;
}

export interface ClauseAnalysisProps {
  clauses: AnalysisClause[];
  overallRisk: 'niedrig' | 'mittel' | 'hoch' | 'Rechtskonform' | 'Rechtlich fraglich' | 'Rechtlich unzulässig';
  summary: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  analysisResult?: AnalysisResult;
}
