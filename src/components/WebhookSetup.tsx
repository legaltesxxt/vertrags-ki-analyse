
import React, { useState, useEffect } from 'react';
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
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('n8nWebhookUrl', webhookUrl);
    
    toast({
      title: "Webhook gespeichert",
      description: "Ihre n8n Webhook-URL wurde erfolgreich gespeichert.",
    });
    
    setIsDialogOpen(false);
    
    // Refresh the page to apply the new webhook URL
    window.location.reload();
  };

  return (
    <div className="mb-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800"
          >
            <Settings size={16} />
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
          <p className="text-sm text-green-700 flex items-center justify-between">
            <span>n8n Webhook ist konfiguriert</span>
            <span className="text-xs bg-green-100 px-2 py-1 rounded">{webhookUrl.split('/').pop()}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WebhookSetup;
