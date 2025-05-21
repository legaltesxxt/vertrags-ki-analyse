
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePDF } from '@/utils/pdfUtils';
import { AnalysisResult } from '@/types/analysisTypes';
import { arbeitsvertragDemo, mietvertragDemo, emptyAnalysisData } from '@/data/demoData';

export const useDemoAnalysis = () => {
  const toast = useToast();
  const [currentTab, setCurrentTab] = useState<string>("arbeitsvertrag");
  const [demoAnalysisData, setDemoAnalysisData] = useState<AnalysisResult>(arbeitsvertragDemo);
  const [demoMarkdownOutput, setDemoMarkdownOutput] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Function to generate markdown from analysis data
  const generateMarkdownOutput = (data: AnalysisResult, type: string) => {
    let markdownContent = `# ${type === "arbeitsvertrag" ? "Arbeitsvertrag" : "Mietvertrag"}\n\n`;
    markdownContent += `## Zusammenfassung\n${data.summary}\n\n`;
    
    data.clauses.forEach(clause => {
      markdownContent += `## ${clause.title}\n\n`;
      markdownContent += `**Klauseltext**\n${clause.text}\n\n`;
      markdownContent += `**Analyse**\n${clause.analysis}\n\n`;
      markdownContent += `**Risiko-Einstufung**\n${clause.risk}\n\n`;
      markdownContent += `**Gesetzliche Referenz**\n${clause.lawReference.text}\n\n`;
      if (clause.recommendation) {
        markdownContent += `**Empfehlung**\n${clause.recommendation}\n\n`;
      }
    });
    
    setDemoMarkdownOutput(markdownContent);
  };

  // Function to update the analysis data with new JSON
  const updateAnalysisData = (newData: AnalysisResult, type: string) => {
    setDemoAnalysisData(newData);
    generateMarkdownOutput(newData, type);
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === "arbeitsvertrag") {
      updateAnalysisData(arbeitsvertragDemo, tab);
    } else if (tab === "mietvertrag") {
      updateAnalysisData(mietvertragDemo, tab);
    } else {
      // Set empty data for any other tab
      updateAnalysisData(emptyAnalysisData, tab);
    }
  };

  // Function to handle PDF download
  const downloadFullAnalysisPDF = async () => {
    if (demoAnalysisData.clauses.length === 0) {
      toast.toast({
        title: "Keine Daten vorhanden",
        description: "Es sind keine Analysedaten zum Herunterladen verfügbar.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use a custom filename based on the selected tab
      let filename = 'demo_vertragsklar.pdf';
      if (currentTab === "arbeitsvertrag") {
        filename = 'arbeitsvertrag_demo_analyse.pdf';
      } else if (currentTab === "mietvertrag") {
        filename = 'mietvertrag_demo_analyse.pdf';
      }
        
      await generatePDF(demoAnalysisData, filename, toast);
    } catch (error) {
      console.error("Fehler beim PDF-Export:", error);
      toast.toast({
        title: "Fehler beim PDF-Export",
        description: "Beim Erstellen der PDF ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Set up the page with the pre-loaded Arbeitsvertrag data
    setHasLoaded(true);
    generateMarkdownOutput(arbeitsvertragDemo, "arbeitsvertrag");
  }, []);

  return {
    currentTab,
    demoAnalysisData,
    demoMarkdownOutput,
    hasLoaded,
    handleTabChange,
    downloadFullAnalysisPDF
  };
};

export default useDemoAnalysis;
