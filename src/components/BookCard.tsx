
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
  const sizeClasses = {
    sm: "w-28 h-40",
    md: "w-36 h-52",
    lg: "w-44 h-64"
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
        
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <h3 className="text-white text-sm font-semibold line-clamp-1">{book.title}</h3>
          <p className="text-white/80 text-xs line-clamp-1">{book.author}</p>
        </div>
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
