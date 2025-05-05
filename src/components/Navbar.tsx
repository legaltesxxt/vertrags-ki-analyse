
import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationTabs from './NavigationTabs';

const Navbar: React.FC = () => {
  return <>
      <nav className="bg-white border-b border-border/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="mr-3">
                  <img src="/lovable-uploads/182bda48-4c66-464f-87bf-26446b4891c1.png" alt="VertragsAnalyse Logo" className="h-12 w-auto" />
                </div>
                <img 
                  src="/lovable-uploads/162860b3-88b7-4c0f-a362-cb1d826d699b.png" 
                  alt="Vertragsklar Text Logo" 
                  className="h-8 w-auto group-hover:opacity-80 transition-opacity" 
                />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex items-center text-sm text-slate-500 gap-1">
                <Shield size={16} />
                <span>Schweizer Rechtsanalyse-Tool</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <NavigationTabs />
    </>;
};

export default Navbar;
