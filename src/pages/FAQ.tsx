
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { HelpCircle } from 'lucide-react';
import FAQComponent from '@/components/home/FAQ';
import FeedbackForm from '@/components/FeedbackForm';

const FAQ = () => {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Was ist Vertragsklar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Vertragsklar nutzt moderne KI-Technologie, um Verträge schnell und zuverlässig auf Risiken zu prüfen. Innerhalb von wenigen Minuten erhältst du eine Risikoeinschätzung, Handlungsbedarf, kritische Klauseln werden hervorgehoben und du bekommst eine klare Einschätzung – speziell angepasst auf das Schweizer Recht."
        }
      },
      {
        "@type": "Question", 
        "name": "Welche Verträge kann ich prüfen lassen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unsere KI ist optimiert für gängige Schweizer Verträge, wie z.B. Mietverträge, Arbeitsverträge, Kaufverträge und Dienstleistungsverträge. Weitere Vertragstypen werden schrittweise ergänzt."
        }
      },
      {
        "@type": "Question",
        "name": "Wie lange dauert die Analyse?", 
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In der Regel dauert die Analyse weniger als 2 Minuten. Du erhältst danach direkt die Auswertung und kannst das Ergebnis als PDF herunterladen."
        }
      },
      {
        "@type": "Question",
        "name": "Werden meine Verträge gespeichert?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Nein. Deine Verträge werden nur temporär verarbeitet und danach automatisch gelöscht. Datenschutz und Vertraulichkeit stehen bei uns an oberster Stelle."
        }
      },
      {
        "@type": "Question",
        "name": "Was kostet die Vertragsanalyse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Während der Beta-Phase ist die Nutzung kostenlos. Später wird die Analyse je nach Vertragstyp und Funktionsumfang zu einem fairen Preis angeboten (Pay-per-Use)."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </script>
      <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <HelpCircle className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Häufig gestellte Fragen</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Antworten auf die wichtigsten Fragen rund um Vertragsklar.
          </p>
        </div>

        <FAQComponent />

        <div className="mt-16 mb-10">
          <h2 className="text-2xl font-light text-legal-primary text-center mb-8">
            Weitere Fragen? Kontaktieren Sie uns
          </h2>
          <FeedbackForm />
        </div>
      </div>
    </AnalysisLayout>
    </>
  );
};

export default FAQ;
