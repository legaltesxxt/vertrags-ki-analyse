
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Home } from 'lucide-react';

interface DemoTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const DemoTabs: React.FC<DemoTabsProps> = ({ currentTab, onTabChange }) => {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full mb-6">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="arbeitsvertrag" className="flex items-center gap-2">
          <FileText size={16} />
          Arbeitsvertrag
        </TabsTrigger>
        <TabsTrigger value="mietvertrag" className="flex items-center gap-2">
          <Home size={16} />
          Mietvertrag
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DemoTabs;
