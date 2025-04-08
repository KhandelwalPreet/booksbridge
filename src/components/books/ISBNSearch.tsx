
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

interface BookDetails {
  title: string;
  authors: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  publishedDate?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}

interface ISBNSearchProps {
  onBookAdded: () => void;
}

const ISBNSearch = ({ onBookAdded }: ISBNSearchProps) => {
  const [isbn, setIsbn] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [condition, setCondition] = useState('Good');
  const [notes, setNotes] = useState('');
  const [lendingDuration, setLendingDuration] = useState('14');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchBookByISBN = async () => {
    if (!isbn || isbn.length < 10) {
      toast.error("Please enter a valid ISBN");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        setBookDetails(bookInfo);
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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("You must be logged in to list a book");
        return;
      }

      // Find ISBN-13 or fallback to ISBN-10
      let finalIsbn = isbn;
      if (bookDetails.industryIdentifiers) {
        const isbn13 = bookDetails.industryIdentifiers.find(id => id.type === 'ISBN_13');
        const isbn10 = bookDetails.industryIdentifiers.find(id => id.type === 'ISBN_10');
        finalIsbn = isbn13?.identifier || isbn10?.identifier || isbn;
      }
      
      // Create book data
      const bookData = {
        title: bookDetails.title,
        author: bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author',
        isbn: finalIsbn,
        publisher: bookDetails.publisher || null,
        published_date: bookDetails.publishedDate || null,
        description: bookDetails.description || null,
        categories: bookDetails.categories ? bookDetails.categories.join(', ') : null,
        page_count: bookDetails.pageCount || null,
        condition: condition, // Required field
        condition_notes: notes || null,
        lending_duration: parseInt(lendingDuration), // Required field
        thumbnail_url: bookDetails.imageLinks?.thumbnail || null,
        user_id: sessionData.session.user.id // Required field
      };

      // Insert into database
      const { error } = await supabase.from('inventory').insert(bookData);

      if (error) {
        throw error;
      }

      toast.success("Book listed successfully!");
      setBookDetails(null);
      setIsbn('');
      setCondition('Good');
      setNotes('');
      setLendingDuration('14');
      setConfirmed(false);
      onBookAdded();
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error("Failed to list the book");
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
              className="absolute right-0 top-0 h-full rounded-l-none"
              onClick={fetchBookByISBN}
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
        <Card className="mb-6">
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
                <h3 className="text-xl font-semibold">{bookDetails.title}</h3>
                <p className="text-gray-600">by {bookDetails.authors ? bookDetails.authors.join(', ') : 'Unknown Author'}</p>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Publisher</p>
                    <p className="text-sm">{bookDetails.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Published Date</p>
                    <p className="text-sm">{bookDetails.publishedDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pages</p>
                    <p className="text-sm">{bookDetails.pageCount || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-sm">{bookDetails.categories ? bookDetails.categories.join(', ') : 'N/A'}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">Description</p>
                <p className="text-sm line-clamp-3">{bookDetails.description || 'No description available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Book Condition and Notes */}
      {bookDetails && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="lending-duration">Lending Duration (days)</Label>
              <Select value={lendingDuration} onValueChange={setLendingDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lending period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
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
            className="w-full"
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
