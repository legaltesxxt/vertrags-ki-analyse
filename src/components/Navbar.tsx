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
                <img alt="Vertragsklar Logo" src="/lovable-uploads/b1acbe02-b569-4f2f-a561-aec2a0aca1a6.png" className="h-10 mr-2 transition-opacity group-hover:opacity-90 object-scale-down" />
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