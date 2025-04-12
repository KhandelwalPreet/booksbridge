
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
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={darkMode} 
        onCheckedChange={toggleDarkMode}
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export default DarkModeToggle;
