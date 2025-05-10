
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
              <Link to="/" className="flex items-center gap-3 group">
                <img alt="Vertragsklar Logo" className="h-12 w-12 group-hover:opacity-80 transition-opacity" width="48" height="48" src="/lovable-uploads/d2f8c74c-64f3-4726-9840-c56b7e449143.png" />
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
