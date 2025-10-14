
import React from 'react';
import AnalysisLayout from '@/components/analysis/AnalysisLayout';
import { BookOpen } from 'lucide-react';

const Blog = () => {
  return (
    <AnalysisLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-legal-tertiary p-4 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-legal-primary" />
          </div>
          <h1 className="text-3xl font-light text-legal-primary mb-2">Blog</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Aktuelle Artikel und Neuigkeiten rund um Vertragsklar und Vertragsrecht.
          </p>
        </div>

        <div className="space-y-6">
          {/* Platzhalter für zukünftige Blog-Posts */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-border/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="text-sm text-slate-500 mb-2">
                  {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 className="text-2xl font-semibold text-legal-primary mb-4">
                  Willkommen bei Vertragsklar
                </h2>
                <p className="text-slate-600 mb-4">
                  Hier werden wir regelmäßig Updates, Neuigkeiten und wichtige Informationen rund um Vertragsklar und Vertragsrecht veröffentlichen.
                </p>
                <p className="text-slate-500 italic">
                  Weitere Blog-Artikel folgen in Kürze...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnalysisLayout>
  );
};

export default Blog;
