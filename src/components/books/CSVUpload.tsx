
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CSVUploadProps {
  onBooksAdded: () => void;
}

interface BookData {
  title?: string;
  isbn?: string;
  found: boolean;
  details?: {
    title: string;
    authors: string[];
    isbn: string;
    imageLinks?: {
      thumbnail?: string;
    };
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
  };
  condition: string;
  selected: boolean;
}

const CSVUpload = ({ onBooksAdded }: CSVUploadProps) => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
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
      
      // Parse headers
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
      const isbnIndex = headers.indexOf('isbn');
      const titleIndex = headers.indexOf('title');
      
      if (isbnIndex === -1 && titleIndex === -1) {
        toast.error("CSV must contain either 'ISBN' or 'Title' column");
        return;
      }
      
      // Parse books
      const parsedBooks: BookData[] = [];
      
      // Skip headers row
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
      
      // Start looking up book details
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
      
      for (let i = 0; i < updatedBooks.length; i++) {
        const book = updatedBooks[i];
        
        // Create search query based on ISBN or title
        const query = book.isbn 
          ? `isbn:${book.isbn}` 
          : `intitle:${book.title}`;
        
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            const bookInfo = data.items[0].volumeInfo;
            
            // Get ISBN from response if available
            let foundIsbn = book.isbn || '';
            if (bookInfo.industryIdentifiers) {
              const isbn13 = bookInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_13');
              const isbn10 = bookInfo.industryIdentifiers.find((id: any) => id.type === 'ISBN_10');
              foundIsbn = isbn13?.identifier || isbn10?.identifier || foundIsbn;
            }
            
            updatedBooks[i] = {
              ...book,
              found: true,
              details: {
                title: bookInfo.title,
                authors: bookInfo.authors || ['Unknown Author'],
                isbn: foundIsbn,
                imageLinks: bookInfo.imageLinks,
                publisher: bookInfo.publisher,
                publishedDate: bookInfo.publishedDate,
                pageCount: bookInfo.pageCount
              }
            };
            
            foundCount++;
          }
          
          // Update state periodically to show progress
          if (i % 3 === 0 || i === updatedBooks.length - 1) {
            setBooks([...updatedBooks]);
          }
          
        } catch (error) {
          console.error(`Error fetching details for book ${i}:`, error);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
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
    const selectedBooks = books.filter(book => book.selected && book.found);
    
    if (selectedBooks.length === 0) {
      toast.error("No books selected to list");
      return;
    }

    try {
      setSubmitting(true);
      
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error("You must be logged in to list books");
        return;
      }

      // Create book data for each selected book
      const booksToInsert = selectedBooks.map(book => ({
        title: book.details!.title,
        author: book.details!.authors.join(', '),
        isbn: book.details!.isbn,
        publisher: book.details!.publisher || null,
        published_date: book.details!.publishedDate || null,
        page_count: book.details!.pageCount || null,
        condition: book.condition,
        lending_duration: 14, // Default to 14 days
        thumbnail_url: book.details!.imageLinks?.thumbnail || null,
        user_id: sessionData.session.user.id
      }));

      // Insert into database
      const { error } = await supabase.from('inventory').insert(booksToInsert);

      if (error) {
        throw error;
      }

      toast.success(`${selectedBooks.length} books listed successfully!`);
      setBooks([]);
      onBooksAdded();
    } catch (error) {
      console.error('Error adding books:', error);
      toast.error("Failed to list the books");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Upload Instructions */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">CSV Upload Instructions</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
            <li>Create a CSV file with a header row containing "ISBN" and/or "Title" columns</li>
            <li>Each row should represent one book</li>
            <li>ISBNs should be 10 or 13 digits without dashes</li>
            <li>We'll try to find book details using Google Books API</li>
          </ul>
        </div>
        
        {/* File Upload UI */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <FileText className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-center text-gray-600 mb-4">
            Click to browse or drag and drop your CSV file
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
            disabled={uploading || processing}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || processing}
          >
            {uploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Upload CSV</>
            )}
          </Button>
        </div>
      </div>

      {/* Processing Indicator */}
      {processing && (
        <div className="text-center py-4 mb-6">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-book-warm" />
          <p className="text-sm text-gray-600">Looking up book details...</p>
        </div>
      )}

      {/* Book Results */}
      {books.length > 0 && !processing && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Found {books.length} books</h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="select-all" className="text-sm">Select all found</Label>
              <Checkbox 
                id="select-all" 
                checked={books.filter(b => b.found).every(b => b.selected)}
                onCheckedChange={handleSelectAll}
              />
            </div>
          </div>

          <div className="mb-6">
            <ScrollArea className="h-[350px] rounded-md border">
              <div className="p-4 grid gap-4">
                {books.map((book, index) => (
                  <Card key={index} className={book.found ? "" : "opacity-60"}>
                    <CardContent className="p-4">
                      <div className="flex">
                        {/* Book Found Status */}
                        <div className="mr-3 flex-shrink-0">
                          {book.found ? (
                            <Check className="h-6 w-6 text-green-500" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-amber-500" />
                          )}
                        </div>

                        {/* Book Cover (if found) */}
                        {book.found && book.details?.imageLinks?.thumbnail && (
                          <div className="flex-shrink-0 w-16 h-24 bg-gray-100 rounded overflow-hidden mr-4">
                            <img
                              src={book.details.imageLinks.thumbnail}
                              alt="Book cover"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Book Details */}
                        <div className="flex-grow">
                          {book.found && book.details ? (
                            <>
                              <h4 className="font-medium">{book.details.title}</h4>
                              <p className="text-sm text-gray-600">
                                by {book.details.authors.join(', ')}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                                <div className="text-xs">ISBN: {book.details.isbn}</div>
                                <div className="text-xs text-gray-500">
                                  {book.details.pageCount ? `${book.details.pageCount} pages` : ''}
                                  {book.details.pageCount && book.details.publishedDate ? ' • ' : ''}
                                  {book.details.publishedDate || ''}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">Book not found</p>
                              <p className="text-sm text-gray-600">
                                {book.isbn ? `ISBN: ${book.isbn}` : ''}
                                {book.isbn && book.title ? ' • ' : ''}
                                {book.title ? `Title: ${book.title}` : ''}
                              </p>
                            </>
                          )}

                          {/* Condition and Selection (if found) */}
                          {book.found && (
                            <div className="flex items-center justify-between mt-3">
                              <div className="w-36">
                                <Select
                                  value={book.condition}
                                  onValueChange={(value) => updateBookCondition(index, value)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Condition" />
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
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`select-book-${index}`} className="text-sm">Include</Label>
                                <Checkbox
                                  id={`select-book-${index}`}
                                  checked={book.selected}
                                  onCheckedChange={(checked) => toggleBookSelection(index, checked as boolean)}
                                  disabled={!book.found}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Summary and Submit */}
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Ready to list {books.filter(b => b.selected && b.found).length} books</p>
                  <p className="text-sm text-gray-600">
                    {books.filter(b => !b.found).length} books couldn't be found
                  </p>
                </div>
                <Button
                  onClick={handleListBooks}
                  disabled={books.filter(b => b.selected && b.found).length === 0 || submitting}
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Listing...</>
                  ) : (
                    <>List Selected Books</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* No Books State */}
      {books.length === 0 && !uploading && !processing && (
        <div className="text-center py-6 text-gray-500">
          Upload a CSV file to get started
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
