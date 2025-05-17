
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
import { FileText, Home } from 'lucide-react';

// Empty initial state for the demo analysis
const emptyAnalysisData: AnalysisResult = {
  clauses: [],
  overallRisk: 'Rechtskonform',
  summary: ''
};

// Arbeitsvertrag demo data
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

// Mietvertrag demo data (parsed from provided JSON)
const mietvertragDemo: AnalysisResult = {
  clauses: [
    {
      id: "clause-1",
      title: "Vertragsparteien",
      text: "Vertragsparteien Vermieter(in): Herr Stefan Frei Frei Immobilien AG Bahnhofstrasse 10 8001 Zürich Mieter(in): Herr Luca Schmid Wiesenweg 45 3074 Muri bei Bern",
      risk: "Rechtskonform",
      analysis: "In dieser Klausel werden die Vermieter- und Mieterdaten samt Adressen vollständig aufgeführt. Das ist notwendig für die klare Zuordnung und Identität der Vertragspartner. Sie entspricht dem Zweck eines Mietvertrags gemäss OR Art. 253, nach welchem sich der Vermieter verpflichtet, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter dafür einen Mietzins zu leisten.",
      lawReference: {
        text: "OR Art. 253: Durch den Mietvertrag verpflichtet sich der Vermieter, dem Mieter eine Sache zum Gebrauch zu überlassen, und der Mieter, dem Vermieter dafür einen Mietzins zu leisten.",
        link: ""
      },
      recommendation: "Die Angabe der Vertragsparteien ist korrekt und vollständig. Es besteht kein Anpassungsbedarf. Nächster Schritt: Keine weitere Massnahme nötig."
    },
    {
      id: "clause-2",
      title: "Mietobjekt",
      text: "Mietobjekt 4-Zimmer-Wohnung, 3. Obergeschoss, Top Nr. 12 Waldstrasse 56, 3012 Bern Kellerabteil Nr. K12, 1 Tiefgaragenplatz Nr. 21",
      risk: "Rechtskonform",
      analysis: "Das Mietobjekt wird umfassend bestimmt: Anzahl Zimmer, Lage, Adresse sowie Nebenräume und Parkplatz werden konkret erwähnt. Die Schriftform ist laut OR Art. 255 dann erforderlich, wenn sie eine Partei verlangt. Die genaue Beschreibung schafft Rechtssicherheit über den Mietgegenstand.",
      lawReference: {
        text: "OR Art. 255: Der Mietvertrag muss, wenn er für Wohn- oder Geschäftsräume abgeschlossen wird, schriftlich abgefasst sein, wenn ihn eine Partei verlangt.",
        link: ""
      },
      recommendation: "Das Mietobjekt ist klar und nachvollziehbar definiert. Keine Anpassung erforderlich."
    },
    {
      id: "clause-3",
      title: "Mietdauer",
      text: "Mietdauer Beginn: 1. September 2025 Unbefristetes Mietverhältnis mit einer ordentlichen Kündigungsfrist von 6 Monaten auf Ende jedes Quartals.",
      risk: "Rechtskonform",
      analysis: "Das Mietverhältnis ist unbefristet, was grundsätzlich gemäss OR Art. 255 zulässig ist. Die gesetzliche Kündigungsfrist für Wohnräume beträgt nach OR Art. 266c allerdings drei Monate, sofern nicht etwas anderes vereinbart oder ortsüblich ist. Hier wird eine längere Kündigungsfrist (6 Monate) festgelegt, was vertraglich erlaubt ist. Allerdings könnte dies für den Mieter eine nachteilige Regelung darstellen. Eine solche Verlängerung ist rechtlich zulässig, solange keine missbräuchliche Benachteiligung vorliegt.",
      lawReference: {
        text: "OR Art. 255: Wird nichts anderes vereinbart, so ist der Mietvertrag auf unbestimmte Zeit geschlossen.\nOR Art. 266a: Ein auf unbestimmte Zeit abgeschlossenes Mietverhältnis kann von jeder Partei unter Einhaltung der gesetzlichen oder vertraglich vereinbarten Fristen gekündigt werden.\nOR Art. 266c: Die Kündigungsfrist für Wohnräume beträgt drei Monate, sofern nicht etwas anderes vereinbart oder ortsüblich ist.",
        link: ""
      },
      recommendation: "Der Vertrag ist diesbezüglich rechtsgültig, da schriftlich eine andere als die gesetzliche Kündigungsfrist vereinbart wurde. Mieter sollten sich allerdings der längeren Bindungsdauer bewusst sein. Ggf. mit dem Vermieter über flexiblere Kündigungsmodalitäten sprechen, falls dies gewünscht wird."
    },
    {
      id: "clause-4",
      title: "Mietzins und Nebenkosten",
      text: "Mietzins und Nebenkosten Nettomietzins Wohnung: CHF 2'500.– Garagenplatz: CHF 250.– Akonto Nebenkosten: CHF 300.– Total monatlich zahlbar: CHF 3'050.– Zahlbar bis spätestens am 5. Werktag eines jeden Monats.",
      risk: "Rechtskonform",
      analysis: "Der Gesamtbetrag ist klar aufgeschlüsselt (Miete, Garagenplatz, Nebenkosten) und die Zahlungsfrist ist präzise angegeben. Laut OR Art. 257 sind Nebenkosten zu bezahlen, wenn sie verabredet oder ortsüblich sind. OR Art. 266b regelt die Fälligkeit standardmässig auf Monatsende im Voraus, aber abweichende vertragliche Fristen wie hier (5. Werktag) sind erlaubt.",
      lawReference: {
        text: "OR Art. 257: Der Mieter hat dem Vermieter den Mietzins sowie, sofern verabredet oder ortsüblich, die Nebenkosten zu bezahlen.\nOR Art. 266b: Der Mietzins ist spätestens am Ende jedes Monats im Voraus zu entrichten, wenn nichts anderes verabredet oder ortsüblich ist.",
        link: ""
      },
      recommendation: "Die Regelung ist eindeutig und stimmt mit dem Gesetz überein. Keine weiteren Massnahmen nötig."
    },
    {
      id: "clause-5",
      title: "Mietzinsdepot",
      text: "Mietzinsdepot Drei Monatsmieten (CHF 9'150.–) auf ein Mietkautionskonto bei der Berner Kantonalbank bis spätestens 10 Tage vor Mietbeginn.",
      risk: "Rechtskonform",
      analysis: "Das hinterlegte Depot überschreitet nicht die Obergrenze von drei Monatsmieten, wie es OR Art. 257e vorsieht. Die Anlage auf einem separaten Konto auf den Namen des Mieters ist verlangt und entspricht den gesetzlichen Vorgaben.",
      lawReference: {
        text: "OR Art. 257e: Hat der Mieter einer Wohn- oder Geschäftsräumlichkeit eine Kaution zu leisten, so darf diese den Betrag von drei Monatsmieten nicht übersteigen. Sie ist auf einem Sparkonto oder Depot auf den Namen des Mieters bei einer Bank anzulegen.",
        link: ""
      },
      recommendation: "Die Klausel entspricht dem Gesetz. Überprüfen, ob das Konto tatsächlich auf den eigenen Namen eröffnet wird. Ggf. Bestätigung der Bank verlangen."
    },
    {
      id: "clause-6",
      title: "Kleinreparaturen",
      text: "Kleinreparaturen Der Mieter verpflichtet sich, sämtliche Reparaturen bis zu einem Betrag von CHF 500.– pro Fall selbst zu tragen, unabhängig von der Ursache des Schadens.",
      risk: "Rechtlich fraglich",
      analysis: "Gemäss OR Art. 259 und 259a ist der Mieter nur für kleine Mängel zu gewöhnlichen Unterhaltsarbeiten (Kleinstreparaturen) verantwortlich. Die Grenze von CHF 500 pro Fall wird in der Praxis häufig akzeptiert, jedoch muss zwischen gewöhnlichem Unterhalt (z.B. Dichtungen, Glühbirnen) und Schäden ohne Verschulden/Abnutzung (z.B. Materialfehler) unterschieden werden. Die Formulierung „unabhängig von der Ursache des Schadens" ist problematisch: Der Mieter darf nur für durch ihn verursachte bzw. zum gewöhnlichen Unterhalt gehörende kleine Mängel verpflichtet werden. Für Defekte, die nicht seinem Verantwortungsbereich oder dem normalen Unterhalt zuzurechnen sind, bleibt der Vermieter zuständig.",
      lawReference: {
        text: "OR Art. 259: Der Vermieter hat die Sache in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und zu erhalten.\nOR Art. 259a: Der Mieter ist zur Behebung von kleinen Mängeln verpflichtet, die im Laufe des Mietverhältnisses durch gewöhnlichen Unterhalt entstehen.",
        link: ""
      },
      recommendation: "Text prüfen und allenfalls abändern: „unabhängig von der Ursache des Schadens" sollte gestrichen oder präzisiert werden, da der Vermieter für nicht durch den Mieter verursachte Schäden aufkommen muss. Im Zweifel Anpassung verlangen."
    },
    {
      id: "clause-7",
      title: "Nutzung",
      text: "Nutzung Das Mietobjekt darf ausschliesslich zu Wohnzwecken genutzt werden. Jegliche Haustierhaltung ist untersagt.",
      risk: "Rechtlich fraglich",
      analysis: "Die ausschliessliche Nutzung zu Wohnzwecken ist zulässig, sofern keine gewerbliche oder andere Nutzung erfolgen soll. Das generelle Verbot der Haustierhaltung ist jedoch als kritisch anzusehen: Gemäss Rechtsprechung ist ein absolutes Verbot von Kleintieren wie Fischen, Hamstern oder kleinen Vögeln zu streng. Ein solches Totalverbot könnte als unzulässige Einschränkung ausgelegt werden, da der Mieter in der Regel ein Recht auf Kleintiere hat, vorausgesetzt, es entsteht keine Störung.",
      lawReference: {
        text: "OR Art. 257f Abs. 2: Der Mieter hat bei der Ausübung seiner Rechte Rücksicht auf die Hausbewohner, auf den Vermieter und auf die anderen Mieter zu nehmen.\nOR Art. 260: Der Mieter darf die Sache nur mit Zustimmung des Vermieters untervermieten.",
        link: ""
      },
      recommendation: "Klausel sollte überprüft und angepasst werden: Einschränkung bei Haustieren wäre auf problematische Tiere zu beschränken. Gegen ein absolutes Verbot von ungefährlichen Kleintieren hätte der Mieter vermutlich rechtliche Handhabe."
    },
    {
      id: "clause-8",
      title: "Schlüssel",
      text: "Schlüssel 3 Wohnungsschlüssel, 1 Briefkastenschlüssel, 1 Garagenfernbedienung. Verlust ist sofort zu melden. Ersatzkosten trägt der Mieter.",
      risk: "Rechtskonform",
      analysis: "Die Schlüsselanzahl ist klar bezeichnet. Das Melden eines Verlustes ist eine Selbstverständlichkeit. Die Verpflichtung, die Ersatzkosten im Verlustfall zu tragen, ist grundsätzlich zulässig, sofern kein Verschulden des Vermieters besteht. Die Schadenersatzpflicht gemäss OR Art. 97 ist in solchen Situationen gerechtfertigt, da sie auf Pflichtverletzung des Mieters abstellt.",
      lawReference: {
        text: "OR Art. 257f Abs. 1: Der Mieter hat die Mietsache sorgfältig zu gebrauchen.\nOR Art. 97: Schadenersatzpflicht bei Nichterfüllung – Wer einen Vertrag nicht erfüllt, ist zum Ersatz des daraus entstehenden Schadens verpflichtet.",
        link: ""
      },
      recommendation: "Keine Beanstandung. Auf sorgfältigen Umgang mit den Schlüsseln achten."
    },
    {
      id: "clause-9",
      title: "Hausordnung",
      text: "Hausordnung Die beigefügte Hausordnung ist Bestandteil dieses Vertrags. Verstösse können zur fristlosen Kündigung führen.",
      risk: "Rechtskonform",
      analysis: "Die Einbeziehung der Hausordnung ist üblich und sinnvoll. Die Möglichkeit einer fristlosen Kündigung ist jedoch nur nach erfolgloser Abmahnung und bei schwerwiegenden oder wiederholten Verstösse zulässig, gemäss OR Art. 257f Abs. 3. Die Klausel ist in Verbindung mit der gesetzlichen Regelung korrekt zu handhaben, solange vor einer Kündigung (ausser bei schweren Fällen) eine Abmahnung erfolgt.",
      lawReference: {
        text: "OR Art. 257f Abs. 2: Der Mieter hat bei der Ausübung seiner Rechte Rücksicht auf die Hausbewohner, auf den Vermieter und auf die anderen Mieter zu nehmen.\nOR Art. 257f Abs. 3: Verletzung dieser Pflicht berechtigt den Vermieter nach erfolgloser Abmahnung zur ausserordentlichen Kündigung.",
        link: ""
      },
      recommendation: "Verständnis der Hausordnung sicherstellen. Bei Unsicherheiten über die Schwere eines Verstosses genaue Prüfung und ggf. Beratung suchen."
    },
    {
      id: "clause-10",
      title: "Besucherregelung",
      text: "Besucherregelung Übernachtungsbesuche von mehr als 3 Nächten pro Monat bedürfen der schriftlichen Zustimmung des Vermieters.",
      risk: "Rechtlich unzulässig",
      analysis: "Für eine solche Beschränkung gibt es keine gesetzliche Grundlage. Die Rechtsprechung sieht das normale Einladen und gelegentliche Übernachten von Besuch als Teil des Wohngebrauchs. Eine quantitative Beschränkung auf drei Nächte pro Monat ist klar übermässig und unverhältnismässig, da sie das Privatleben des Mieters unzulässig einschränkt. Solche Klauseln werden oft als nichtig betrachtet.",
      lawReference: {
        text: "Gesetzlich nicht explizit geregelt: Für Beschränkung von Besucheraufenthalten enthält das Gesetz keine explizite Regelung.",
        link: ""
      },
      recommendation: "Diese Klausel sollte ersatzlos gestrichen werden, da sie das Recht des Mieters auf Privatleben unangemessen beschneidet."
    },
    {
      id: "clause-11",
      title: "Gerichtsstand",
      text: "Gerichtsstand Gerichtsstand ist Bern. Es gilt Schweizer Recht.",
      risk: "Rechtskonform",
      analysis: "Laut ZPO Art. 33 Absatz 1 ist für mietrechtliche Streitigkeiten der Ort der gelegenen Sache zuständig. Das Mietobjekt befindet sich in Bern, womit die Gerichtsstandsregelung korrekt ist. Schweizer Recht ist zudem zwingend, da sich das Mietobjekt in der Schweiz befindet (IPRG Art. 116).",
      lawReference: {
        text: "ZPO Art. 33 Abs. 1: Für Streitigkeiten aus Mietverhältnissen über Wohn- oder Geschäftsräume ist das Gericht am Ort der gelegenen Sache zuständig.\nIPRG Art. 116: Das Mietverhältnis über unbewegliche Sachen unterliegt dem Recht des Staates, in dem sich die Sache befindet (Schweizer Recht für Liegenschaften in der Schweiz).",
        link: ""
      },
      recommendation: "Entspricht den gesetzlichen Vorgaben. Keine Änderungen nötig."
    },
    {
      id: "clause-12",
      title: "Schlussbestimmungen",
      text: "Schlussbestimmungen Änderungen bedürfen der Schriftform. Sollten einzelne Bestimmungen ungültig sein, bleibt der Rest wirksam.",
      risk: "Rechtskonform",
      analysis: "Die Schriftformklausel entspricht OR Art. 16 und ist zulässig. Die sog. salvatorische Klausel wird gesetzlich zwar nicht explizit geregelt, jedoch von der Rechtsprechung anerkannt (Teilnichtigkeit). Kein Verstoss gegen zwingende Vorschriften.",
      lawReference: {
        text: "OR Art. 16: Sind die Parteien über die schriftliche Form einig, so vermutet es das Gesetz, dass sie die Einhaltung der Form als Gültigkeitserfordernis betrachten.\nOR Art. 20: Ist der Vertrag zum vornherein widerrechtlich oder unsittlich oder enthält er einen zum voraus bestimmten unmöglichen Inhalt, so ist er nichtig.\nGesetzlich nicht explizit geregelt: Die Salvatorische Klausel (Teilnichtigkeit) ist im Gesetz nicht direkt geregelt, wird aber anerkannt.",
        link: ""
      },
      recommendation: "Die Bestimmungen sind branchenüblich und korrekt. Keine Anpassung erforderlich."
    }
  ],
  overallRisk: "Rechtlich unzulässig",
  summary: "Es wurden 12 Klauseln analysiert. 1 Klausel wurde als rechtlich unzulässig eingestuft (Besucherregelung). 2 Klauseln wurden als rechtlich fraglich bewertet (Kleinreparaturen und Haustierhaltung). Die übrigen 9 Klauseln sind rechtskonform."
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
    let markdownContent = `# ${currentTab === "arbeitsvertrag" ? "Arbeitsvertrag" : "Mietvertrag"}\n\n`;
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
    } else if (tab === "mietvertrag") {
      updateAnalysisData(mietvertragDemo);
    } else {
      // Set empty data for any other tab
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
          <TabsTrigger value="mietvertrag" className="flex items-center gap-2">
            <Home size={16} />
            Mietvertrag
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
