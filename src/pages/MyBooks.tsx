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
        setBooks([]);
        toast.error("Failed to load your books. Please try again.");
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
        // No books found
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error("Failed to load your books. Please try again.");
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
      const { error } = await supabase
        .from('inventory_new')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Book removed successfully");
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error("Failed to delete book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#2E86AB]">Your Listed Books</h1>
            <Button 
              onClick={() => setModalOpen(true)} 
              className="bg-[#F18F01] hover:bg-[#F18F01]/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add a New Book
            </Button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 border border-[#E5E7EB]">
            <BooksTable 
              books={books} 
              loading={loading} 
              onDelete={handleDeleteBook} 
              onEdit={(id) => {
                toast("Edit functionality coming soon!");
              }}
            />
          </div>
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
