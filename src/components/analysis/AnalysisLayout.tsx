
import React from 'react';
import { Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AnalysisLayoutProps {
  children: React.ReactNode;
}

const AnalysisLayout: React.FC<AnalysisLayoutProps> = ({
  children
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisLayout;
