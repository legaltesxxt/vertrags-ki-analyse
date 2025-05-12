import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
const WebhookSetup: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    toast
  } = useToast();

  // Beim Start prüfen, ob ein Webhook bereits gespeichert ist
  useEffect(() => {
    const savedWebhook = localStorage.getItem('n8nWebhookUrl');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    } else {
      // Set default test webhook URL if none is stored
      setWebhookUrl("https://vertrags.app.n8n.cloud/webhook-test/Vertrags-analyse");
    }
  }, []);
  const saveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige Webhook-URL ein.",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem('n8nWebhookUrl', webhookUrl);
    toast({
      title: "Webhook gespeichert",
      description: "Ihre n8n Webhook-URL wurde erfolgreich gespeichert."
    });
    setIsDialogOpen(false);

    // Refresh the page to apply the new webhook URL
    window.location.reload();
  };
  return;
};
export default WebhookSetup;