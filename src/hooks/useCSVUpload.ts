
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchMultipleBookDetails, EnhancedBookDetails } from '@/utils/googleBooksApi';

interface BookData {
  title?: string;
  isbn?: string;
  found: boolean;
  details?: EnhancedBookDetails;
  condition: string;
  selected: boolean;
}

export const useCSVUpload = (onBooksAdded: () => void) => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      if (lines.length < 2) {
        toast.error("CSV file is empty or invalid");
        return;
      }
      
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      const isbnIndex = headers.indexOf('isbn');
      const titleIndex = headers.indexOf('title');
      
      if (isbnIndex === -1 && titleIndex === -1) {
        toast.error("CSV must contain either 'ISBN' or 'Title' column");
        return;
      }
      
      const parsedBooks: BookData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const isbn = isbnIndex !== -1 ? values[isbnIndex]?.trim() : undefined;
        const title = titleIndex !== -1 ? values[titleIndex]?.trim() : undefined;
        
        if ((isbn && isbn.length >= 10) || (title && title.length > 0)) {
          parsedBooks.push({
            isbn,
            title,
            found: false,
            condition: 'Good',
            selected: true
          });
        }
      }
      
      if (parsedBooks.length === 0) {
        toast.error("No valid book entries found in CSV");
        return;
      }
      
      toast.success(`Found ${parsedBooks.length} books in CSV`);
      setBooks(parsedBooks);
      
      await fetchBookDetails(parsedBooks);
      
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error("Failed to process CSV file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fetchBookDetails = async (booksToFetch: BookData[]) => {
    setProcessing(true);
    
    try {
      const updatedBooks = [...booksToFetch];
      let foundCount = 0;
      
      const identifiers = booksToFetch.map(book => ({
        isbn: book.isbn,
        title: book.title
      }));
      
      const results = await fetchMultipleBookDetails(identifiers);
      
      for (let i = 0; i < updatedBooks.length; i++) {
        const bookDetails = results[i];
        
        if (bookDetails) {
          updatedBooks[i] = {
            ...updatedBooks[i],
            found: true,
            details: bookDetails
          };
          
          foundCount++;
        }
        
        if (i % 3 === 0 || i === updatedBooks.length - 1) {
          setBooks([...updatedBooks]);
        }
      }
      
      setBooks(updatedBooks);
      toast.success(`Found details for ${foundCount} out of ${updatedBooks.length} books`);
      
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error("Error looking up some book details");
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    setBooks(books.map(book => ({
      ...book,
      selected: book.found ? selected : false
    })));
  };

  const toggleBookSelection = (index: number, selected: boolean) => {
    const updatedBooks = [...books];
    updatedBooks[index].selected = selected;
    setBooks(updatedBooks);
  };

  const updateBookCondition = (index: number, condition: string) => {
    const updatedBooks = [...books];
    updatedBooks[index].condition = condition;
    setBooks(updatedBooks);
  };

  const handleListBooks = async () => {
    const selectedBooks = books.filter(book => book.selected && book.found && book.details);
    
    if (selectedBooks.length === 0) {
      toast.error("No books selected to list");
      return;
    }

    try {
      setSubmitting(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("You must be logged in to list books");
        return;
      }

      let successCount = 0;
      
      for (const book of selectedBooks) {
        if (!book.details) continue;
        
        try {
          let bookId;
          let existingBookData = null;
          let bookQueryError = null;
          
          if (book.details.isbn13) {
            const query = await supabase
              .from('books_db')
              .select('id')
              .eq('isbn_13', book.details.isbn13);
            existingBookData = query.data;
            bookQueryError = query.error;
          } else if (book.details.isbn10) {
            const query = await supabase
              .from('books_db')
              .select('id')
              .eq('isbn_10', book.details.isbn10);
            existingBookData = query.data;
            bookQueryError = query.error;
          } else {
            const authorString = book.details.authors.join(', ');
            const query = await supabase
              .from('books_db')
              .select('id')
              .eq('title', book.details.title)
              .eq('author', authorString);
            existingBookData = query.data;
            bookQueryError = query.error;
          }
          
          if (bookQueryError) {
            throw bookQueryError;
          }
          
          if (existingBookData && existingBookData.length > 0) {
            bookId = existingBookData[0].id;
          } else {
            const bookData = {
              title: book.details.title,
              author: book.details.authors.join(', '),
              isbn_10: book.details.isbn10 || null,
              isbn_13: book.details.isbn13 || null,
              publisher: book.details.publisher || null,
              published_date: book.details.publishedDate || null,
              description: book.details.description || null,
              categories: book.details.categories?.join(', ') || null,
              page_count: book.details.pageCount || null,
              cover_image_url: book.details.imageLinks?.thumbnail || null,
              language: book.details.language || 'en',
              google_books_id: book.details.googleBooksId || null
            };
            
            const { data: newBookData, error: insertBookError } = await supabase
              .from('books_db')
              .insert(bookData)
              .select();
            
            if (insertBookError) {
              throw insertBookError;
            }
            
            bookId = newBookData[0].id;
          }
          
          const inventoryData = {
            book_id: bookId,
            lender_id: sessionData.session.user.id,
            condition: book.condition,
            available: true,
            lending_duration: 14
          };
          
          const { error: inventoryError } = await supabase
            .from('inventory_new')
            .insert(inventoryData);
          
          if (inventoryError) {
            console.warn('Failed to insert into inventory_new');
            throw inventoryError;
          }
          
          successCount++;
        } catch (error) {
          console.error('Error adding book:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} books listed successfully!`);
        setBooks([]);
        onBooksAdded();
      } else {
        toast.error("Failed to list any books. Please try again.");
      }
    } catch (error) {
      console.error('Error adding books:', error);
      toast.error("Failed to list the books");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    books,
    uploading,
    processing,
    submitting,
    fileInputRef,
    handleFileUpload,
    handleSelectAll,
    toggleBookSelection,
    updateBookCondition,
    handleListBooks
  };
};
