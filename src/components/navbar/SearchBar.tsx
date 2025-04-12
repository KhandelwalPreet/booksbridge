
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onBookClick?: (id: string) => void;
  mobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onBookClick, mobile = false }) => {
  const { 
    searchQuery, 
    setSearchQuery,
    searchResults, 
    isSearching, 
    showResults,
    setShowResults, 
    searchRef,
    handleResultClick,
    handleSearchSubmit
  } = useSearch(onSearch, onBookClick);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={(e) => handleSearchSubmit(e)} className="relative w-full">
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
  );
};

export default SearchBar;
