
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BooksTable from '@/components/books/BooksTable';
import AddBookModal from '@/components/books/AddBookModal';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, BookOpenCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookListing } from '@/types/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          status: item.available ? 'Available' : 'Lent Out'
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
    <div className="min-h-screen flex flex-col bg-background dark:bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient">Your Library</h1>
              <p className="text-muted-foreground mt-1">Manage your shared books and lending history</p>
            </div>
            
            <Button 
              onClick={() => setModalOpen(true)} 
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add a New Book
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Total Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{books.length}</p>
                <p className="text-muted-foreground text-sm">Books in your collection</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpenCheck className="mr-2 h-5 w-5 text-primary" />
                  Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{books.filter(b => b.status === 'Available').length}</p>
                <p className="text-muted-foreground text-sm">Ready to lend</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Lent Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{books.filter(b => b.status === 'Lent Out').length}</p>
                <p className="text-muted-foreground text-sm">Currently with borrowers</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Your Listed Books</CardTitle>
              <CardDescription>Manage your personal library and lending history</CardDescription>
            </CardHeader>
            <CardContent>
              <BooksTable 
                books={books} 
                loading={loading} 
                onDelete={handleDeleteBook} 
                onEdit={(id) => {
                  toast("Edit functionality coming soon!");
                }}
              />
            </CardContent>
          </Card>
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
