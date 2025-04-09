
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  LogIn, 
  UserCircle, 
  LogOut, 
  PlusCircle,
  BookOpen,
  Moon,
  Sun
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for dark mode preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Check for an existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-book-maroon flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-book-warm" />
            <span className="text-book-warm">Books</span>Bridge
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by title..." 
              className="w-full pl-10 border-book-warm/50"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch 
              checked={darkMode} 
              onCheckedChange={toggleDarkMode}
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>

          {user ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-book-warm text-book-warm hover:bg-book-warm/10"
                asChild
              >
                <Link to="/my-books">
                  <PlusCircle className="h-4 w-4 mr-1" /> Add a Book
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-books" className="cursor-pointer">My Books</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 cursor-pointer flex items-center" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              size="sm" 
              className="bg-book-warm hover:bg-book-warm/90"
              asChild
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Log In / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="md:hidden flex items-center px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by title..." 
            className="w-full pl-10 border-book-warm/50"
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
