
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { HeartHandshake } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const WerteEthik = () => {
  const werteEthikMarkdownContent = `# Unsere Werte & Ethik

## Verantwortungsvoll. Transparent. Menschlich.

Bei *Legal AI* glauben wir, dass Technologie nur dann sinnvoll ist, wenn sie im Dienst des Menschen steht. Unsere KI-gestützte Vertragsanalyse wurde entwickelt, um dir fundierte Einblicke zu bieten – nicht, um Entscheidungen für dich zu treffen.

## Unsere Grundprinzipien

### 1. Transparenz statt Blackbox  
Wir legen offen, wie unsere Analysen funktionieren: Jede Einschätzung basiert auf klaren Kriterien und wird verstaendlich dargestellt. Unser Ziel ist es, dir nicht nur Ergebnisse zu liefern, sondern auch deren Grundlage nachvollziehbar zu machen.

### 2. Datenschutz als Prioritaet  
Deine Dokumente gehoeren dir. Hochgeladene Vertraege werden ausschliesslich fuer die Analyse verwendet und **sofort danach geloescht**. Wir speichern keine Inhalte und respektieren deine Privatsphaere in vollem Umfang.

### 3. Keine Rechtsberatung  
Unsere Analysen bieten eine erste Orientierung, ersetzen jedoch keine individuelle Rechtsberatung. Fuer verbindliche Auskuenfte empfehlen wir, einen qualifizierten Juristen zu konsultieren.

### 4. Fairness und Unvoreingenommenheit  
Wir arbeiten kontinuierlich daran, unsere KI-Modelle auf Fairness und Neutralitaet zu pruefen. Solltest du dennoch Unstimmigkeiten oder Vorurteile in den Analysen feststellen, bitten wir um dein Feedback.

### 5. Verantwortungsbewusster KI-Einsatz  
Technologie ist ein Werkzeug – kein Ersatz fuer menschliches Urteilsvermoegen. Wir setzen KI ein, um Prozesse zu unterstuetzen, nicht um sie zu dominieren.

## Unser Engagement

- **Offene Kommunikation:** Wir informieren dich ueber Aenderungen, Updates und neue Funktionen.  
- **Kontinuierliche Verbesserung:** Dein Feedback fliesst direkt in die Weiterentwicklung unserer Dienste ein.  
- **Ethik als Leitlinie:** Unsere Entscheidungen orientieren sich an ethischen Standards und dem Wohl unserer Nutzer.

---

Wenn du Fragen oder Anregungen hast, stehen wir dir gerne zur Verfuegung. Dein Vertrauen ist unser Antrieb.`;

  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <HeartHandshake className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Werte & Ethik</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Unsere ethischen Grundsätze und Werte.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <MarkdownRenderer content={werteEthikMarkdownContent} />
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default WerteEthik;
