
import React from 'react';
import FlipCard from './FlipCard';

const toolsData = [{
  title: "Vertragsklar",
  description: "Vertragsklar verbindet spezialisiertes Wissen im Schweizer Vertragsrecht mit modernster KI-Technologie. Innerhalb von wenigen Minuten erhalten Nutzer eine präzise Risikobewertung ihres Vertrags inklusive detaillierter Hervorhebung kritischer Klauseln. Der Service bietet schnelle, verständliche und konkrete Hinweise, die sofort umsetzbar sind. Ideal für Einzelpersonen und KMUs, die schnelle Klarheit und Sicherheit bei Verträgen benötigen.",
  comparison: {
    expertise: {
      value: "Hoch",
      isPositive: true
    },
    kosten: {
      value: "Niedrig",
      isPositive: true
    },
    risikoAnalyse: {
      value: "Ja",
      isPositive: true
    },
    dauer: {
      value: "Schnell",
      isPositive: true
    },
    kritischeKlauseln: {
      value: "Ja",
      isPositive: true
    },
    bedienbarkeit: {
      value: "Einfach",
      isPositive: true
    }
  }
}, {
  title: "Selbst prüfen",
  description: "Verträge eigenständig zu prüfen spart zwar kurzfristig Geld, birgt aber hohe Risiken. Ohne Fachwissen werden wichtige rechtliche Risiken und kritische Klauseln oft übersehen. Zudem kostet die eigenständige Prüfung meist viel Zeit und kann zu Unsicherheit führen, da die rechtliche Sicherheit nicht gewährleistet werden kann.",
  comparison: {
    expertise: {
      value: "Niedrig",
      isPositive: false
    },
    kosten: {
      value: "Keine",
      isPositive: true
    },
    risikoAnalyse: {
      value: "Nein",
      isPositive: false
    },
    dauer: {
      value: "Lang",
      isPositive: false
    },
    kritischeKlauseln: {
      value: "Nein",
      isPositive: false
    },
    bedienbarkeit: {
      value: "Komplex",
      isPositive: false
    }
  }
}, {
  title: "ChatGPT",
  description: "ChatGPT bietet zwar schnelle Antworten, verarbeitet aber juristische Dokumente allgemein und oberflächlich. Die Ergebnisse variieren stark und hängen vom formulierten Prompt ab, was Nutzer oft vor Unsicherheiten stellt. Zwar kostengünstig, fehlt es ChatGPT jedoch an spezifischem Fachwissen über Schweizer Recht, was die Genauigkeit und Zuverlässigkeit stark einschränkt.",
  comparison: {
    expertise: {
      value: "Mittel",
      isPositive: false
    },
    kosten: {
      value: "Mittel",
      isPositive: false
    },
    risikoAnalyse: {
      value: "Teilweise",
      isPositive: false
    },
    dauer: {
      value: "Mittel",
      isPositive: true
    },
    kritischeKlauseln: {
      value: "Teilweise",
      isPositive: false
    },
    bedienbarkeit: {
      value: "Mittel",
      isPositive: true
    }
  }
}, {
  title: "Anwalt",
  description: "Anwälte bieten fundierte juristische Expertise und hohe Qualität, sind aber mit erheblichen Kosten verbunden und die Bearbeitung dauert oft Tage bis Wochen. Vor allem bei einfachen oder alltäglichen Verträgen stehen Aufwand und Nutzen nicht im Verhältnis. Ideal für komplexe Fälle, jedoch für schnelle und bezahlbare Vertragschecks meist zu teuer und unpraktisch.",
  comparison: {
    expertise: {
      value: "Sehr hoch",
      isPositive: true
    },
    kosten: {
      value: "Sehr hoch",
      isPositive: false
    },
    risikoAnalyse: {
      value: "Ja",
      isPositive: true
    },
    dauer: {
      value: "Sehr lang",
      isPositive: false
    },
    kritischeKlauseln: {
      value: "Ja",
      isPositive: true
    },
    bedienbarkeit: {
      value: "Komplex",
      isPositive: false
    }
  }
}];

const FlipCardsGrid = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-legal-primary text-center mb-8">
          Vergleich der Analysemethoden:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolsData.map(tool => (
            <FlipCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              comparison={tool.comparison}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlipCardsGrid;
