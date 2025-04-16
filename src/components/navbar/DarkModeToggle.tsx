
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-amber-400" />
      <Switch 
        checked={darkMode} 
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-violet-600"
      />
      <Moon className="h-4 w-4 text-white" />
    </div>
  );
};

export default DarkModeToggle;
