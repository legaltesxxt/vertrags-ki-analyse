
import React from 'react';
import { cn } from "@/lib/utils";

type RiskLevel = 'niedrig' | 'mittel' | 'hoch';

interface RiskMeterProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ 
  risk, 
  size = 'md', 
  showLabel = true,
  className 
}) => {
  // Festlegen der Rotation basierend auf dem Risikolevel
  const rotationDegrees = {
    niedrig: -60,
    mittel: 0,
    hoch: 60
  };

  // Größeneinstellungen basierend auf der Größenoption
  const sizeClasses = {
    sm: "w-16 h-10",
    md: "w-24 h-14",
    lg: "w-32 h-20"
  };

  // Pointer-Größe basierend auf der Größenoption
  const pointerSizeClasses = {
    sm: "w-1.5 h-6",
    md: "w-2 h-8",
    lg: "w-2.5 h-10"
  };

  // Emoji basierend auf dem Risikolevel
  const emoji = {
    niedrig: "😊",
    mittel: "😐",
    hoch: "😟"
  };

  // Label-Text basierend auf dem Risikolevel
  const labels = {
    niedrig: "Niedriges Risiko",
    mittel: "Mittleres Risiko",
    hoch: "Hohes Risiko"
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Der Halbkreis-Hintergrund */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-legal-risk-low via-legal-risk-medium to-legal-risk-high rounded-t-full"></div>
        </div>
        
        {/* Der Zeiger */}
        <div 
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom rounded-t bg-gray-700 transition-transform duration-500 ease-in-out",
            pointerSizeClasses[size]
          )}
          style={{ transform: `translateX(-50%) rotate(${rotationDegrees[risk]}deg)` }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Emojis */}
        <div className="absolute top-1/3 left-0 transform -translate-x-1/2 text-sm sm:text-base md:text-lg">
          {size !== 'sm' ? emoji.niedrig : ''}
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base md:text-lg">
          {size !== 'sm' ? emoji.mittel : ''}
        </div>
        <div className="absolute top-1/3 right-0 transform translate-x-1/2 text-sm sm:text-base md:text-lg">
          {size !== 'sm' ? emoji.hoch : ''}
        </div>
      </div>
      
      {/* Das Label */}
      {showLabel && (
        <div className={`mt-2 text-${size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'base'} font-medium`}>
          {labels[risk]}
        </div>
      )}
    </div>
  );
};

export default RiskMeter;
