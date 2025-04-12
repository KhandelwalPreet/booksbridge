
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchBookByISBN, EnhancedBookDetails } from '@/utils/googleBooksApi';

export const useISBNSearch = (onBookAdded: () => void) => {
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
      reset();
      onBookAdded();
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast.error(error.message || "Failed to list the book");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setBookDetails(null);
    setIsbn('');
    setCondition('Good');
    setNotes('');
    setConfirmed(false);
  };

  return {
    isbn,
    setIsbn,
    loading,
    bookDetails,
    condition,
    setCondition,
    notes,
    setNotes,
    confirmed,
    setConfirmed,
    submitting,
    handleISBNSearch,
    addBook
  };
};
