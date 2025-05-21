
import React from 'react';

const DemoInfoBanner: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
      <p className="text-sm text-amber-800">
        <strong>Demo-Analyse:</strong> Diese Seite zeigt Beispiel-Analysen. Sie können zwischen verschiedenen Demo-Analysen wechseln.
      </p>
    </div>
  );
};

export default DemoInfoBanner;
