import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { Mail, Phone, MapPin } from 'lucide-react';
const Contact = () => {
  return <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <Mail className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Kontakt</h1>
          <p className="text-slate-600 max-w-xl mx-auto">Haben Sie Fragen oder Feedback für uns? Nehmen Sie gerne Kontakt mit uns auf.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50 mb-10">
          <p className="text-center text-slate-500">
            Diese Seite wird in Kürze mit Kontaktinformationen gefüllt.
          </p>
        </div>
      </div>
    </AnalysisLayout>;
};
export default Contact;