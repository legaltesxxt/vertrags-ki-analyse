
import React from 'react';
import FlipCard from './FlipCard';

const toolsData = [
  {
    title: "Dein Tool",
    description: "Unsere KI-gestützte Analyse bietet eine schnelle und zuverlässige Prüfung Ihrer Verträge. Mit Schweizer Rechtexpertise entwickelt, erkennt sie kritische Klauseln und gibt praktische Handlungsempfehlungen.",
    comparison: {
      expertise: { value: "Hoch", isPositive: true },
      kosten: { value: "Niedrig", isPositive: true },
      risikoAnalyse: { value: "Ja", isPositive: true },
      dauer: { value: "Schnell", isPositive: true },
      kritischeKlauseln: { value: "Ja", isPositive: true },
      benutzerfreundlichkeit: { value: "Einfach", isPositive: true }
    }
  },
  {
    title: "Selbst prüfen",
    description: "Die eigenständige Prüfung von Verträgen erfordert viel Zeit und rechtliches Fachwissen. Ohne juristische Expertise können wichtige Details übersehen werden.",
    comparison: {
      expertise: { value: "Niedrig", isPositive: false },
      kosten: { value: "Keine", isPositive: true },
      risikoAnalyse: { value: "Nein", isPositive: false },
      dauer: { value: "Lang", isPositive: false },
      kritischeKlauseln: { value: "Nein", isPositive: false },
      benutzerfreundlichkeit: { value: "Komplex", isPositive: false }
    }
  },
  {
    title: "ChatGPT",
    description: "Während ChatGPT bei allgemeinen Fragen hilfreich sein kann, fehlt ihm die spezifische Expertise im Schweizer Recht. Die Analyse könnte ungenau oder nicht rechtskonform sein.",
    comparison: {
      expertise: { value: "Mittel", isPositive: false },
      kosten: { value: "Mittel", isPositive: false },
      risikoAnalyse: { value: "Teilweise", isPositive: false },
      dauer: { value: "Mittel", isPositive: true },
      kritischeKlauseln: { value: "Teilweise", isPositive: false },
      benutzerfreundlichkeit: { value: "Mittel", isPositive: true }
    }
  },
  {
    title: "Anwalt",
    description: "Ein Anwalt bietet zwar professionelle Rechtsberatung, ist aber oft mit hohen Kosten und längeren Wartezeiten verbunden. Für einfache Vertragsprüfungen kann dies unverhältnismäßig sein.",
    comparison: {
      expertise: { value: "Sehr hoch", isPositive: true },
      kosten: { value: "Sehr hoch", isPositive: false },
      risikoAnalyse: { value: "Ja", isPositive: true },
      dauer: { value: "Sehr lang", isPositive: false },
      kritischeKlauseln: { value: "Ja", isPositive: true },
      benutzerfreundlichkeit: { value: "Komplex", isPositive: false }
    }
  }
];

const FlipCardsGrid = () => {
  return (
    <section className="my-16">
      <h2 className="text-2xl font-semibold text-legal-primary text-center mb-8">
        Vergleich der Analysemethoden
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {toolsData.map((tool) => (
          <FlipCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            comparison={tool.comparison}
          />
        ))}
      </div>
    </section>
  );
};

export default FlipCardsGrid;
