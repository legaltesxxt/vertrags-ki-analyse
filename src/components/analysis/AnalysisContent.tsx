
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import WebhookAnalysisResult from '@/components/WebhookAnalysisResult';
import EmptyAnalysis from '@/components/analysis/EmptyAnalysis';
import { AnalysisResult } from '@/types/analysisTypes';

interface AnalysisContentProps {
  analysisOutput: string;
  structuredResult: AnalysisResult | null;
  hasContent: boolean;
}

const AnalysisContent: React.FC<AnalysisContentProps> = ({ 
  analysisOutput, 
  structuredResult, 
  hasContent 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 md:p-8 mb-8 animate-fade-in">
      <ScrollArea className="h-[calc(100vh-250px)] pr-4">
        {structuredResult ? (
          <WebhookAnalysisResult result={structuredResult} />
        ) : analysisOutput ? (
          <MarkdownRenderer content={analysisOutput} />
        ) : (
          <EmptyAnalysis />
        )}
      </ScrollArea>
    </div>
  );
};

export default AnalysisContent;
