
import React, { useEffect, useState, useRef } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import BookCard from './BookCard';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onBookClick?: (id: string) => void;
}

interface SearchResult {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
}

const Navbar = ({ onSearch, onBookClick }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

    // Add click event listener to close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      // First search the books_db table for matching titles
      const { data, error } = await supabase
        .from('books_db')
        .select('id, title, author, cover_image_url')
        .ilike('title', `%${query}%`)
        .limit(5);
        
      if (error) throw error;
      
      setSearchResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching for books:', error);
    } finally {
      setIsSearching(false);
    }
  };

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
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      setShowResults(false);
    }
  };

  const handleResultClick = async (id: string) => {
    // When a search result is clicked, we need to find the inventory item with this book_id
    try {
      const { data, error } = await supabase
        .from('inventory_new')
        .select('id')
        .eq('book_id', id)
        .eq('available', true)
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0 && onBookClick) {
        onBookClick(data[0].id);
        setShowResults(false);
        setSearchQuery('');
      } else if (onSearch) {
        // If no inventory item found, use the search by title as fallback
        const book = searchResults.find(book => book.id === id);
        if (book) {
          onSearch(book.title);
          setShowResults(false);
          setSearchQuery('');
        }
      }
    } catch (error) {
      console.error('Error finding inventory item:', error);
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
          <div ref={searchRef} className="relative w-full">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by title..." 
                className="w-full pl-10 border-book-warm/50"
                value={searchQuery}
                onChange={handleSearchInput}
              />
            </form>
            
            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
                <div className="p-2">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {isSearching ? 'Searching...' : 'Search Results'}
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {searchResults.map((result) => (
                      <div 
                        key={result.id} 
                        className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer"
                        onClick={() => handleResultClick(result.id)}
                      >
                        <div className="h-12 w-8 flex-shrink-0">
                          <img 
                            src={result.cover_image_url || '/placeholder.svg'} 
                            alt={result.title}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm truncate">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{result.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchQuery.trim().length >= 2 && (
                    <Button 
                      variant="ghost" 
                      className="w-full mt-2 text-book-warm" 
                      size="sm"
                      onClick={() => { 
                        if (onSearch) onSearch(searchQuery); 
                        setShowResults(false);
                      }}
                    >
                      View all results
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
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
                <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg dark:bg-card">
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
        <div ref={searchRef} className="relative w-full">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by title..." 
              className="w-full pl-10 border-book-warm/50"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </form>
          
          {/* Mobile search results dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
              <div className="p-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {isSearching ? 'Searching...' : 'Search Results'}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-auto">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id} 
                      className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer"
                      onClick={() => handleResultClick(result.id)}
                    >
                      <div className="h-12 w-8 flex-shrink-0">
                        <img 
                          src={result.cover_image_url || '/placeholder.svg'} 
                          alt={result.title}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {searchQuery.trim().length >= 2 && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-book-warm" 
                    size="sm"
                    onClick={() => { 
                      if (onSearch) onSearch(searchQuery); 
                      setShowResults(false);
                    }}
                  >
                    View all results
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
