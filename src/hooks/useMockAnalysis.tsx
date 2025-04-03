
import { useState, useEffect } from 'react';

// Mock-Daten für die Vertragsanalyse
const mockClauses = [
  {
    id: "clause-1",
    title: "Vertragslaufzeit und Kündigung",
    text: "Der Vertrag hat eine Mindestlaufzeit von 24 Monaten und verlängert sich automatisch um weitere 12 Monate, wenn er nicht mit einer Frist von 3 Monaten zum Ende der Laufzeit gekündigt wird.",
    risk: "mittel" as const,
    analysis: "Die automatische Verlängerung um 12 Monate mit einer 3-monatigen Kündigungsfrist kann problematisch sein, da sie den Kunden länger bindet als nach Schweizer Recht üblich.",
    lawReference: {
      text: "Nach Art. 266a OR beträgt die Kündigungsfrist bei unbefristeten Vertragsverhältnissen in der Regel drei Monate, sofern nichts anderes vereinbart wurde.",
      link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_266_a"
    },
    recommendation: "Die automatische Verlängerung sollte auf maximal 6 Monate reduziert werden. Alternativ könnte eine stillschweigende Umwandlung in ein unbefristetes Vertragsverhältnis mit monatlicher Kündigungsfrist vereinbart werden."
  },
  {
    id: "clause-2",
    title: "Haftungsbeschränkung",
    text: "Der Anbieter haftet nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung für leichte Fahrlässigkeit, mittelbare Schäden, Folgeschäden und entgangenen Gewinn ist ausgeschlossen.",
    risk: "hoch" as const,
    analysis: "Diese weitreichende Haftungsbeschränkung könnte nach Schweizer Recht unwirksam sein, insbesondere der vollständige Ausschluss der Haftung für leichte Fahrlässigkeit.",
    lawReference: {
      text: "Nach Art. 100 OR kann eine Vereinbarung, wonach die Haftung für rechtswidrige Absicht oder grobe Fahrlässigkeit ausgeschlossen wird, nicht geltend gemacht werden.",
      link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_100"
    },
    recommendation: "Die Haftungsbeschränkung sollte modifiziert werden, um zumindest für Kardinalpflichten und Personenschäden auch bei leichter Fahrlässigkeit zu haften."
  },
  {
    id: "clause-3",
    title: "Gerichtsstand",
    text: "Ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Frankfurt am Main, Deutschland.",
    risk: "hoch" as const,
    analysis: "Die Festlegung eines ausländischen Gerichtsstands könnte für Schweizer Konsumenten problematisch sein und gegen zwingendes Recht verstoßen.",
    lawReference: {
      text: "Nach Art. 35 der Schweizerischen Zivilprozessordnung (ZPO) ist für Klagen aus Konsumentenverträgen das Gericht am Wohnsitz oder Sitz einer der Parteien zuständig.",
      link: "https://www.fedlex.admin.ch/eli/cc/2010/262/de#art_35"
    },
    recommendation: "Der Gerichtsstand sollte auf einen Ort in der Schweiz geändert werden oder alternativ der gesetzliche Gerichtsstand vorgesehen werden."
  },
  {
    id: "clause-4",
    title: "Datenschutz",
    text: "Der Kunde stimmt der Verarbeitung seiner personenbezogenen Daten zu allen Zwecken zu, die mit der Vertragsabwicklung in Zusammenhang stehen.",
    risk: "mittel" as const,
    analysis: "Diese sehr allgemeine Datenschutzklausel entspricht nicht den Anforderungen des Schweizer Datenschutzgesetzes, das eine spezifischere Einwilligung erfordert.",
    lawReference: {
      text: "Nach Art. 6 des Schweizer Datenschutzgesetzes (DSG) dürfen Personendaten nur zu dem Zweck bearbeitet werden, der bei der Beschaffung angegeben wurde, aus den Umständen ersichtlich oder gesetzlich vorgesehen ist.",
      link: "https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/de#art_6"
    },
    recommendation: "Die Datenschutzklausel sollte konkretisiert werden, indem die Zwecke der Datenverarbeitung genau spezifiziert werden."
  },
  {
    id: "clause-5",
    title: "Zahlungsbedingungen",
    text: "Die Zahlung erfolgt jährlich im Voraus. Bei Zahlungsverzug werden Verzugszinsen in Höhe von 12% p.a. sowie eine Mahngebühr von CHF 50 pro Mahnung fällig.",
    risk: "mittel" as const,
    analysis: "Die hohen Verzugszinsen und Mahngebühren könnten nach Schweizer Recht als überhöht angesehen werden.",
    lawReference: {
      text: "Nach Art. 104 OR beträgt der gesetzliche Verzugszins 5%. Höhere Verzugszinsen können vereinbart werden, müssen aber angemessen sein.",
      link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_104"
    },
    recommendation: "Die Verzugszinsen sollten auf maximal 10% reduziert werden und die Mahngebühr auf höchstens CHF 20-30 pro Mahnung."
  },
  {
    id: "clause-6",
    title: "Anwendbares Recht",
    text: "Auf diesen Vertrag findet deutsches Recht Anwendung.",
    risk: "hoch" as const,
    analysis: "Die Anwendung von deutschem Recht kann für Schweizer Verträge problematisch sein, insbesondere wenn es sich um Konsumentenverträge handelt.",
    lawReference: {
      text: "Nach Art. 120 des Schweizer IPRG (Internationales Privatrecht) kann bei Konsumentenverträgen die Rechtswahl nicht dazu führen, dass dem Verbraucher der Schutz entzogen wird, der ihm durch zwingende Bestimmungen des Rechts des Staates gewährt wird, in dem er seinen gewöhnlichen Aufenthalt hat.",
      link: "https://www.fedlex.admin.ch/eli/cc/1988/1776_1776_1776/de#art_120"
    },
    recommendation: "Das anwendbare Recht sollte auf Schweizer Recht geändert werden, insbesondere wenn der Vertrag mit Schweizer Kunden geschlossen wird."
  },
  {
    id: "clause-7",
    title: "Schriftformerfordernis",
    text: "Änderungen und Ergänzungen des Vertrages bedürfen der Schriftform. Dies gilt auch für die Änderung dieser Schriftformklausel.",
    risk: "niedrig" as const,
    analysis: "Die Schriftformklausel ist grundsätzlich gültig, könnte aber in bestimmten Situationen unwirksam sein, wenn auf elektronische Kommunikation verzichtet wird.",
    lawReference: {
      text: "Nach Art. 16 OR ist die gesetzlich vorgeschriebene Schriftform durch Unterschrift erfüllt. Im modernen Geschäftsverkehr werden aber auch andere Formen der Kommunikation anerkannt.",
      link: "https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_16"
    },
    recommendation: "Die Schriftformklausel sollte ergänzt werden, um klar zu stellen, dass auch elektronische Kommunikationsmittel (E-Mail, Online-Portale) genutzt werden können."
  }
];

export function useMockAnalysis() {
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    clauses: typeof mockClauses;
    overallRisk: 'niedrig' | 'mittel' | 'hoch';
    summary: string;
  } | null>(null);

  // Simuliert den Analyseprozess
  const startAnalysis = (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResult(null);
    
    // Fortschritt simulieren
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Analyse-Ergebnis nach Abschluss setzen
          setTimeout(() => {
            setAnalysisResult({
              clauses: mockClauses,
              overallRisk: 'mittel',
              summary: `Der analysierte Vertrag enthält ${mockClauses.length} Klauseln, von denen ${mockClauses.filter(c => c.risk === 'hoch').length} als hohes Risiko, ${mockClauses.filter(c => c.risk === 'mittel').length} als mittleres Risiko und ${mockClauses.filter(c => c.risk === 'niedrig').length} als niedriges Risiko eingestuft wurden. Die kritischsten Punkte betreffen die Gerichtsstandsklausel, das anwendbare Recht und die Haftungsbeschränkungen. Es wird empfohlen, diese Klauseln zu überarbeiten, um die Übereinstimmung mit Schweizer Recht zu gewährleisten.`
            });
            setIsAnalyzing(false);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const resetAnalysis = () => {
    setIsAnalyzing(false);
    setProgress(0);
    setAnalysisResult(null);
  };

  return { startAnalysis, resetAnalysis, isAnalyzing, progress, analysisResult };
}
