import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DemoInfoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <AlertTitle className="text-blue-700">Demo-Analyse</AlertTitle>
            <AlertDescription className="text-blue-600">
              Diese Demo zeigt Ihnen, wie unsere KI Ihren Vertrag analysieren würde. 
              Wählen Sie zwischen einem Arbeitsvertrag oder Mietvertrag, um die Analyse zu sehen.
              <br />
              <strong>Für eine echte Analyse wählen Sie bitte eines unserer Pakete.</strong>
            </AlertDescription>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/preise')}
          className="bg-legal-primary hover:bg-legal-primary/90 text-white whitespace-nowrap"
          size="sm"
        >
          Jetzt eigenen Vertrag analysieren
        </Button>
      </div>
    </Alert>
  );
};
export default DemoInfoBanner;