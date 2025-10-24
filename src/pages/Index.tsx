import React from 'react';
import Navbar from '@/components/Navbar';
import Header from '@/components/home/Header';
import Footer from '@/components/Footer';
import FeatureCards from '@/components/features/FeatureCards';
import ProcessSteps from '@/components/home/ProcessSteps';
import FlipCardsGrid from '@/components/home/FlipCardsGrid';
import FAQ from '@/components/home/FAQ';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-legal-light">
      <Navbar />
      
      <main id="how-it-works" className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <Header />
        <FeatureCards />
        <ProcessSteps />
        <FlipCardsGrid />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
