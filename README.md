
# VertragsAnalyse - Schweizer Vertragsanalyse-Tool

Ein KI-gestütztes Tool zur Analyse von Schweizer Verträgen mit automatischer Risikobewertung, Klauselanalyse und Gesetzesreferenzen.

## Funktionen

- PDF-Upload von Verträgen
- KI-gestützte Analyse von Vertragsklauseln
- Detaillierte Risikobewertung für jede Klausel
- Gesetzesreferenzen und Empfehlungen
- Backend-Integration mit n8n für automatisierte Workflows

## Technologien

- React mit TypeScript
- Tailwind CSS für das UI
- React Dropzone für Datei-Uploads
- n8n Webhook-Integration im Backend
- PDF-Verarbeitung und KI-Analyse

## Einrichtung für n8n Integration (für Administratoren)

1. Erstellen Sie einen n8n Workflow mit einem Webhook-Trigger
2. Konfigurieren Sie die Webhook-URL in der Anwendung (im `useN8nWebhook` Hook)
3. Richten Sie den n8n Workflow wie folgt ein:

### Beispiel n8n Workflow:

1. **Webhook-Trigger**: Empfängt die PDF-Datei vom Frontend
2. **PDF-Parser**: Extrahiert Text aus dem PDF
3. **OpenAI/GPT-Node**: Analysiert den Vertragstext
4. **Function-Node**: Formatiert die Ergebnisse in das benötigte Format
5. **HTTP-Response**: Sendet die Analyseergebnisse zurück an die Anwendung

## Über das Projekt

Diese Anwendung wurde mit Lovable entwickelt und demonstriert die Integration von KI-Funktionen zur rechtlichen Dokumentenanalyse.

**URL**: https://lovable.dev/projects/0e9601a1-7107-488e-accb-f3ddfb6e50e9
