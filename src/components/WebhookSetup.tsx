
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const WebhookSetup: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const saveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine gültige Webhook-URL ein.",
        variant: "destructive",
      });
      return;
    }

    // In einer echten Anwendung würde hier die Webhook-URL gespeichert werden
    // Für dieses Beispiel speichern wir es im localStorage
    localStorage.setItem('n8nWebhookUrl', webhookUrl);
    
    toast({
      title: "Webhook gespeichert",
      description: "Ihre n8n Webhook-URL wurde erfolgreich gespeichert.",
    });
    
    setIsDialogOpen(false);
  };

  // Beim Start prüfen, ob ein Webhook bereits gespeichert ist
  React.useEffect(() => {
    const savedWebhook = localStorage.getItem('n8nWebhookUrl');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  return (
    <div className="mb-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            n8n Webhook konfigurieren
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>n8n Webhook einrichten</DialogTitle>
            <DialogDescription>
              Geben Sie Ihre n8n Webhook-URL ein, um die Vertragsanalyse zu automatisieren.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="webhook-url" className="text-right">
                Webhook URL
              </Label>
              <Input
                id="webhook-url"
                placeholder="https://n8n.example.com/webhook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">
                In n8n: Erstellen Sie einen neuen Workflow mit einem Webhook-Trigger und kopieren Sie die Webhook-URL hierher.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button type="button" onClick={saveWebhook}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {webhookUrl && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            n8n Webhook ist konfiguriert
          </p>
        </div>
      )}
    </div>
  );
};

export default WebhookSetup;
