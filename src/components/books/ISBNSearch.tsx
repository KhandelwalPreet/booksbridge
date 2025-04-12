import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { fetchBookByISBN, EnhancedBookDetails } from '@/utils/googleBooksApi';

interface ISBNSearchProps {
  onBookAdded: () => void;
}

const ISBNSearch = ({ onBookAdded }: ISBNSearchProps) => {
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState<EnhancedBookDetails | null>(null);
  const [condition, setCondition] = useState('Good');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleISBNSearch = async () => {
    if (!isbn || isbn.length < 10) {
      toast.error("Please enter a valid ISBN");
      return;
    }

    try {
      setLoading(true);
      const bookData = await fetchBookByISBN(isbn);
      
      if (bookData) {
        setBookDetails(bookData);
        toast.success("Book found!");
      } else {
        toast.error("No book found with that ISBN");
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async () => {
    if (!bookDetails) return;
    if (!confirmed) {
      toast.error("Please confirm the book details");
      return;
    }

    try {
      setSubmitting(true);
      
      // Get current user session
      const sessionData = await supabase.auth.getSession();
      
      if (!sessionData || !sessionData.data.session) {
        toast.error("You must be logged in to list a book");
        return;
      }

      // First check if the book already exists in books_db
      let bookId;
      let existingBookData = null;
      let bookQueryError = null;
      
      if (bookDetails.isbn13) {
        const query = await supabase
          .from('books_db')
          .select('id')
          .eq('isbn_13', bookDetails.isbn13);
          
        existingBookData = query.data;
        bookQueryError = query.error;
      } else if (bookDetails.isbn10) {
        const query = await supabase
          .from('books_db')
          .select('id')
          .eq('isbn_10', bookDetails.isbn10);
          
        existingBookData = query.data;
        bookQueryError = query.error;
      } else {
        // If no ISBN available, check by title and author
        const authorString = bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author';
        const query = await supabase
          .from('books_db')
          .select('id')
          .eq('title', bookDetails.title)
          .eq('author', authorString);
          
        existingBookData = query.data;
        bookQueryError = query.error;
      }
      
      if (bookQueryError) {
        throw bookQueryError;
      }
      
      if (existingBookData && existingBookData.length > 0) {
        // Book already exists, use its ID
        bookId = existingBookData[0].id;
      } else {
        // Book doesn't exist, create it in books_db with enhanced data
        const bookData = {
          title: bookDetails.title,
          author: bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author',
          isbn_10: bookDetails.isbn10 || null,
          isbn_13: bookDetails.isbn13 || null,
          publisher: bookDetails.publisher || null,
          published_date: bookDetails.publishedDate || null,
          description: bookDetails.description || null,
          categories: bookDetails.categories ? bookDetails.categories.join(', ') : null,
          page_count: bookDetails.pageCount || null,
          cover_image_url: bookDetails.imageLinks?.thumbnail || null,
          language: bookDetails.language || 'en',
          google_books_id: bookDetails.googleBooksId || null
        };
        
        const { data: newBookData, error: insertBookError } = await supabase
          .from('books_db')
          .insert(bookData)
          .select();
        
        if (insertBookError || !newBookData) {
          throw insertBookError || new Error("Failed to insert book data");
        }
        
        bookId = newBookData[0].id;
      }
      
      // Now create the inventory listing with fixed lending duration of 14 days
      const inventoryData = {
        book_id: bookId,
        lender_id: sessionData.data.session.user.id,
        condition: condition,
        condition_notes: notes || null,
        available: true,
        lending_duration: 14, // Fixed at 14 days as requested
        pickup_preferences: null
      };
      
      const { error: inventoryError } = await supabase
        .from('inventory_new')
        .insert(inventoryData);
      
      if (inventoryError) {
        console.warn('Failed to insert into inventory_new');
        throw inventoryError;
      }

      toast.success("Book listed successfully!");
      setBookDetails(null);
      setIsbn('');
      setCondition('Good');
      setNotes('');
      setConfirmed(false);
      onBookAdded();
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast.error(error.message || "Failed to list the book");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* ISBN Search Input */}
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
              onClick={handleISBNSearch}
              disabled={loading || isbn.length < 10}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
              Find
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Enter a valid ISBN to search for the book</p>
        </div>
      </div>

      {/* Book Details Card */}
      {bookDetails && (
        <Card className="mb-6 shadow-md border border-[#E5E7EB] rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-32 h-44 bg-gray-100 rounded-md overflow-hidden">
                  {bookDetails.imageLinks?.thumbnail ? (
                    <img 
                      src={bookDetails.imageLinks.thumbnail} 
                      alt={bookDetails.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Cover
                    </div>
                  )}
                </div>
              </div>
              
              {/* Book Info */}
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-[#1C1C1C]">{bookDetails.title}</h3>
                <p className="text-[#6B7280]">by {bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author'}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <p className="text-sm text-[#6B7280]">Publisher</p>
                    <p className="text-sm">{bookDetails.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Published Date</p>
                    <p className="text-sm">{bookDetails.publishedDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Pages</p>
                    <p className="text-sm">{bookDetails.pageCount || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Categories</p>
                    <p className="text-sm">{bookDetails.categories ? bookDetails.categories.join(', ') : 'N/A'}</p>
                  </div>
                  {bookDetails.language && (
                    <div>
                      <p className="text-sm text-[#6B7280]">Language</p>
                      <p className="text-sm">{bookDetails.language.toUpperCase()}</p>
                    </div>
                  )}
                  {bookDetails.isbn13 && (
                    <div>
                      <p className="text-sm text-[#6B7280]">ISBN-13</p>
                      <p className="text-sm">{bookDetails.isbn13}</p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#6B7280] mt-4">Description</p>
                <p className="text-sm line-clamp-3">{bookDetails.description || 'No description available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book Condition and Notes */}
      {bookDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Book Condition</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Condition Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Add any specific details about the condition of your book"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="confirm" 
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm the book details are correct
            </label>
          </div>

          <Button 
            className="w-full bg-[#F18F01] hover:bg-[#F18F01]/90 mt-4"
            onClick={addBook}
            disabled={submitting || !confirmed}
          >
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Book...</>
            ) : (
              <><Check className="mr-2 h-4 w-4" /> List This Book</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ISBNSearch;
