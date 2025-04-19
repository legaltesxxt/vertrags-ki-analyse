
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalysis: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-12 text-center text-gray-500">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-lg">Keine Analyseergebnisse verfügbar.</p>
      <p className="mt-2 text-sm">Bitte laden Sie einen Vertrag hoch, um eine Analyse zu erhalten.</p>
      <Button 
        variant="default" 
        className="mt-6 bg-legal-primary hover:bg-legal-secondary"
        onClick={() => navigate('/')}
      >
        Zur Startseite
      </Button>
    </div>
  );
};

export default EmptyAnalysis;
