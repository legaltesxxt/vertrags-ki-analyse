
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "Was ist Vertragsklar?",
    answer: "Vertragsklar nutzt moderne KI-Technologie, um Verträge schnell und zuverlässig auf Risiken zu prüfen. Innerhalb von wenigen Minuten erhältst du eine Risikoeinschätzung, Handlungsbedarf, kritische Klauseln werden hervorgehoben und du bekommst eine klare Einschätzung – speziell angepasst auf das Schweizer Recht."
  },
  {
    question: "Welche Verträge kann ich prüfen lassen?",
    answer: "Unsere KI ist optimiert für gängige Schweizer Verträge, wie z.B. Mietverträge, Arbeitsverträge, Kaufverträge und Dienstleistungsverträge. Weitere Vertragstypen werden schrittweise ergänzt."
  },
  {
    question: "Muss ich mich registrieren, um eine Analyse zu erhalten?",
    answer: "Nein. In der aktuellen Phase kannst du deinen Vertrag einfach hochladen und die Analyse direkt erhalten – ganz ohne Konto oder Registrierung."
  },
  {
    question: "Ist es auch möglich Bilder von meinem Vertrag hochzuladend?",
    answer: "Aktuell noch nicht. Doch wir arbeiten an einer Lösung!"
  },
  {
    question: "Wie lange dauert die Analyse?",
    answer: "In der Regel dauert die Analyse weniger als 2 Minuten. Du erhältst danach direkt die Auswertung und kannst das Ergebnis als PDF herunterladen."
  },
  {
    question: "Wie genau ist die Analyse?",
    answer: "Unsere KI liefert basierend auf umfangreichen Trainingsdaten und Beispielen nach Schweizer Recht eine fundierte Risikoanalyse. Dennoch ersetzt sie keine individuelle Rechtsberatung bei besonders komplexen oder strittigen Fällen."
  },
  {
    question: "Werden meine Verträge gespeichert?",
    answer: "Nein. Deine Verträge werden nur temporär verarbeitet und danach automatisch gelöscht. Datenschutz und Vertraulichkeit stehen bei uns an oberster Stelle."
  },
  {
    question: "Kann ich mein Ergebnis als PDF speichern?",
    answer: "Ja! Nach der Analyse kannst du dein vollständiges Ergebnis inklusive Risikoeinschätzung, Handlungsbedarf und Kommentaren als PDF herunterladen."
  },
  {
    question: "Was kostet die Vertragsanalyse?",
    answer: "Während der Beta-Phase ist die Nutzung kostenlos. Später wird die Analyse je nach Vertragstyp und Funktionsumfang zu einem fairen Preis angeboten (Pay-per-Use)."
  },
  {
    question: "Ist Vertragsklar ein Ersatz für einen Anwalt?",
    answer: "Nein. Unser Tool dient der schnellen Risikoerkennung und Unterstützung bei der Vertragsprüfung. Bei komplexen oder kritischen Fällen empfehlen wir weiterhin die individuelle Beratung durch einen Rechtsanwalt."
  }
];

const FAQ = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-legal-primary text-center mb-8">
          Häufig gestellte Fragen
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow px-4"
            >
              <AccordionTrigger className="text-left text-legal-primary hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
