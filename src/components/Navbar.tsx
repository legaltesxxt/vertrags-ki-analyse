
import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-border/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="bg-legal-primary p-1.5 rounded text-white mr-3">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-legal-primary group-hover:text-legal-secondary transition-colors">
                VertragsAnalyse
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
  );
};

export default Navbar;
