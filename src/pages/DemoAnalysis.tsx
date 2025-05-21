
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import DemoTabs from '@/components/analysis/DemoTabs';
import DemoInfoBanner from '@/components/analysis/DemoInfoBanner';
import useDemoAnalysis from '@/hooks/useDemoAnalysis';

const DemoAnalysis: React.FC = () => {
  const {
    currentTab,
    demoAnalysisData,
    demoMarkdownOutput,
    hasLoaded,
    handleTabChange,
    downloadFullAnalysisPDF
  } = useDemoAnalysis();

  return (
    <AnalysisLayout>
      <DemoInfoBanner />

      <DemoTabs 
        currentTab={currentTab}
        onTabChange={handleTabChange}
      />

      {hasLoaded && (
        <>
          <AnalysisHeader 
            structuredResult={demoAnalysisData} 
            onDownloadPDF={downloadFullAnalysisPDF}
          />
          
          <AnalysisContent 
            analysisOutput={demoMarkdownOutput}
            structuredResult={demoAnalysisData}
            hasContent={hasLoaded && demoAnalysisData.clauses.length > 0}
          />
          
          <AnalysisFooter 
            hasContent={hasLoaded && demoAnalysisData.clauses.length > 0}
            structuredResult={demoAnalysisData}
            onDownloadPDF={downloadFullAnalysisPDF}
          />
        </>
      )}
    </AnalysisLayout>
  );
};

export default DemoAnalysis;
