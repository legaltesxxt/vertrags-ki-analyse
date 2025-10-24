import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    const t = searchParams.get('t');
    const allowed = ['small', 'medium', 'large'];
    
    if (allowed.includes(t || '')) {
      setIsValid(true);
      setNoteText('Zahlung bestätigt. Sie können jetzt starten.');
    } else {
      setIsValid(false);
      setNoteText('Kein gültiger Abschluss gefunden. Bitte Zahlung erneut durchführen.');
    }
  }, [searchParams]);

  const handleStartAnalysis = () => {
    if (isValid) {
      navigate('/analyse-geheim');
    }
  };

  return (
    <>
      <Helmet>
        <title>Zahlung erfolgreich – Vertragsklar</title>
        <meta name="description" content="Zahlung bestätigt. Starten Sie jetzt Ihre Vertragsanalyse." />
        <link rel="canonical" href="https://vertragsklar.ch/success" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-legal-light">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <Card className="shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </div>

              <h1 className="text-3xl md:text-4xl font-light text-legal-primary mb-4">
                Zahlung erfolgreich
              </h1>

              <p className="text-lg text-slate-700 mb-6">
                Ihre Zahlung wurde erfolgreich verarbeitet. Sie können jetzt direkt mit der Analyse Ihres Vertrags beginnen.
              </p>

              <p className="text-sm text-slate-600 mb-8">
                Falls Sie nicht automatisch weitergeleitet wurden, klicken Sie auf den Button unten.
              </p>

              <Button
                id="go-analysis"
                onClick={handleStartAnalysis}
                disabled={!isValid}
                size="lg"
                className={`w-full md:w-auto px-8 ${
                  !isValid ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
                }`}
              >
                Analyse starten
              </Button>

              <p
                id="success-note"
                className={`mt-6 text-sm font-medium ${
                  isValid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {noteText}
              </p>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Success;
