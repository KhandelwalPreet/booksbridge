
import React, { useState, useEffect } from 'react';
import { useToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BooksTable from '@/components/books/BooksTable';
import AddBookModal from '@/components/books/AddBookModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BookData = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  condition: string;
  thumbnail_url?: string;
  status?: string;
  created_at: string;
};

const MyBooks = () => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();
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
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map status based on lending state (this is a simplified version)
      // In a real application, you'd need a separate table to track lending status
      const booksWithStatus = data.map((book: any) => ({
        ...book,
        status: 'Listed' // Default status
      }));
      
      setBooks(booksWithStatus);
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
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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
              // Edit functionality could be implemented here
              // For now, we'll just show a toast
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
