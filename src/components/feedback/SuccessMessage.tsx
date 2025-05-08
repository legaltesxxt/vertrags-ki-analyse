
import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="bg-green-100 rounded-full p-3 mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Feedback übermittelt!</h3>
      <p className="text-gray-600">Vielen Dank für Ihre Nachricht. Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
    </div>
  );
};

export default SuccessMessage;
