
import React, { useState } from 'react';
import { cn } from "@/lib/utils"

interface FlipCardProps {
  title: string;
  description: string;
  className?: string;
}

const FlipCard = ({ title, description, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "h-[300px] w-full perspective cursor-pointer",
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
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border/50 bg-white p-6 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-legal-primary mb-4">{title}</h3>
            <p className="text-sm text-muted-foreground mt-auto">Klicken zum Umdrehen</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute h-full w-full [transform:rotateY(180deg)] backface-hidden">
          <div className="flex h-full flex-col rounded-xl border border-border/50 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600 mb-4">{description}</p>
            <p className="text-sm text-muted-foreground mt-auto text-center">Klicken zum Zurückdrehen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
