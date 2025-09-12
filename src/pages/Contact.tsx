
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { Mail, Clock, MapPin } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

const Contact = () => {
  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <Mail className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Kontakt</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Haben Sie Fragen oder Feedback für uns? Nehmen Sie gerne Kontakt mit uns auf.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-border/50">
            <Mail className="h-8 w-8 text-legal-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">E-Mail</h3>
            <p className="text-slate-600 text-center">info@vertragsklar.ch</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-border/50">
            <Clock className="h-8 w-8 text-legal-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">Antwortzeit</h3>
            <p className="text-slate-600 text-center">Innerhalb von 48 Stunden</p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-border/50">
            <Mail className="h-8 w-8 text-legal-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">Sprachen</h3>
            <p className="text-slate-600 text-center">Deutsch & Englisch<br />Schweizer Recht</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <h2 className="text-xl font-medium text-legal-primary mb-6">Schreiben Sie uns</h2>
          <FeedbackForm />
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default Contact;
