
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-legal-primary to-legal-secondary text-white py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Rechtliches</h3>
            <ul className="space-y-2">
              <li><Link to="/impressum" className="text-white/80 hover:text-white transition-colors">Impressum</Link></li>
              <li><Link to="/datenschutz" className="text-white/80 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link to="/agb" className="text-white/80 hover:text-white transition-colors">AGB</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Über uns</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-white/80 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="text-white/80 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/werte-ethik" className="text-white/80 hover:text-white transition-colors">Werte & Ethik</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Social Media</h3>
            <div className="flex items-center">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                 className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mt-2 text-center">
          <p className="text-white/90">© 2025 Vertragsklar – Gegründet in der Schweiz 🇨🇭</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
