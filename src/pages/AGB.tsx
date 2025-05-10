
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { FileText } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const AGB = () => {
  const agbMarkdownContent = `# Allgemeine Geschäftsbedingungen (AGB)
*Legal AI – Vertragsanalyse-Service*  
*(Stand: Mai 2025)*

## 1. Geltungsbereich  
Diese Allgemeinen Geschäftsbedingungen (AGB) regeln das Verhältnis zwischen „Legal AI", einem Einzelunternehmen mit Sitz in Bellmund, Schweiz, und natürlichen oder juristischen Personen (nachfolgend „Nutzer"), die über die Website von Legal AI eine KI-gestützte Analyse von Vertragsdokumenten in Anspruch nehmen.

## 2. Leistungsumfang  
Legal AI bietet eine automatisierte Analyse hochgeladener Verträge (z. B. Arbeits-, Miet- oder Werkverträge) durch ein KI-System (OpenAI) an. Die Analyse liefert eine Einschätzung der rechtlichen Risiken und verweist auf relevante Gesetzesartikel.

- Die Analyse erfolgt automatisiert und dient ausschliesslich der **Erstinformation**.  
- Es handelt sich **nicht um eine rechtsverbindliche Prüfung oder individuelle Rechtsberatung**.  
- Der Nutzer erhält das Analyseergebnis direkt auf der Website und zusätzlich als **Download-PDF**.

## 3. Vertragsschluss und Nutzung  
Die Nutzung erfolgt auf Abruf (Pay-per-Use). Mit dem Hochladen eines Vertragsdokuments und der Zahlung des Analysepreises kommt ein Vertrag zwischen dem Nutzer und Legal AI zustande.

## 4. Preise und Zahlungsabwicklung  
Die Preise sind in Schweizer Franken (CHF) ausgewiesen und gelten pro Analyse. Die Bezahlung erfolgt über:

- **Stripe** (Kreditkarte)  
- **Twint**

Nach erfolgreicher Zahlung wird die Analyse automatisch gestartet. Eine **Rückerstattung** ist grundsätzlich ausgeschlossen, **es sei denn**, der Nutzer macht innerhalb von 14 Tagen einen **berechtigten Mangel** geltend (z. B. keine Analyse erfolgt, PDF fehlerhaft).

## 5. Gewährleistung und Haftung  
Legal AI bemüht sich um die grösstmögliche Genauigkeit der KI-Ausgabe. Dennoch wird keine Haftung übernommen für:

- die inhaltliche Richtigkeit oder Vollständigkeit der Analyse,  
- Fehlinterpretationen durch die KI,  
- Entscheidungen, die Nutzer aufgrund der Analyse treffen.

**Die Nutzung der Analyse erfolgt auf eigenes Risiko. Sie ersetzt keine Rechtsberatung durch eine juristische Fachperson.**

Legal AI schliesst jede Haftung im gesetzlich zulässigen Umfang aus, insbesondere für leichte Fahrlässigkeit.

## 6. Datenschutz  
Die Verarbeitung personenbezogener Daten richtet sich nach unserer [Datenschutzerklärung](/datenschutz).  
Vertragsdokumente werden **nach Abschluss der Analyse automatisch gelöscht** und nicht gespeichert.

## 7. Geistiges Eigentum  
Die Analyseergebnisse und die zugrunde liegende Software bleiben geistiges Eigentum von Legal AI bzw. der jeweiligen Lizenzgeber. Eine Vervielfältigung oder kommerzielle Weitergabe ohne Zustimmung ist unzulässig.

## 8. Schlussbestimmungen  

- **Anwendbares Recht:** Es gilt Schweizer Recht.  
- **Gerichtsstand:** Zuständig ist das Gericht am Sitz von Legal AI.  
- Sollten einzelne Klauseln dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.

---

**Legal AI** – Schatzacher 16, 2564 Bellmund, info@vertragsklar.ch  
© 2025 – Alle Rechte vorbehalten`;

  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Unsere allgemeinen Geschäftsbedingungen für die Nutzung des Services.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <MarkdownRenderer content={agbMarkdownContent} />
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default AGB;
