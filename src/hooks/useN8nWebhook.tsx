
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function useN8nWebhook() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fester n8n Webhook URL - in einer produktiven Umgebung sollte dieser in Umgebungsvariablen gespeichert werden
  const webhookUrl = "https://your-n8n-instance.com/webhook/path"; // Ersetze dies mit deiner tatsächlichen n8n Webhook URL

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    if (!webhookUrl) {
      console.error("Webhook URL ist nicht konfiguriert");
      return { success: false, error: "Webhook nicht konfiguriert" };
    }

    setIsLoading(true);

    try {
      // FormData erstellen für den Datei-Upload
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`Senden von ${file.name} an n8n Webhook: ${webhookUrl}`);
      
      // Hier wird die tatsächliche API-Anfrage an n8n gesendet
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        // Bei Bedarf können hier weitere Header hinzugefügt werden
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
      
    } catch (error) {
      console.error("Fehler beim Senden zum n8n Webhook:", error);
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendToN8n, isLoading };
}
