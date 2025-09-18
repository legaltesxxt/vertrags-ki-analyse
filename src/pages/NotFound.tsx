import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, FileText, HelpCircle } from "lucide-react";
import AnalysisLayout from "@/components/analysis/AnalysisLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Seite nicht gefunden - Vertragsklar",
    "description": "Die angeforderte Seite wurde nicht gefunden. Kehren Sie zur Startseite zurück oder nutzen Sie unsere Navigation.",
    "url": `https://vertragsklar.ch${location.pathname}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Vertragsklar",
      "url": "https://vertragsklar.ch"
    }
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <AnalysisLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="mb-8">
            <h1 className="text-6xl font-light text-legal-primary mb-4">404</h1>
            <h2 className="text-2xl font-light text-legal-secondary mb-4">
              Seite nicht gefunden
            </h2>
            <p className="text-slate-600 mb-8">
              Die Seite, nach der Sie suchen, existiert nicht oder wurde verschoben.
              Nutzen Sie die Links unten, um zu den wichtigsten Bereichen zu gelangen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link 
              to="/" 
              className="flex flex-col items-center p-6 bg-white rounded-xl border border-border/50 hover:shadow-md transition-shadow"
            >
              <Home className="h-8 w-8 text-legal-primary mb-3" />
              <h3 className="font-medium text-legal-primary mb-2">Startseite</h3>
              <p className="text-sm text-slate-600 text-center">
                Zur Hauptseite mit Vertragsanalyse
              </p>
            </Link>

            <Link 
              to="/demo-analyse" 
              className="flex flex-col items-center p-6 bg-white rounded-xl border border-border/50 hover:shadow-md transition-shadow"
            >
              <FileText className="h-8 w-8 text-legal-primary mb-3" />
              <h3 className="font-medium text-legal-primary mb-2">Demo-Analyse</h3>
              <p className="text-sm text-slate-600 text-center">
                Testen Sie unsere Beispiel-Analyse
              </p>
            </Link>

            <Link 
              to="/faq" 
              className="flex flex-col items-center p-6 bg-white rounded-xl border border-border/50 hover:shadow-md transition-shadow"
            >
              <HelpCircle className="h-8 w-8 text-legal-primary mb-3" />
              <h3 className="font-medium text-legal-primary mb-2">FAQ</h3>
              <p className="text-sm text-slate-600 text-center">
                Häufig gestellte Fragen
              </p>
            </Link>
          </div>

          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-legal-primary text-white rounded-lg hover:bg-legal-secondary transition-colors"
          >
            Zur Startseite zurückkehren
          </Link>
        </div>
      </AnalysisLayout>
    </>
  );
};

export default NotFound;
