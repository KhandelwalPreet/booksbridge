
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import BookCard from './BookCard';
import { supabase } from '@/integrations/supabase/client';

interface BookListing {
  id: string;
  lenderName: string;
  distance: string;
  distanceValue: number; // For sorting
  lenderId?: string; // Added to fetch supplier details
}

interface BookDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    pageCount: number;
    genre: string;
    language: string;
    description?: string;
    listings: BookListing[];
  } | null;
}

interface SupplierDetails {
  name: string;
  gender: string;
  location?: string;
}

const BookDetailModal = ({ isOpen, onClose, book }: BookDetailModalProps) => {
  const [selectedListing, setSelectedListing] = useState<string | null>(
    book?.listings?.length ? book.listings[0].id : null
  );
  const [supplierDetails, setSupplierDetails] = useState<SupplierDetails | null>(null);

  useEffect(() => {
    if (isOpen && book?.listings?.length && selectedListing) {
      const currentListing = book.listings.find(listing => listing.id === selectedListing);
      if (currentListing?.lenderId) {
        fetchSupplierDetails(currentListing.lenderId);
      }
    }
  }, [isOpen, selectedListing, book]);

  const fetchSupplierDetails = async (lenderId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, gender, latitude, longitude')
        .eq('id', lenderId)
        .single();

      if (error) throw error;
      
      if (data) {
        setSupplierDetails({
          name: data.name || 'Unknown',
          gender: data.gender || 'Not specified',
          location: data.latitude && data.longitude ? `${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}` : undefined
        });
      }
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      setSupplierDetails(null);
    }
  };

  if (!book) return null;

  const currentListing = book.listings.find(listing => listing.id === selectedListing) || book.listings[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold text-book-maroon">{book.title}</span>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Upper section - Selected listing details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="aspect-[2/3] overflow-hidden rounded-md">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-muted-foreground">{book.author}</p>
            </div>
            
            {book.description && (
              <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
                <p>{book.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Pages:</span> {book.pageCount}
              </div>
              <div>
                <span className="text-muted-foreground">Genre:</span> {book.genre}
              </div>
              <div>
                <span className="text-muted-foreground">Language:</span> {book.language}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Available from:</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{currentListing?.lenderName}</p>
                  {supplierDetails && (
                    <div className="text-sm text-muted-foreground mb-1">
                      <span className="mr-2">Gender: {supplierDetails.gender}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{currentListing?.distance}</span>
                  </div>
                </div>
                <Button className="bg-book-warm hover:bg-book-warm/90">
                  Request This Book
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower section - Other listings */}
        {book.listings.length > 1 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-4">Other copies available near you</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {book.listings.map((listing) => (
                <div
                  key={listing.id}
                  className={`p-3 rounded-md cursor-pointer border transition-all ${
                    selectedListing === listing.id
                      ? "border-book-warm bg-book-warm/10"
                      : "border-border hover:border-book-warm/50"
                  }`}
                  onClick={() => setSelectedListing(listing.id)}
                >
                  <p className="font-medium">{listing.lenderName}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{listing.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
