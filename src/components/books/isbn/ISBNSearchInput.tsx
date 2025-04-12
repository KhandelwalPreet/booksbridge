
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Loader2 } from 'lucide-react';

interface ISBNSearchInputProps {
  isbn: string;
  setIsbn: (isbn: string) => void;
  loading: boolean;
  onSearch: () => void;
}

const ISBNSearchInput = ({ isbn, setIsbn, loading, onSearch }: ISBNSearchInputProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-2">
        <Label htmlFor="isbn">ISBN Number</Label>
        <div className="relative">
          <Input
            id="isbn"
            placeholder="Enter ISBN-10 or ISBN-13"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="pr-20"
          />
          <Button 
            className="absolute right-0 top-0 h-full rounded-l-none bg-[#2E86AB] hover:bg-[#2E86AB]/90"
            onClick={onSearch}
            disabled={loading || isbn.length < 10}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
            Find
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Enter a valid ISBN to search for the book</p>
      </div>
    </div>
  );
};

export default ISBNSearchInput;
