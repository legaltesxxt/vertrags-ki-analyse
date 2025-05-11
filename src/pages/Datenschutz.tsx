
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Shield } from 'lucide-react';

const Datenschutz = () => {
  const privacyPolicyMarkdown = `# Datenschutzerklärung  
*(Stand: Mai 2025)*  
  
## 1 – Verantwortliche Stelle  
Vertragsklar – Schatzacher 16 – 2564 Bellmund – Schweiz  
E‑Mail: info@vertragsklar.ch  
  
## 2 – Zweck und Umfang der Datenbearbeitung  
Wir bieten eine KI‑gestützte Vertragsanalyse für den Schweizer Markt an. Zu diesem Zweck verarbeiten wir **ausschliesslich die Vertragsdokumente**, die du freiwillig hochlädst, sowie – bei einer kostenpflichtigen Nutzung – die erforderlichen **Zahlungs‑ und Kontaktdaten**.  
  
| Datenkategorie        | Zweck                                 | Rechtsgrundlage revDSG* |  
|-----------------------|---------------------------------------|-------------------------|  
| PDF‑Verträge          | Automatisierte Analyse mittels KI     | Art. 6 Abs. 1 lit. a |  
| Zahlungsdaten (Stripe)| Vertragsabwicklung                    | Art. 31 Abs. 2 lit. a |  
| Kontakt‑/Supportdaten | Support, Rechnungsstellung, Newsletter| Art. 31 Abs. 2 lit. a |  
| Nutzungsdaten (Analytics) | Webseiten-Optimierung, Statistik  | Art. 31 Abs. 2 lit. a |
  
\\*Für EU‑Nutzer: Rechtsgrundlagen nach Art. 6 Abs. 1 lit. a/b DSGVO.  
  
## 3 – Speicherdauer und Löschkonzept  
• **PDF‑Verträge** werden **sofort nach Abschluss der Analyse** automatisiert gelöscht.  
• Buchhaltungsbelege bleiben 10 Jahre (Art. 958f OR).  
• Support‑ und Newsletter‑Daten werden auf Wunsch gelöscht.  
• Nutzungsdaten in Google Analytics werden nach 14 Monaten anonymisiert.
  
## 4 – Weitergabe an Auftragsbearbeiter  
| Dienstleister  | Region | Zweck | Schutzmassnahmen |  
|----------------|--------|-------|------------------|  
| Supabase       | EU | Hosting & Storage | DPA, SCC |  
| OpenAI API     | Irland | KI‑Analyse | DPA, SCC |  
| Stripe         | EU / USA | Zahlung | PCI‑DSS, SCC |  
| Google Analytics 4 | EU / USA | Statistik | IP‑Anonymisierung, SCC |  
  
## 5 – Cookies und Tracking  
Wir verwenden essentielle Cookies für den Betrieb der Webseite. Für Analysezwecke setzen wir Google Analytics 4 ein, das nur nach Ihrer ausdrücklichen Einwilligung Cookies setzt und Nutzungsdaten verarbeitet. Folgende Daten werden dabei erfasst:

• Geräte- und Browser-Informationen (Modell, Betriebssystem, Browser-Version)
• Anonymisierte IP-Adresse
• Ungefährer Standort (nur auf Länderebene)
• Besuchsdauer und besuchte Seiten
• Interaktionen mit der Webseite

Sie haben jederzeit die Möglichkeit, Ihre Einwilligung zu widerrufen, indem Sie Ihre Cookie-Einstellungen anpassen oder Ihren Browser so konfigurieren, dass er Cookies von unserer Domain blockiert.
  
## 6 – Datensicherheit  
TLS‑Verschlüsselung, Zugriffsbeschränkung, automatische Löschung der Verträge.  
  
## 7 – Deine Rechte  
Auskunft, Berichtigung, Löschung, Datenportabilität, Widerspruch. Anfragen an info@vertragsklar.ch.  

## 8 – Opt-Out aus Google Analytics
Sie können die Erfassung durch Google Analytics verhindern, indem Sie auf folgenden Link klicken. Es wird ein Opt-Out-Cookie gesetzt, das die zukünftige Erfassung Ihrer Daten beim Besuch dieser Website verhindert:
[Google Analytics deaktivieren](javascript:gaOptout())

Alternativ können Sie auch Browser-Erweiterungen wie den Google Analytics Opt-out Browser Add-on verwenden.
  
## 9 – Beschwerderecht  
Eidgenössische Datenschutz‑ und Öffentlichkeitsbeauftragte (EDÖB).  
  
## 10 – Änderungen  
Wir aktualisieren diese Erklärung bei Bedarf. Aktuelle Version auf dieser Seite.  
  
*© 2025 Vertragsklar – Alle Rechte vorbehalten*`;

  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <Shield className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Datenschutz</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Informationen zum Schutz Ihrer Daten.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <MarkdownRenderer content={privacyPolicyMarkdown} />
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default Datenschutz;
