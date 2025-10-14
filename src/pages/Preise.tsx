import React, { useState } from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { CreditCard, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PRICE_IDS = {
  small: 'price_1S6eTDRss4oURuk0Aq9B0UDp',    // 9.90 CHF (1-5 Seiten)
  medium: 'price_1S6eTlRss4oURuk075b1wAkU',   // 19.90 CHF (6-15 Seiten)
  large: 'price_1S6eUcRss4oURuk01d19buMR',    // 29.90 CHF (16-30 Seiten)
};

const pricingTiers = [
  {
    id: 'small',
    name: 'Kurzer Vertrag',
    pages: '1-5 Seiten',
    price: '9.90',
    priceId: PRICE_IDS.small,
    features: [
      'Vollständige Vertragsanalyse',
      'Rechtliche Bewertung',
      'Handlungsempfehlungen',
      'PDF-Download',
    ],
  },
  {
    id: 'medium',
    name: 'Standardvertrag',
    pages: '6-15 Seiten',
    price: '19.90',
    priceId: PRICE_IDS.medium,
    popular: true,
    features: [
      'Vollständige Vertragsanalyse',
      'Rechtliche Bewertung',
      'Handlungsempfehlungen',
      'PDF-Download',
      'Detaillierte Klausel-Prüfung',
    ],
  },
  {
    id: 'large',
    name: 'Umfangreicher Vertrag',
    pages: '16-30 Seiten',
    price: '29.90',
    priceId: PRICE_IDS.large,
    features: [
      'Vollständige Vertragsanalyse',
      'Rechtliche Bewertung',
      'Handlungsempfehlungen',
      'PDF-Download',
      'Detaillierte Klausel-Prüfung',
      'Umfassende Risikoanalyse',
    ],
  },
];

const Preise = () => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (priceId: string, tierId: string) => {
    setLoadingTier(tierId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) throw error;

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('Keine Checkout-URL erhalten');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Checkout-Session:', error);
      toast({
        title: 'Fehler',
        description: 'Die Zahlung konnte nicht gestartet werden. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
      setLoadingTier(null);
    }
  };

  return (
    <AnalysisLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <CreditCard className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-4xl font-light text-legal-primary mb-4">Preise</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Wählen Sie das passende Paket für Ihre Vertragslänge. Alle Analysen sind einmalige Zahlungen ohne Abonnement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${tier.popular ? 'border-legal-primary shadow-lg' : 'border-border/50'}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-legal-primary text-white">Beliebteste Wahl</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-legal-primary">{tier.name}</CardTitle>
                <CardDescription className="text-lg">
                  <FileText className="inline-block mr-2 h-4 w-4" />
                  {tier.pages}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-legal-primary">{tier.price}</span>
                  <span className="text-slate-600 ml-2">CHF</span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-legal-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-legal-primary hover:bg-legal-secondary"
                  onClick={() => handlePurchase(tier.priceId, tier.id)}
                  disabled={loadingTier !== null}
                >
                  {loadingTier === tier.id ? 'Wird geladen...' : 'Jetzt analysieren'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-legal-tertiary rounded-xl p-6 text-center">
          <p className="text-slate-600">
            <strong>Hinweis:</strong> Wir vertrauen unseren Kunden bei der Auswahl der korrekten Seitenzahl. 
            Bitte wählen Sie das Paket, das am besten zu Ihrem Vertrag passt.
          </p>
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default Preise;
