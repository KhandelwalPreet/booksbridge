
import React, { useEffect } from 'react';
import Logo from './navbar/Logo';
import SearchBar from './navbar/SearchBar';
import UserMenu from './navbar/UserMenu';
import DarkModeToggle from './navbar/DarkModeToggle';
import { useAuthState } from '@/hooks/useAuthState';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onBookClick?: (id: string) => void;
}

const Navbar = ({ onSearch, onBookClick }: NavbarProps) => {
  const { user } = useAuthState();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <SearchBar onSearch={onSearch} onBookClick={onBookClick} />
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <UserMenu user={user} />
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="md:hidden flex items-center px-4 pb-3">
          <SearchBar onSearch={onSearch} onBookClick={onBookClick} mobile />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
