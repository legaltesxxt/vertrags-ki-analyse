
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import AnalysisHeader from '@/components/analysis/AnalysisHeader';
import AnalysisContent from '@/components/analysis/AnalysisContent';
import AnalysisFooter from '@/components/analysis/AnalysisFooter';
import { generatePDF } from '@/utils/pdfUtils';
import { AnalysisResult } from '@/types/analysisTypes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, PlusCircle } from 'lucide-react';

// Empty initial state for the demo analysis
const emptyAnalysisData: AnalysisResult = {
  clauses: [],
  overallRisk: 'Rechtskonform',
  summary: ''
};

// Arbeitsvertrag demo data (parsed from provided JSON)
const arbeitsvertragDemo: AnalysisResult = {
  clauses: [
    {
      id: "clause-1",
      title: "Vertragsparteien",
      text: "Arbeitgeber: MusterBau GmbH, Werkstrasse 12, 8048 Zürich. Arbeitnehmer: Herr Jonas Meier, Bahnweg 34, 3600 Thun.",
      risk: "Rechtskonform",
      analysis: "Die Vertragsparteien werden klar und vollständig genannt. Damit ist eindeutig, wer Arbeitnehmer und wer Arbeitgeber ist. Dies entspricht der gesetzlichen Grundlage des Arbeitsvertrags, nach der sich die beiden Parteien gegenseitig zum Arbeits- bzw. zur Lohnzahlung verpflichten.",
      lawReference: {
        text: "OR Art. 319 Abs. 1: Durch den Einzelarbeitsvertrag verpflichtet sich der Arbeitnehmer zur Leistung von Arbeit im Dienste des Arbeitgebers und dieser zur Entrichtung eines Lohnes.",
        link: ""
      },
      recommendation: "Es besteht kein Handlungsbedarf. Diese Angabe ist formell notwendig und korrekt umgesetzt."
    },
    {
      id: "clause-2",
      title: "Stellenbezeichnung und Arbeitsort",
      text: "Jonas Meier wird als Bauarbeiter im Bereich Hochbau beschäftigt. Arbeitsort: Zürich und wechselnde Baustellen in der Region.",
      risk: "Rechtskonform",
      analysis: "Die Funktion und der Arbeitsort werden klar genannt. Gemäss Gesetz ist es erforderlich, diese Informationen schriftlich innerhalb eines Monats bereitzustellen. Die Möglichkeit wechselnder Arbeitsorte entspricht den Gepflogenheiten im Baugewerbe, da Baustellen naturgemäss wechseln. Die Klausel ist mit den gesetzlichen Vorgaben vereinbar.",
      lawReference: {
        text: "OR Art. 319 Abs. 2: Der Vertrag kann formlos abgeschlossen werden, soweit das Gesetz keine besondere Form vorschreibt.\nOR Art. 330b Abs. 1 lit. a/b: Der Arbeitgeber muss dem Arbeitnehmer spätestens einen Monat nach Beginn des Arbeitsverhältnisses die wesentlichen Vertragsbedingungen schriftlich mitteilen, insbesondere: a. Namen der Vertragsparteien; b. Datum des Beginns des Arbeitsverhältnisses; c. Funktion des Arbeitnehmers;",
        link: ""
      },
      recommendation: "Die Bestimmung ist klar und entspricht den gesetzlichen Anforderungen. Es ist kein Handlungsbedarf gegeben."
    },
    {
      id: "clause-3",
      title: "Arbeitsbeginn und Dauer",
      text: "Beginn: 1. Juni 2025. Unbefristetes Arbeitsverhältnis mit einer Kündigungsfrist von 1 Monat auf Monatsende.",
      risk: "Rechtskonform",
      analysis: "Die Klausel beschreibt eindeutig das Anstellungsverhältnis als unbefristet und gibt den Arbeitsbeginn sowie eine zulässige Kündigungsfrist an. Laut Gesetz sind die im Vertrag gewählten Fristen im Einklang mit den Mindestvorgaben. Auch die Erfüllung der schriftlichen Mitteilungspflicht ist sichergestellt.",
      lawReference: {
        text: "OR Art. 334 ff.: Bestimmungen über befristetes und unbefristetes Arbeitsverhältnis.\nOR Art. 335a: Das unbefristete Arbeitsverhältnis kann von beiden Parteien gekündigt werden.\nOR Art. 335c Abs. 1 lit. a: Nach Ablauf der Probezeit kann das Arbeitsverhältnis im ersten Dienstjahr mit einer Frist von einem Monat auf das Ende eines Monats gekündigt werden.\nOR Art. 330b Abs. 1 lit. c/d: Der Arbeitgeber muss dem Arbeitnehmer unter anderem das Datum des Beginns des Arbeitsverhältnisses und die Kündigungsfristen schriftlich mitteilen.",
        link: ""
      },
      recommendation: "Die Angaben sind gesetzeskonform. Kein weiterer Schritt nötig."
    },
    {
      id: "clause-4",
      title: "Arbeitszeit",
      text: "42 Stunden pro Woche, Montag bis Freitag. Überstunden sind bis zu 20 Stunden pro Woche ohne zusätzlichen Lohn zu leisten.",
      risk: "Rechtlich fraglich",
      analysis: "Die wöchentliche Arbeitszeit von 42 Stunden ist zulässig. Problematisch und rechtlich fragwürdig ist jedoch die Verpflichtung, bis zu 20 Überstunden pro Woche ohne zusätzlichen Lohn zu leisten. Gemäss OR Art. 321c ist die Leistung von Überstunden grundsätzlich vergütungspflichtig, es sei denn, es wurde schriftlich etwas anderes vereinbart. Allerdings erscheint die Verpflichtung zu 20 Überstunden pro Woche ohne jeglichen Ausgleich (weder Freizeit noch Lohnzuschlag) als übermässig und in der Praxis kaum durchsetzbar, auch wenn eine schriftliche Vereinbarung vorliegen sollte. Zudem ist die Höchstarbeitszeit von Bauarbeitern (regulär 50 Stunden pro Woche) nicht überschritten, solange nicht dauerhaft Überstunden in diesem Ausmass verlangt werden.",
      lawReference: {
        text: "OR Art. 321c: Der Arbeitnehmer ist verpflichtet, über die vereinbarte Arbeitszeit hinaus Arbeit zu leisten, soweit ihm dies nach Treu und Glauben zugemutet werden kann. Für Überstundenarbeit ist Ersatz durch Freizeit von gleichem Umfang zu gewähren, soweit nichts anderes schriftlich vereinbart oder üblich ist. Wo weder Ersatz durch Freizeit noch eine besondere schriftliche Vereinbarung getroffen ist, hat der Arbeitgeber für die Überstundenarbeit einen Lohnzuschlag von mindestens einem Viertel zu entrichten.\nArG Art. 9: Die wöchentliche Höchstarbeitszeit beträgt für Arbeitnehmer in industriellen Betrieben 45 Stunden, für andere Arbeitnehmer – insbesondere im Baugewerbe – 50 Stunden.",
        link: ""
      },
      recommendation: "Die Überstundenregelung sollte angepasst werden. Empfehlenswert ist eine Begrenzung der Überstundenpflicht ohne Zusatzkompensation auf ein branchenübliches Mass (z.B. kleinere Anzahl Stunden pro Woche oder nur in Ausnahmefällen), oder der Vermerk, dass Überstunden grundsätzlich mit Lohnzuschlag oder Freizeit kompensiert werden. Sonst besteht das Risiko von Anfechtbarkeit und Unwirksamkeit dieser Regelung. Eine professionelle Rechtsberatung ist hier allerdings nur bei Durchsetzungsproblemen notwendig."
    },
    {
      id: "clause-5",
      title: "Lohn",
      text: "Monatslohn brutto: CHF 5'200.–. 13. Monatslohn: Ja, ausbezahlt im Dezember. Spesen: CHF 100.– pauschal pro Monat.",
      risk: "Rechtskonform",
      analysis: "Die Klausel stellt den Lohn, den 13. Monatslohn sowie die Spesen klar dar. Der Lohn entspricht den gesetzlichen Anforderungen. Mit der expliziten Erwähnung eines fixen 13. Monatslohns und einer pauschalen Spesenentschädigung verstösst die Klausel nicht gegen geltendes Recht, sofern die Spesenpauschale die notwendigen Ausgaben deckt. Dies sollte durch die tatsächlichen Auslagen abgestützt sein, ansonsten kann der Arbeitnehmer Nachforderungen stellen.",
      lawReference: {
        text: "OR Art. 322: Der Arbeitgeber hat dem Arbeitnehmer den vereinbarten oder üblichen Lohn zu entrichten.\nOR Art. 322d: Der Arbeitnehmer hat Anspruch auf Ersatz aller durch die Ausführung der Arbeit notwendiger Auslagen.\nOR Art. 322a: Nebst dem Lohn kann vertraglich ein Anteil am Ergebnis einer Geschäftstätigkeit, wie Provision, Umsatzbeteiligung, oder Gratifikationen vereinbart werden.",
        link: ""
      },
      recommendation: "Keine Massnahmen erforderlich, sofern die Spesenpauschale in der Praxis die effektiven Kosten abdeckt. Sonst sollte sie überprüft und angepasst werden."
    },
    {
      id: "clause-6",
      title: "Ferien",
      text: "4 Wochen Ferien pro Jahr. Ferien dürfen nicht kumuliert und müssen im laufenden Jahr bezogen werden.",
      risk: "Rechtskonform",
      analysis: "Vier Wochen Ferien entsprechen der gesetzlichen Mindestanforderung für Arbeitnehmende ab 20 Jahren. Die Regelung, dass Ferien nicht kumuliert werden dürfen, d.h. jeweils im laufenden Jahr zu beziehen sind, ist grundsätzlich erlaubt. Allerdings kann ein unverschuldeter Nichtbezug (z.B. Krankheit während der Ferien oder betriebliche Gründe) zu einem Übertrag ins Folgejahr führen müssen.",
      lawReference: {
        text: "OR Art. 329a: Der Arbeitgeber hat dem Arbeitnehmer jährlich wenigstens vier Wochen Ferien, dem Arbeitnehmer bis zum vollendeten 20. Altersjahr wenigstens fünf Wochen zu gewähren.\nOR Art. 329c Abs. 1: Der Arbeitgeber bestimmt den Zeitpunkt der Ferien unter Rücksichtnahme auf die Wünsche des Arbeitnehmers; er muss mindestens zwei Wochen zusammenhängende Ferien pro Jahr gewähren.",
        link: ""
      },
      recommendation: "Der Zusatz \"nicht kumuliert\" ist rechtlich in Ordnung, sollte aber flexibel gehandhabt werden bei Krankheit oder dringenden betrieblichen Gründen. Ggf. klarstellen, dass der Übertrag ins Folgejahr zulässig ist, wenn der Arbeitnehmer die Ferien nicht verschuldet bezogen hat."
    },
    {
      id: "clause-7",
      title: "Krankheitsfall",
      text: "Lohnfortzahlung im Krankheitsfall gemäss gesetzlicher Regelung.",
      risk: "Rechtskonform",
      analysis: "Diese Klausel verweist direkt auf die gesetzlichen Vorschriften und ist daher korrekt. Die Pflicht des Arbeitgebers zur Lohnfortzahlung im Krankheitsfall ergibt sich aus dem Gesetz, die genaue Dauer richtet sich nach Dienstjahren und geltender Skala.",
      lawReference: {
        text: "OR Art. 324a: Ist der Arbeitnehmer ohne eigenes Verschulden durch Krankheit, Unfall, Erfüllung gesetzlicher Pflichten oder Ausübung eines öffentlichen Amtes an der Arbeitsleistung verhindert, hat der Arbeitgeber ihm für eine beschränkte Zeit den Lohn zu entrichten.",
        link: ""
      },
      recommendation: "Keine Änderungen nötig."
    },
    {
      id: "clause-8",
      title: "Konkurrenzverbot",
      text: "Dem Arbeitnehmer ist es untersagt, während 2 Jahren nach Beendigung des Arbeitsverhältnisses im Kanton Zürich in der Baubranche tätig zu sein.",
      risk: "Rechtlich fraglich",
      analysis: "Das Konkurrenzverbot ist schriftlich und bezieht sich auf eine bestimmte Branche, Region und Laufzeit (2 Jahre im Kanton Zürich). Gemäss Gesetz ist ein Konkurrenzverbot zulässig, muss aber in Ort, Zeit und Gegenstand auf das Notwendige beschränkt sein. Ohne zusätzlichen Kontext (z.B. Einblick in Geschäftsgeheimnisse, konkrete Marktstellung) erscheint ein striktes zweijähriges Branchenverbot im ganzen Kanton Zürich als relativ weit gefasst und könnte im Streitfall vom Gericht teilweise reduziert werden.",
      lawReference: {
        text: "OR Art. 340 Abs. 1-3: Der Arbeitnehmer kann sich schriftlich verpflichten, nach Beendigung des Arbeitsverhältnisses sich der Konkurrenz des Arbeitgebers zu enthalten, sofern er Einblick in den Kundenkreis oder in Fabrikations- oder Geschäftsgeheimnisse hatte. Das Konkurrenzverbot muss schriftlich vereinbart werden und angemessen bezüglich Ort, Zeit und Gegenstand sein.\nOR Art. 340a: Das Konkurrenzverbot ist in seinem Umfang nach Zeit, Ort und Gegenstand so zu beschränken, als es zur Wahrung der berechtigten Interessen des Arbeitgebers notwendig ist. Ist das Verbot übermässig, kann es richterlich angemessen herabgesetzt werden.",
        link: ""
      },
      recommendation: "Überprüfen, ob der Arbeitnehmer tatsächlich Zugang zu sensiblen Informationen hatte und das Konkurrenzverbot in Zeit und geografischer Ausdehnung wirklich notwendig ist. Ggf. Einschränkungen (kürzere Dauer, engerer Geltungsbereich) vornehmen, um die Klausel im Streitfall abzusichern."
    },
    {
      id: "clause-9",
      title: "Vertraulichkeit",
      text: "Der Arbeitnehmer verpflichtet sich zur absoluten Vertraulichkeit über alle geschäftlichen Angelegenheiten.",
      risk: "Rechtskonform",
      analysis: "Die Regelung zur Vertraulichkeit entspricht dem Gesetz – das Schweizer Obligationenrecht fordert Stillschweigen über Geschäfts- und Betriebsgeheimnisse auch für die Zeit nach Beendigung des Arbeitsverhältnisses. Die Verpflichtung zur \"absoluten\" Vertraulichkeit ist zulässig, bezieht sich in der Praxis aber nur auf relevante Geschäfts- und Betriebsgeheimnisse.",
      lawReference: {
        text: "OR Art. 321a Abs. 4: Der Arbeitnehmer hat über Geschäfts- und Betriebsgeheimnisse, deren Geheimhaltung aus der Natur der Sache oder nach besonderer Weisung im Interesse des Arbeitgebers geboten ist, auch nach Beendigung des Arbeitsverhältnisses Stillschweigen zu wahren.",
        link: ""
      },
      recommendation: "Die Klausel ist rechtssicher. Es empfiehlt sich, in der Praxis nur tatsächlich vertrauliche Informationen als solche zu behandeln."
    },
    {
      id: "clause-10",
      title: "Gerichtsstand",
      text: "Gerichtsstand ist Zürich. Es gilt Schweizer Recht.",
      risk: "Rechtskonform",
      analysis: "Gemäss Zivilprozessordnung können Arbeitnehmer (und Arbeitgeber) wählen, Prozesse am Wohnsitz/Sitz einer Partei zu führen. Die Klausel ist grundsätzlich zulässig, aber Mitarbeiter können trotz dieser Klausel klagen, wo ihr eigener Wohnsitz ist. Die Rechtswahl \"Schweizer Recht\" ist erlaubt und üblich.",
      lawReference: {
        text: "ZPO Art. 34 Abs. 1: Klagen aus dem Arbeitsverhältnis können am Wohnsitz oder Sitz einer Partei erhoben werden.\nIPRG Art. 121: Die Arbeitsverträge unterliegen dem von den Parteien gewählten Recht.",
        link: ""
      },
      recommendation: "Die Klausel kann so stehenbleiben. Es sollte jedoch darauf hingewiesen werden, dass der gesetzliche Gerichtsstand durch den Arbeitnehmer nicht zu dessen Nachteil eingeschränkt werden kann."
    },
    {
      id: "clause-11",
      title: "Schlussbestimmungen",
      text: "Änderungen bedürfen der Schriftform. Sollten einzelne Bestimmungen ungültig sein, bleibt der Rest wirksam.",
      risk: "Rechtskonform",
      analysis: "Die Schriftformklausel entspricht den üblichen Anforderungen und ist mit Gesetz vereinbar, solange kein Zwang zur Schriftform besteht, wo das Gesetz keine vorschreibt. Die salvatorische Klausel ist ebenso gesetzeskonform: Bei Teilnichtigkeit bleibt der Vertrag im Übrigen gültig.",
      lawReference: {
        text: "OR Art. 16: Ist für den Abschluss eines Vertrages durch Gesetz oder Vereinbarung eine besondere Form vorgeschrieben, so ist der Vertrag nur in dieser Form gültig.\nOR Art. 20 Abs. 2: Ist nur ein Teil des Vertrages nichtig, so bleibt der Vertrag im übrigen verbindlich, sofern nicht anzunehmen ist, dass er ohne den nichtigen Teil nicht geschlossen worden wäre.",
        link: ""
      },
      recommendation: "Klausel entspricht dem Standard und kann so belassen werden."
    }
  ],
  overallRisk: "Rechtlich fraglich",
  summary: "Es wurden 11 Klauseln analysiert. 2 Klauseln wurden als rechtlich fraglich eingestuft. Diese betreffen die Überstundenregelung und das Konkurrenzverbot. Die übrigen 9 Klauseln sind rechtskonform."
};

const DemoAnalysis: React.FC = () => {
  const toast = useToast();
  const [currentTab, setCurrentTab] = useState<string>("arbeitsvertrag");
  const [demoAnalysisData, setDemoAnalysisData] = useState<AnalysisResult>(arbeitsvertragDemo);
  const [demoMarkdownOutput, setDemoMarkdownOutput] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Set up the page with the pre-loaded Arbeitsvertrag data
    setHasLoaded(true);
    generateMarkdownOutput(arbeitsvertragDemo);
  }, []);

  // Function to generate markdown from analysis data
  const generateMarkdownOutput = (data: AnalysisResult) => {
    let markdownContent = `# ${currentTab === "arbeitsvertrag" ? "Arbeitsvertrag" : "Vertragsanalyse"}\n\n`;
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
  const updateAnalysisData = (newData: AnalysisResult) => {
    setDemoAnalysisData(newData);
    generateMarkdownOutput(newData);
  };

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === "arbeitsvertrag") {
      updateAnalysisData(arbeitsvertragDemo);
    } else {
      // Set empty data for the placeholder tab
      updateAnalysisData(emptyAnalysisData);
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
      const filename = currentTab === "arbeitsvertrag" 
        ? 'arbeitsvertrag_demo_analyse.pdf' 
        : 'demo_vertragsklar.pdf';
        
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

  return (
    <AnalysisLayout>
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-sm text-amber-800">
          <strong>Demo-Analyse:</strong> Diese Seite zeigt Beispiel-Analysen. Sie können zwischen verschiedenen Demo-Analysen wechseln.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full mb-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="arbeitsvertrag" className="flex items-center gap-2">
            <FileText size={16} />
            Arbeitsvertrag
          </TabsTrigger>
          <TabsTrigger value="zweiteAnalyse" className="flex items-center gap-2">
            <PlusCircle size={16} />
            Zweite Demo-Analyse
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {currentTab === "arbeitsvertrag" ? (
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
      ) : (
        <div className="mt-8 p-8 bg-white rounded-xl shadow-sm border border-slate-200/50">
          <div className="text-center p-10">
            <h2 className="text-2xl font-medium text-slate-800 mb-4">Zweite Demo-Analyse</h2>
            <p className="text-slate-500">
              Hier wird die zweite Demo-Analyse erscheinen. Im nächsten Schritt können Sie die JSON-Ausgabe für diese Analyse bereitstellen.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => handleTabChange("arbeitsvertrag")}>
                Zurück zur Arbeitsvertrag-Analyse
              </Button>
            </div>
          </div>
        </div>
      )}
    </AnalysisLayout>
  );
};

export default DemoAnalysis;
