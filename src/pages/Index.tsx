
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Header from '@/components/home/Header';
import Footer from '@/components/Footer';
import FeatureCards from '@/components/features/FeatureCards';
import ProcessSteps from '@/components/home/ProcessSteps';
import FlipCardsGrid from '@/components/home/FlipCardsGrid';
import FAQ from '@/components/home/FAQ';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-legal-light">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <Header />
        <FeatureCards />
        <ProcessSteps />
        <FlipCardsGrid />
        <FAQ />
        
        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10 text-center">
          <h2 className="text-2xl font-semibold text-legal-primary mb-4">Bereit, Ihren Vertrag zu analysieren?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Wählen Sie das passende Paket für Ihre Vertragslänge und starten Sie die professionelle Analyse.
          </p>
          <Button 
            onClick={() => navigate('/preise')}
            className="bg-legal-primary hover:bg-legal-secondary text-lg px-8 py-6"
          >
            Zu den Preisen
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
