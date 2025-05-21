
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const DemoInfoBanner: React.FC = () => {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500" />
        <div>
          <AlertTitle className="text-blue-700">Demo-Modus</AlertTitle>
          <AlertDescription className="text-blue-600">
            Dies ist eine Demo-Analyse mit vordefinierten Beispieldaten. 
            Wählen Sie zwischen einem Arbeitsvertrag oder Mietvertrag, um die Analyse zu sehen.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default DemoInfoBanner;
