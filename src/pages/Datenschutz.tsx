
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Shield } from 'lucide-react';

const Datenschutz = () => {
  const privacyPolicyMarkdown = `# Datenschutzerklärung  
*(Stand: Mai 2025)*  
  
## 1 – Verantwortliche Stelle  
Legal AI – [PLATZHALTER Strasse, Nr.] – [PLATZHALTER PLZ Ort] – Schweiz  
E‑Mail: [PLATZHALTER E‑Mail]  
  
## 2 – Zweck und Umfang der Datenbearbeitung  
Wir bieten eine KI‑gestützte Vertragsanalyse für den Schweizer Markt an. Zu diesem Zweck verarbeiten wir **ausschliesslich die Vertragsdokumente**, die du freiwillig hochlädst, sowie – bei einer kostenpflichtigen Nutzung – die erforderlichen **Zahlungs‑ und Kontaktdaten**.  
  
| Datenkategorie        | Zweck                                 | Rechtsgrundlage revDSG* |  
|-----------------------|---------------------------------------|-------------------------|  
| PDF‑Verträge          | Automatisierte Analyse mittels KI     | Art. 6 Abs. 1 lit. a |  
| Zahlungsdaten (Stripe)| Vertragsabwicklung                    | Art. 31 Abs. 2 lit. a |  
| Kontakt‑/Supportdaten | Support, Rechnungsstellung, Newsletter| Art. 31 Abs. 2 lit. a |  
  
\\*Für EU‑Nutzer: Rechtsgrundlagen nach Art. 6 Abs. 1 lit. a/b DSGVO.  
  
## 3 – Speicherdauer und Löschkonzept  
• **PDF‑Verträge** werden **sofort nach Abschluss der Analyse** automatisiert gelöscht.  
• Buchhaltungsbelege bleiben 10 Jahre (Art. 958f OR).  
• Support‑ und Newsletter‑Daten werden auf Wunsch gelöscht.  
  
## 4 – Weitergabe an Auftragsbearbeiter  
| Dienstleister  | Region | Zweck | Schutzmassnahmen |  
|----------------|--------|-------|------------------|  
| Supabase       | EU | Hosting & Storage | DPA, SCC |  
| OpenAI         | USA | KI‑Analyse | DPA, SCC |  
| Stripe         | EU / USA | Zahlung | PCI‑DSS, SCC |  
| Google Analytics 4 (opt.) | EU / USA | Statistik | IP‑Anonymisierung |  
  
## 5 – Cookies und Tracking  
Wir verwenden essentielle Cookies; Analytics‑Cookies nur nach Einwilligung (Cookie‑Banner).  
  
## 6 – Datensicherheit  
TLS‑Verschlüsselung, Zugriffsbeschränkung, automatische Löschung der Verträge.  
  
## 7 – Deine Rechte  
Auskunft, Berichtigung, Löschung, Datenportabilität, Widerspruch. Anfragen an [PLATZHALTER E‑Mail].  
  
## 8 – Beschwerderecht  
Eidgenössische Datenschutz‑ und Öffentlichkeitsbeauftragte (EDÖB).  
  
## 9 – Änderungen  
Wir aktualisieren diese Erklärung bei Bedarf. Aktuelle Version auf dieser Seite.  
  
*© 2025 Legal AI – Alle Rechte vorbehalten*`;

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
