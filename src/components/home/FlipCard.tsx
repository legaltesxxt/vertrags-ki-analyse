import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Check, X } from 'lucide-react';

interface ComparisonData {
  expertise: { value: string; isPositive: boolean };
  kosten: { value: string; isPositive: boolean };
  risikoAnalyse: { value: string; isPositive: boolean };
  dauer: { value: string; isPositive: boolean };
  kritischeKlauseln: { value: string; isPositive: boolean };
  bedienbarkeit: { value: string; isPositive: boolean };
}

interface FlipCardProps {
  title: string;
  description: string;
  comparison: ComparisonData;
  className?: string;
}

const FlipCard = ({ title, description, comparison, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const StatusIcon = ({ isPositive }: { isPositive: boolean }) => (
    isPositive ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />
  );

  const ComparisonRow = ({ label, data }: { label: string; data: { value: string; isPositive: boolean } }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{data.value}</span>
        <StatusIcon isPositive={data.isPositive} />
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "h-[420px] perspective cursor-pointer",
        className
      )}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-all duration-500 preserve-3d",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front */}
        <div className="absolute h-full w-full backface-hidden">
          <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-legal-primary mb-3">{title}</h3>
            <div className="space-y-2">
              <ComparisonRow label="Expertise" data={comparison.expertise} />
              <ComparisonRow label="Kosten" data={comparison.kosten} />
              <ComparisonRow label="Risiko-Analyse" data={comparison.risikoAnalyse} />
              <ComparisonRow label="Dauer" data={comparison.dauer} />
              <ComparisonRow label="Kritische Klauseln" data={comparison.kritischeKlauseln} />
              <ComparisonRow label="Bedienbarkeit" data={comparison.bedienbarkeit} />
            </div>
            <p className="text-xs text-muted-foreground mt-auto text-center">Klicken zum Umdrehen</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute h-full w-full [transform:rotateY(180deg)] backface-hidden">
          <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-legal-primary mb-3">{title}</h3>
            <p className="text-sm text-slate-600 overflow-y-auto flex-grow">{description}</p>
            <p className="text-xs text-muted-foreground mt-3 text-center">Klicken zum Zurückdrehen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
