
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

  const sendToN8n = useCallback(async (file: File): Promise<WebhookResponse> => {
    const webhookUrl = localStorage.getItem('n8nWebhookUrl');
    
    if (!webhookUrl) {
      toast({
        title: "Webhook nicht konfiguriert",
        description: "Bitte konfigurieren Sie zuerst Ihren n8n Webhook.",
        variant: "destructive",
      });
      return { success: false, error: "Webhook nicht konfiguriert" };
    }

    setIsLoading(true);

    try {
      // In einer realen Anwendung würden wir hier die Datei zum n8n Webhook senden
      // Für dieses Beispiel simulieren wir den Prozess
      
      // FormData erstellen (in einem echten System würde dies an den Server gesendet)
      const formData = new FormData();
      formData.append('file', file);
      
      // Emuliere eine verzögerte Antwort
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Senden von ${file.name} an n8n Webhook: ${webhookUrl}`);
      
      // In einer echten Anwendung würde hier der API-Aufruf stehen:
      /*
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      */
      
      // Simulierte erfolgreiche Antwort
      return { 
        success: true, 
        data: { 
          message: "Datei erfolgreich verarbeitet",
          fileId: `${Date.now()}-${file.name.replace(/\s+/g, '-')}` 
        } 
      };
    } catch (error) {
      console.error("Fehler beim Senden zum n8n Webhook:", error);
      toast({
        title: "Fehler",
        description: "Die Datei konnte nicht an n8n gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
      return { success: false, error: String(error) };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { sendToN8n, isLoading };
}
