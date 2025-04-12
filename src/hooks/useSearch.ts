
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
}

interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: SearchResult[];
  isSearching: boolean;
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  searchRef: React.RefObject<HTMLDivElement>;
  performSearch: (query: string) => Promise<void>;
  handleResultClick: (id: string, onBookClick?: (id: string) => void) => Promise<void>;
  handleSearchSubmit: (e: React.FormEvent, onSearch?: (query: string) => void) => void;
}

export const useSearch = (
  onSearch?: (query: string) => void, 
  onBookClick?: (id: string) => void
): UseSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  const handleResultClick = async (id: string) => {
    if (!onBookClick) return;
    
    try {
      const { data, error } = await supabase
        .from('inventory_new')
        .select('id')
        .eq('book_id', id)
        .eq('available', true)
        .limit(1);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        onBookClick(data[0].id);
        setShowResults(false);
        setSearchQuery('');
      } else if (onSearch) {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
      setShowResults(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showResults,
    setShowResults,
    searchRef,
    performSearch,
    handleResultClick,
    handleSearchSubmit
  };
};
