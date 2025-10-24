import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Check, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Preise = () => {
  const pricingTiers = [
    {
      title: "Bis 5 Seiten",
      price: "9",
      description: "Perfekt für einfache Verträge",
      stripeLink: "https://buy.stripe.com/dRm00lfEw3ax9Ale7A2Fa00",
      popular: false,
    },
    {
      title: "6–15 Seiten",
      price: "19",
      description: "Ideal für Standard-Verträge",
      stripeLink: "https://buy.stripe.com/cNi7sN9g826t6o9fbE2Fa01",
      popular: true,
    },
    {
      title: "16–30 Seiten",
      price: "29",
      description: "Für komplexe Vertragswerke",
      stripeLink: "https://buy.stripe.com/6oUfZj3VOcL7fYJ5B42Fa05",
      popular: false,
    },
  ];

  const features = [
    "KI-gestützte Vertragsanalyse",
    "Risikobewertung nach CH-Recht",
    "PDF-Download der Analyse",
    "Keine Speicherung, voller Datenschutz",
  ];

  const handlePayment = (stripeLink: string) => {
    window.open(stripeLink, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Preise – Vertragsklar</title>
        <meta name="description" content="Einmalzahlung je nach Seitenlänge (9/19/29 CHF). Starten Sie Ihre KI-Vertragsanalyse jetzt." />
        <link rel="canonical" href="https://vertragsklar.ch/preise" />
        <meta property="og:title" content="Preise – Vertragsklar" />
        <meta property="og:description" content="Einmalzahlung je nach Seitenlänge (9/19/29 CHF). Starten Sie Ihre KI-Vertragsanalyse jetzt." />
        <meta property="og:url" content="https://vertragsklar.ch/preise" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-legal-light">
        <Navbar />
        
        <main className="flex-1">
          {/* Header Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Preise
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Einmalzahlung – sofort starten. Keine Registrierung notwendig.
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Wählen Sie das passende Paket basierend auf der Seitenlänge Ihres Vertrags
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pricingTiers.map((tier, index) => (
                  <Card
                    key={index}
                    className={`relative flex flex-col ${
                      tier.popular
                        ? 'border-legal-primary shadow-lg scale-105'
                        : 'border-border'
                    }`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-legal-primary text-white">
                        Am beliebtesten
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-legal-tertiary flex items-center justify-center">
                        <FileText className="w-6 h-6 text-legal-primary" />
                      </div>
                      <CardTitle className="text-2xl font-bold">
                        {tier.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <div className="text-center mb-6">
                        <span className="text-5xl font-bold text-legal-primary">
                          {tier.price}
                        </span>
                        <span className="text-xl text-muted-foreground ml-2">
                          CHF
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Einmalige Zahlung
                        </p>
                      </div>

                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-legal-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        onClick={() => handlePayment(tier.stripeLink)}
                        className="w-full bg-legal-primary hover:bg-legal-secondary text-white"
                        size="lg"
                      >
                        Jetzt analysieren
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Section */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-legal-tertiary border-legal-primary/20">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="w-10 h-10 rounded-full bg-legal-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-legal-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Vertrauen und Transparenz
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Wir vertrauen unseren Kunden bei der Auswahl der korrekten Seitenzahl. 
                      Bitte wählen Sie das Paket, das am besten zu Ihrem Vertrag passt.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Info Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Was Sie erhalten
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-legal-tertiary mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-6 h-6 text-legal-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Sofortiger Zugriff</h3>
                  <p className="text-sm text-muted-foreground">
                    Nach erfolgreicher Zahlung können Sie direkt mit der Analyse starten
                  </p>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-legal-tertiary mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-6 h-6 text-legal-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Keine Registrierung</h3>
                  <p className="text-sm text-muted-foreground">
                    Kein Account notwendig – einfach zahlen und analysieren
                  </p>
                </div>
                <div className="p-6">
                  <div className="w-12 h-12 rounded-full bg-legal-tertiary mx-auto mb-4 flex items-center justify-center">
                    <Check className="w-6 h-6 text-legal-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Einmalige Zahlung</h3>
                  <p className="text-sm text-muted-foreground">
                    Keine Abos, keine versteckten Kosten – nur eine faire Einmalzahlung
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Preise;
