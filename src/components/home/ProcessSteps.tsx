
import React from 'react';
import { FileText, Search, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ProcessSteps = () => {
  const steps = [{
    icon: <FileText className="h-8 w-8 text-legal-primary" />,
    title: "Vertrag hochladen",
    description: "Laden Sie Ihren Vertrag im PDF-Format hoch"
  }, {
    icon: <Search className="h-8 w-8 text-legal-primary" />,
    title: "KI-Analyse",
    description: "Unsere KI analysiert den Vertrag nach Schweizer Recht"
  }, {
    icon: <CheckCircle className="h-8 w-8 text-legal-primary" />,
    title: "Ergebnis sofort erhalten",
    description: "Erhalten Sie eine detaillierte rechtliche Bewertung"
  }];

  return <section id="how-it-works" className="my-16">
      <h2 className="text-2xl font-semibold text-legal-primary text-center mb-12">So funktioniert's :</h2>
      
      <div className="grid md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => <React.Fragment key={step.title}>
            <Card className="p-6 flex flex-col items-center text-center bg-white border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-full">
              <div className="mb-4 p-3 bg-legal-tertiary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-legal-primary">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm">
                {step.description}
              </p>
            </Card>
            
            {index < steps.length - 1 && <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-y-1/2 
                            text-legal-primary/20 font-bold text-4xl" style={{
          left: `${(index + 1) * (100 / 3)}%`,
          transform: 'translate(-50%, -50%)'
        }}>
                →
              </div>}
          </React.Fragment>)}
      </div>
    </section>;
};
export default ProcessSteps;
