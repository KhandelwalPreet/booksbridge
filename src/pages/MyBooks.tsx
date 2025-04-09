
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BooksTable from '@/components/books/BooksTable';
import AddBookModal from '@/components/books/AddBookModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookListing } from '@/types/database';

const MyBooks = () => {
  const [books, setBooks] = useState<BookListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast("Please log in to view your books");
        navigate("/auth");
      } else {
        fetchBooks();
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) return;
      
      // Check if we have the new inventory_new table data
      const { data: newInventoryData, error: newInventoryError } = await supabase
        .from('inventory_new')
        .select(`
          *,
          book:books_db!book_id(
            id, title, author, isbn_10, isbn_13, cover_image_url
          )
        `)
        .eq('lender_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });
      
      if (newInventoryError) {
        console.error('Error fetching from new inventory:', newInventoryError);
        
        // Fall back to the old inventory table
        const { data: oldInventoryData, error: oldInventoryError } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .order('created_at', { ascending: false });
        
        if (oldInventoryError) throw oldInventoryError;
        
        // Map the old data format to the new format for the UI
        const booksWithStatus = oldInventoryData.map((book: any) => ({
          ...book,
          status: 'Listed'
        }));
        
        setBooks(booksWithStatus);
      } else if (newInventoryData && newInventoryData.length > 0) {
        // Format data from the new inventory structure
        const booksWithStatus = newInventoryData.map((item: any) => ({
          ...item,
          // Extract book properties to the top level for compatibility with the table
          title: item.book?.title || 'Unknown Title',
          author: item.book?.author || 'Unknown Author',
          isbn: item.book?.isbn_13 || item.book?.isbn_10 || 'N/A',
          thumbnail_url: item.book?.cover_image_url || null,
          status: item.available ? 'Listed' : 'Lent'
        }));
        
        setBooks(booksWithStatus);
      } else {
        // No books found in either table
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast("Failed to load your books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAdded = () => {
    fetchBooks();
    setModalOpen(false);
  };

  const handleDeleteBook = async (id: string) => {
    try {
      // First try to delete from inventory_new
      const { error: newError } = await supabase
        .from('inventory_new')
        .delete()
        .eq('id', id);
      
      if (newError) {
        // Fall back to the old inventory table
        const { error: oldError } = await supabase
          .from('inventory')
          .delete()
          .eq('id', id);
        
        if (oldError) throw oldError;
      }
      
      toast("Book removed successfully");
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast("Failed to delete book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-book-maroon">Your Listed Books</h1>
            <Button 
              onClick={() => setModalOpen(true)} 
              className="bg-book-warm hover:bg-book-warm/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add a New Book
            </Button>
          </div>
          
          <BooksTable 
            books={books} 
            loading={loading} 
            onDelete={handleDeleteBook} 
            onEdit={(id) => {
              toast("Edit functionality coming soon!");
            }}
          />
        </div>
      </main>
      
      <AddBookModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onBookAdded={handleBookAdded}
      />
      
      <Footer />
    </div>
  );
};

export default MyBooks;
