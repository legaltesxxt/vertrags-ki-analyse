
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

const DEFAULT_WEBHOOK_URL = "https://n8n.srv975434.hstgr.cloud/webhook-test/ebcbe106-bb56-412f-ba8c-5871e3237eac";

const WebhookSetup: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Beim Start prüfen, ob ein Webhook bereits gespeichert ist
  useEffect(() => {
    const savedWebhook = localStorage.getItem('n8nWebhookUrl');
    if (savedWebhook) {
      console.log("Geladene Webhook URL:", savedWebhook);
      setWebhookUrl(savedWebhook);
    } else {
      // Set default test webhook URL if none is stored
      console.log("Keine gespeicherte Webhook URL gefunden, verwende Standard-URL");
      setWebhookUrl(DEFAULT_WEBHOOK_URL);
      localStorage.setItem('n8nWebhookUrl', DEFAULT_WEBHOOK_URL);
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
    
    console.log("Speichere Webhook URL:", webhookUrl);
    localStorage.setItem('n8nWebhookUrl', webhookUrl);
    
    toast({
      title: "Webhook gespeichert",
      description: "Ihre n8n Webhook-URL wurde erfolgreich gespeichert."
    });
    
    setIsDialogOpen(false);

    // Refresh the page to apply the new webhook URL
    window.location.reload();
  };

  const resetToDefault = () => {
    setWebhookUrl(DEFAULT_WEBHOOK_URL);
    console.log("Webhook URL auf Standard zurückgesetzt");
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
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            type="button" 
            className="mr-auto"
          >
            Standard
          </Button>
          <div>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="mr-2"
            >
              Abbrechen
            </Button>
            <Button onClick={saveWebhook}>
              Speichern
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookSetup;
