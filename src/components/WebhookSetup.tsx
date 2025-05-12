
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
  const { toast } = useToast();

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings size={16} />
          Webhook-URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>N8N Webhook-Einstellungen</DialogTitle>
          <DialogDescription>
            Geben Sie die URL für Ihren n8n-Webhook ein. Diese URL wird für die Vertragsanalyse verwendet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-url" className="text-right">
              Webhook-URL
            </Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.app.n8n.cloud/webhook/..."
            />
          </div>
          <div className="col-span-4 text-xs text-slate-500">
            Die aktuelle Webhook-URL ist: {webhookUrl || "Nicht konfiguriert"}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={saveWebhook}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookSetup;
