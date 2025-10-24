import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Zahlung abgebrochen – Vertragsklar</title>
        <meta name="description" content="Zahlung nicht abgeschlossen. Wählen Sie erneut Ihren passenden Analyse-Plan." />
        <link rel="canonical" href="https://vertragsklar.ch/cancel" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <Card className="shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <AlertTriangle className="w-20 h-20 text-orange-500" />
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-legal-primary mb-4">
                Zahlung abgebrochen
              </h1>

              <p className="text-lg text-slate-700 mb-8">
                Sie können den Kauf jederzeit wiederholen und Ihre Analyse fortsetzen.
              </p>

              <Button
                onClick={() => navigate('/preise')}
                size="lg"
                className="w-full md:w-auto px-8"
              >
                Zurück zu den Preisen
              </Button>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cancel;
