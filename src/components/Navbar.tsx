
import React, { useState, useEffect } from 'react';
import Logo from './navbar/Logo';
import SearchBar from './navbar/SearchBar';
import UserMenu from './navbar/UserMenu';
import DarkModeToggle from './navbar/DarkModeToggle';
import { useAuthState } from '@/hooks/useAuthState';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { MenuIcon, X, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onBookClick?: (id: string) => void;
}

const Navbar = ({ onSearch, onBookClick }: NavbarProps) => {
  const { user } = useAuthState();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input 
              type="search" 
              placeholder="Search by title..." 
              className="w-full px-4 py-2 rounded-md bg-white/10 border-0 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          {user ? (
            <Button 
              size="sm" 
              className="hidden md:flex bg-amber-600 hover:bg-amber-700 text-white"
              asChild
            >
              <Link to="/list-book">
                <PlusCircle className="h-4 w-4 mr-1" /> Add a Book
              </Link>
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="hidden md:flex bg-amber-600 hover:bg-amber-700 text-white"
              asChild
            >
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          )}
          
          <UserMenu user={user} />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10">
          <div className="flex flex-col py-4 px-4 space-y-4">
            <Link 
              to="/" 
              className="text-white hover:text-amber-400 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/my-books" 
              className="text-white hover:text-amber-400 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Library
            </Link>
            <Link 
              to="/list-book" 
              className="text-white hover:text-amber-400 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Share Books
            </Link>
            <Link 
              to="/messages" 
              className="text-white hover:text-amber-400 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Messages
            </Link>
            <SearchBar onSearch={onSearch} onBookClick={onBookClick} mobile />
          </div>
        </div>
      )}
      
      {/* Mobile Search Bar (Always visible on mobile) */}
      {isMobile && !isOpen && (
        <div className="md:hidden flex items-center px-4 pb-3">
          <SearchBar onSearch={onSearch} onBookClick={onBookClick} mobile />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
