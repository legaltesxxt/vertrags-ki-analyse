
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import { generatePDF } from '@/utils/pdfUtils';
import { AnalysisResult } from '@/types/analysisTypes';

// Demo data for the analysis (parsed from the provided JSON)
const demoAnalysisData: AnalysisResult = {
  clauses: [
    {
      id: "clause-1",
      title: "Beginn des Arbeitsverhältnisses und Probezeit",
      text: "Das Arbeitsverhältnis beginnt am 1. Juli 2024. Die ersten drei Monate gelten als Probezeit. Während dieser kann mit einer Kündigungsfrist von 7 Kalendertagen gekündigt werden.",
      risk: "Rechtskonform",
      analysis: "Diese Regelung entspricht grundsätzlich dem schweizerischen Obligationenrecht. Die Probezeit darf maximal 3 Monate dauern. Während der Probezeit kann das Arbeitsverhältnis jederzeit mit einer Frist von 7 Tagen gekündigt werden. Die Klausel ist daher gesetzeskonform.",
      lawReference: {
        text: "OR Art. 335b Abs. 1–2: \"Die ersten Anstellungsmonate gelten als Probezeit, sofern nichts anderes schriftlich vereinbart, doch dauert sie nicht mehr als drei Monate. Während der Probezeit kann das Arbeitsverhältnis mit einer Frist von sieben Tagen gekündigt werden.\"",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_335b"
      },
      recommendation: "Keine Anpassung notwendig."
    },
    {
      id: "clause-2",
      title: "Funktion und Beschäftigungsgrad",
      text: "Herr Muster wird als Verkaufsmitarbeiter (Bereich Kasse & Kundenberatung) in der Filiale Zürich-Oerlikon angestellt. Der Beschäftigungsgrad beträgt 40 % (ca. 17 Wochenstunden).",
      risk: "Rechtskonform",
      analysis: "Die Funktion und der Beschäftigungsgrad sind klar umschrieben. Eine solche Individualisierung entspricht arbeitsvertraglichen Vorgaben und schafft Transparenz.",
      lawReference: {
        text: "Kein spezifischer OR-Artikel verlangt diese Nennung explizit, jedoch entspricht dies OR Art. 319 Abs. 1 (Begriff und Abschluss des Einzelarbeitsvertrages: Verpflichtung zur Arbeitsleistung gegen Lohn).",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_319"
      },
      recommendation: "Keine Anpassung notwendig."
    },
    {
      id: "clause-3",
      title: "Arbeitszeit",
      text: "Die Arbeitszeit richtet sich nach den wöchentlich erstellten Einsatzplänen und kann werktags zwischen 06:00 und 20:00 Uhr erfolgen. Samstagseinsätze sind Bestandteil der regulären Planung.",
      risk: "Rechtskonform",
      analysis: "Die flexible Festlegung der Arbeitszeit gemäss Einsatzplan ist zulässig, sofern die gesetzlichen und allenfalls GAV-Arbeitszeitvorschriften eingehalten werden. Die täglichen Einsatzzeiten bewegen sich im rechtlich zulässigen Rahmen. Das Arbeitsgesetz (ArG) ist ebenfalls zu beachten (besonders betreffend Tages- und Abendarbeit).",
      lawReference: {
        text: "ArG Art. 10 Abs. 1: \"Die Tages- und Abendarbeit darf insgesamt 17 Stunden umfassen und frühestens um 6 Uhr beginnen und spätestens um 23 Uhr enden, dabei darf die tägliche Höchstarbeitszeit nicht überschritten werden.\" OR Art. 321d Abs. 1: \"Der Arbeitnehmer hat den Weisungen des Arbeitgebers hinsichtlich der Ausführung der Arbeit sowie Verhalten zu folgen, soweit ihm dies nach Treu und Glauben zugemutet werden kann.\"",
        link: "https://www.fedlex.admin.ch/eli/cc/1964/585_585_585/de#art_10"
      },
      recommendation: "Keine Anpassung notwendig, jedoch sollte auf die Details des GAV geachtet werden (z. B. genaue Regelungen zu Pausen, täglichen/wöchentlichen Höchstzeiten)."
    },
    {
      id: "clause-4",
      title: "Lohn und Zulagen",
      text: "Der monatliche Bruttolohn beträgt CHF 2'150.- (40 % Pensum). Es besteht Anspruch auf einen 13. Monatslohn, ausbezahlt anteilig im November. Zulagen für Abend- und Wochenendarbeit erfolgen gemäss GAV Migros separat.",
      risk: "Rechtskonform",
      analysis: "Die Lohnbestandteile sowie der zusätzliche Monatslohn sind transparent festgehalten. Der Anspruch auf Zulagen gemäss GAV ist gängig. Die Auszahlung des 13. Monatslohns anteilig ist zulässig, sofern dies so vereinbart ist.",
      lawReference: {
        text: "OR Art. 322 Abs. 1–2: \"Durch den Arbeitsvertrag verpflichtet sich der Arbeitgeber zur Entrichtung eines Lohnes an den Arbeitnehmer für die geleistete Arbeit.\" Ein 13. Monatslohn ist zulässig und praxisüblich, aber nicht zwingend, ausser explizit vereinbart. GAV Migros (anwendbar aufgrund Verweis in §9).",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_322"
      },
      recommendation: "Keine Anpassung erforderlich."
    },
    {
      id: "clause-5",
      title: "Ferien",
      text: "Der Mitarbeitende hat Anspruch auf 2 Tage bezahlte Ferien pro Jahr, anteilig bei Teilzeit. Ferienanträge sind frühzeitig mit der Filialleitung abzustimmen.",
      risk: "Rechtlich unzulässig",
      analysis: "Die Angabe von lediglich 2 Tagen Ferien pro Jahr verstösst gegen das zwingende Schweizer Recht. Gemäss OR beträgt der Mindestferienanspruch vier Wochen pro Jahr (bei Teilzeit anteilmässig!). Diese Klausel ist gesetzlich unzulässig.",
      lawReference: {
        text: "OR Art. 329a Abs. 1: \"Der Arbeitgeber hat dem Arbeitnehmer für jedes Dienstjahr wenigstens vier Wochen Ferien zu gewähren...\" GAV Migros könnte zusätzliche Ferienansprüche festlegen, aber nie weniger als das gesetzliche Minimum.",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_329a"
      },
      recommendation: "Klausel muss korrigiert werden: Mindestens vier Wochen Ferien pro Jahr (entsprechend Beschäftigungsgrad anteilmässig), GAV-Regelungen beachten."
    },
    {
      id: "clause-6",
      title: "Sozialversicherungen",
      text: "Es besteht Versicherungsschutz gemäss den gesetzlichen Bestimmungen: AHV, IV, EO, ALV, BVG und Unfallversicherung. Die Prämie für die Nichtberufsunfallversicherung (NBU) wird vom Mitarbeitenden getragen (Lohnabzug).",
      risk: "Rechtskonform",
      analysis: "Die Aufnahme der gesetzlichen Sozialversicherungen entspricht der gesetzlichen Verpflichtung. Die Prämie für die NBU darf gemäss UVG an den Arbeitnehmer weitergegeben werden.",
      lawReference: {
        text: "AHV/IV/EO/ALV/BVG: Obligatorisch nach den jeweiligen Gesetzen. UVG Art. 91 Abs. 1: \"Die Prämien der Versicherung gegen Nichtberufsunfälle gehen zu Lasten der Versicherten.\" OR Art. 324a (Lohnfortzahlung im Krankheitsfall).",
        link: "https://www.fedlex.admin.ch/eli/cc/1982/1676_1676_1676/de#art_91"
      },
      recommendation: "Keine Anpassung notwendig."
    },
    {
      id: "clause-7",
      title: "Krankheit und Unfall",
      text: "Bei Arbeitsverhinderung durch Krankheit oder Unfall erfolgt Lohnfortzahlung gemäss GAV Migros und Zürcher Skala. Die Migros Zürich schliesst für alle Mitarbeitenden eine KTG-Versicherung ab. Die Prämien werden zu 30 % vom Arbeitgeber getragen.",
      risk: "Rechtskonform",
      analysis: "Die Lohnfortzahlungspflicht im Krankheitsfall ist gesetzlich geregelt und wird hier durch GAV und Zürcher Skala konkretisiert. Die Teilübernahme der KTG-Prämien durch den Arbeitgeber ist zulässig. Alles korrekt.",
      lawReference: {
        text: "OR Art. 324a: \"Ist der Arbeitnehmer ohne eigenes Verschulden durch Krankheit oder Unfall an der Arbeitsleistung verhindert, so hat ihm der Arbeitgeber für eine beschränkte Zeit den Lohn zu entrichten.\" GAV Migros sowie ergänzend Zürcher Skala regeln die exakte Dauer der Lohnfortzahlung. VVG (Versicherungsvertragsgesetz) für KTG.",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_324a"
      },
      recommendation: "Keine Anpassung notwendig."
    },
    {
      id: "clause-8",
      title: "Kündigung",
      text: "Nach der Probezeit beträgt die Kündigungsfrist 2 Tage auf Monatsende. Die Kündigung hat schriftlich zu erfolgen.",
      risk: "Rechtlich unzulässig",
      analysis: "Die Kündigungsfrist nach der Probezeit weicht erheblich von den gesetzlichen Mindestfristen ab. Gemäss OR beträgt die Minimalfrist nach der Probezeit im ersten Dienstjahr einen Monat. Eine Frist von 2 Tagen ist nichtig und wird durch die Mindestfrist ersetzt.",
      lawReference: {
        text: "OR Art. 335c Abs. 1: \"Nach Ablauf der Probezeit kann das Arbeitsverhältnis unter Einhaltung folgender Fristen auf das Ende eines Monats gekündigt werden: während des ersten Dienstjahres: ein Monat...\" OR Art. 361: Zwingende Bestimmungen dürfen vertraglich nicht zu Ungunsten des Arbeitnehmers geändert werden.",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_335c"
      },
      recommendation: "Klausel muss zwingend angepasst werden: Nach der Probezeit mindestens 1 Monat Kündigungsfrist auf Monatsende."
    },
    {
      id: "clause-9",
      title: "Vertragsgrundlagen",
      text: "Dieser Arbeitsvertrag basiert auf dem Gesamtarbeitsvertrag (GAV) der Migros-Gruppe sowie dem Personalreglement der Genossenschaft Migros Zürich. Diese sind Bestandteil des Vertrages.",
      risk: "Rechtskonform",
      analysis: "Die Aufnahme von GAV und Personalreglement als Vertragsbestandteil ist zulässig und üblich, sofern diese tatsächlich angewendet werden und dem Arbeitnehmer zugänglich sind.",
      lawReference: {
        text: "OR Art. 360a: \"Gesamtarbeitsverträge können für allgemeinverbindlich erklärt werden.\" OR Art. 322: Verweis auf andere Rechtsquellen zulässig, sofern diese zugänglich sind.",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_360a"
      },
      recommendation: "Keine Anpassung notwendig; sicherstellen, dass Mitarbeitende Zugang zu GAV und Reglement haben."
    },
    {
      id: "clause-10",
      title: "Schlussbestimmungen",
      text: "Änderungen oder Ergänzungen bedürfen der Schriftform und der Zustimmung beider Parteien.",
      risk: "Rechtskonform",
      analysis: "Diese Formulierung ist zulässig und entspricht den allgemeinen Vertragsprinzipien. Allerdings können zwingende gesetzliche Regelungen nicht durch eine Schriftformklausel abbedungen werden.",
      lawReference: {
        text: "OR Art. 16: Schriftliche Form kann für Änderungen vereinbart werden. Zwingende Bestimmungen bleiben unberührt.",
        link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_16"
      },
      recommendation: "Keine Anpassung erforderlich. Hinweis für praktische Anwendung: Schriftformklausel ist sinnvoll, ersetzt aber keine zwingenden gesetzlichen Vorschriften."
    }
  ],
  overallRisk: "Rechtlich fraglich",
  summary: "Der analysierte Arbeitsvertrag enthält 10 Klauseln, von denen 2 als rechtlich unzulässig und 8 als rechtskonform eingestuft wurden. Die kritischsten Punkte betreffen die Ferienregelung (nur 2 Tage pro Jahr statt gesetzlich geforderter 4 Wochen) und die Kündigungsfrist (2 Tage statt gesetzlich geforderter 1 Monat nach Probezeit). Diese Klauseln verstoßen gegen zwingendes Schweizer Recht und müssen korrigiert werden."
};

const DemoAnalysis: React.FC = () => {
  const toast = useToast();
  const [demoMarkdownOutput, setDemoMarkdownOutput] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Generate a markdown representation of the demo analysis for testing MarkdownRenderer
    const generateMarkdown = () => {
      let markdownContent = `# Vertragsanalyse\n\n`;
      markdownContent += `## Zusammenfassung\n${demoAnalysisData.summary}\n\n`;
      
      demoAnalysisData.clauses.forEach(clause => {
        markdownContent += `## ${clause.title}\n\n`;
        markdownContent += `**Klauseltext**\n${clause.text}\n\n`;
        markdownContent += `**Analyse**\n${clause.analysis}\n\n`;
        markdownContent += `**Risiko-Einstufung**\n${clause.risk}\n\n`;
        markdownContent += `**Gesetzliche Referenz**\n${clause.lawReference.text}\n\n`;
        if (clause.recommendation) {
          markdownContent += `**Empfehlung**\n${clause.recommendation}\n\n`;
        }
      });
      
      return markdownContent;
    };
    
    setDemoMarkdownOutput(generateMarkdown());
    setHasLoaded(true);
  }, []);

  // Function to handle PDF download
  const downloadFullAnalysisPDF = async () => {
    try {
      await generatePDF(demoAnalysisData, 'demo_vertragsklar.pdf', toast);
    } catch (error) {
      console.error("Fehler beim PDF-Export:", error);
      toast.toast({
        title: "Fehler beim PDF-Export",
        description: "Beim Erstellen der PDF ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnalysisLayout>
      <AnalysisHeader 
        structuredResult={demoAnalysisData} 
        onDownloadPDF={downloadFullAnalysisPDF}
      />
      
      <AnalysisContent 
        analysisOutput={demoMarkdownOutput}
        structuredResult={demoAnalysisData}
        hasContent={hasLoaded}
      />
      
      <AnalysisFooter 
        hasContent={hasLoaded}
        structuredResult={demoAnalysisData}
        onDownloadPDF={downloadFullAnalysisPDF}
      />
    </AnalysisLayout>
  );
};

export default DemoAnalysis;
