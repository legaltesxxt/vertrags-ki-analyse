
import React from 'react';
import { Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavigationTabs from './NavigationTabs';

const Navbar: React.FC = () => {
  return <>
      <nav className="bg-white border-b border-border/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <FileText 
                  size={28} 
                  className="text-legal-primary mr-2.5 group-hover:text-legal-secondary transition-colors" 
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="font-semibold text-xl tracking-tight text-legal-primary group-hover:text-legal-secondary transition-colors">
                  Vertragsklar
                </span>
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
