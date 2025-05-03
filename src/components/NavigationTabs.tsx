
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Info, FileText, Gavel, Mail } from 'lucide-react';

const NavigationTabs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleSoFunktioniertClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-slate-50 border-b border-slate-100 py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue={location.pathname} className="w-full">
          <TabsList className="w-full h-14 bg-white rounded-lg shadow-sm justify-between overflow-x-auto">
            <TabsTrigger 
              value="/upload-contract"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/upload-contract" className="flex items-center gap-2 px-4 py-2">
                <Upload size={18} />
                <span className="whitespace-nowrap">Analyse starten</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/#how-it-works"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <a href="/#how-it-works" onClick={handleSoFunktioniertClick} className="flex items-center gap-2 px-4 py-2">
                <Info size={18} />
                <span className="whitespace-nowrap">So funktioniert's</span>
              </a>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/demo-analysis"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/demo-analysis" className="flex items-center gap-2 px-4 py-2">
                <FileText size={18} />
                <span className="whitespace-nowrap">Demo-Analyse</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/legal"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/legal" className="flex items-center gap-2 px-4 py-2">
                <Gavel size={18} />
                <span className="whitespace-nowrap">Rechtliches</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/contact"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/contact" className="flex items-center gap-2 px-4 py-2">
                <Mail size={18} />
                <span className="whitespace-nowrap">Kontakt</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default NavigationTabs;
