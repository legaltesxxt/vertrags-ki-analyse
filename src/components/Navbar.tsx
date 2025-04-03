
import React from 'react';
import { FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-legal-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-2" />
            <span className="font-semibold text-xl tracking-tight">VertragsAnalyse</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">Schweizer Rechtsanalyse-Tool</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
