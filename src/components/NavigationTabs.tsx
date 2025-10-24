
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Info, FileText, Mail, HelpCircle, CreditCard } from 'lucide-react';

const NavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleSoFunktioniertClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Check if we're already on the homepage
    if (location.pathname === '/') {
      // If we're on the homepage, scroll to the element
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the homepage, navigate to the homepage with the anchor
      navigate('/#how-it-works', { replace: true });
    }
  };

  return (
    <div className="w-full bg-slate-50 border-b border-slate-100 py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue={location.pathname} className="w-full">
          <TabsList className="w-full h-14 bg-white rounded-lg shadow-sm justify-between overflow-x-auto">
            <TabsTrigger 
              value="/preise"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/preise" className="flex items-center gap-2 px-4 py-2">
                <Upload size={18} />
                <span className="whitespace-nowrap">Analyse starten</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/preise"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/preise" className="flex items-center gap-2 px-4 py-2">
                <CreditCard size={18} />
                <span className="whitespace-nowrap">Preise</span>
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
              value="/demo-analyse"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/demo-analyse" className="flex items-center gap-2 px-4 py-2">
                <FileText size={18} />
                <span className="whitespace-nowrap">Demo-Analyse</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/faq"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/faq" className="flex items-center gap-2 px-4 py-2">
                <HelpCircle size={18} />
                <span className="whitespace-nowrap">Häufig gestellte Fragen</span>
              </Link>
            </TabsTrigger>
            
            <TabsTrigger 
              value="/kontakt"
              className="data-[state=active]:bg-legal-primary data-[state=active]:text-white"
              asChild
            >
              <Link to="/kontakt" className="flex items-center gap-2 px-4 py-2">
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
