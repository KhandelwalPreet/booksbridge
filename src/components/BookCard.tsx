
import React from 'react';
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    cover_image_url?: string; // Added to support our database schema
    thumbnail_url?: string; // Added to support our database schema
    distance?: string;
    lender?: string;
    categories?: string;
  };
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDistance?: boolean;
}

const BookCard = ({ 
  book, 
  onClick, 
  className,
  size = 'md',
  showDistance = false
}: BookCardProps) => {
  // More Netflix-like square sizing
  const sizeClasses = {
    sm: "w-24 h-32",
    md: "w-32 h-32", // Changed to square
    lg: "w-40 h-40"  // Changed to square
  };

  // Use cover_image_url or thumbnail_url as fallback for coverImage
  const imageUrl = book.coverImage || book.cover_image_url || book.thumbnail_url || '/placeholder.svg';

  return (
    <div 
      className={cn(
        "book-card cursor-pointer rounded-md overflow-hidden flex flex-col",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <div className="relative flex-grow">
        {/* Cover image */}
        <img 
          src={imageUrl} 
          alt={`${book.title} by ${book.author}`}
          className="w-full h-full object-cover" 
        />
      </div>

      {showDistance && (
        <div className="bg-book-warm text-white text-xs px-2 py-1 flex justify-between">
          <span>{book.lender}</span>
          <span>{book.distance}</span>
        </div>
      )}
    </div>
  );
};

export default BookCard;
