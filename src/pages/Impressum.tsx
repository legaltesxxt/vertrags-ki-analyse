
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { Building, Mail, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Impressum = () => {
  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <Building className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Impressum</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Kontakt und rechtliche Informationen.
          </p>
        </div>

        <Card className="bg-white rounded-xl shadow-sm border border-border/50 mb-10">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-legal-primary mb-2">Unternehmensangaben</h2>
                <div className="pl-4 border-l-2 border-legal-tertiary">
                  <p className="text-slate-700">Vertragsklar (Startup)</p>
                  <p className="text-slate-700">Schatzacher 16</p>
                  <p className="text-slate-700">2564 Bellmund, Schweiz</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="text-legal-primary mt-1" size={18} />
                <div>
                  <h3 className="font-medium text-legal-primary">E-Mail</h3>
                  <a href="mailto:info@vertragsklar.ch" className="text-legal-secondary hover:underline">
                    info@vertragsklar.ch
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="text-legal-primary mt-1" size={18} />
                <div>
                  <h3 className="font-medium text-legal-primary">Vertretungsberechtigt</h3>
                  <p className="text-slate-700">Alex Dalla Bona (Geschäftsführer)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalysisLayout>
  );
};

export default Impressum;
