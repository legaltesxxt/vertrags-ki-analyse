import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem('cookie-consent') === 'true';
    
    if (!consentGiven) {
      // If user hasn't given consent, show the banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 800);
      
      // Disable Google Analytics until consent is given
      window['ga-disable-G-SR9PMHBZ68'] = true;
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage and cookie
    localStorage.setItem('cookie-consent', 'true');
    document.cookie = 'cookie-consent=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    
    // Enable Google Analytics
    window['ga-disable-G-SR9PMHBZ68'] = false;
    
    // Hide the banner
    setShowConsent(false);
  };

  const handleReject = () => {
    // Store rejection in localStorage and cookie
    localStorage.setItem('cookie-consent', 'false');
    document.cookie = 'cookie-consent=false; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    
    // Keep Google Analytics disabled
    window['ga-disable-G-SR9PMHBZ68'] = true;
    
    // Opt out of Google Analytics
    window.gaOptout();
    
    // Hide the banner
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto border border-legal-primary/10 shadow-lg bg-white">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-4">
              <h3 className="text-lg font-medium text-legal-primary mb-2">Cookie-Einstellungen</h3>
              <p className="text-slate-600 mb-4">
                Diese Website verwendet Cookies und ähnliche Technologien, um Ihr Browsing-Erlebnis zu verbessern und 
                um zu verstehen, wie Sie mit unserer Website interagieren. Mit Ihrer Zustimmung verwenden wir 
                Analyse-Cookies (Google Analytics), um anonyme Nutzungsdaten zu sammeln.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={handleAccept}
                  className="bg-legal-primary hover:bg-legal-secondary transition-colors"
                >
                  Akzeptieren
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReject}
                  className="border-legal-primary/50 text-legal-primary hover:bg-legal-tertiary transition-colors"
                >
                  Ablehnen
                </Button>
                <Button 
                  variant="link" 
                  onClick={() => window.location.href = '/datenschutz'}
                  className="text-legal-secondary"
                >
                  Datenschutzerklärung
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieConsent;
