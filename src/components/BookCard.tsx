
import React from 'react';
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    cover_image_url?: string;
    thumbnail_url?: string;
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
  const sizeClasses = {
    sm: "w-24 h-36",
    md: "w-32 h-48", 
    lg: "w-40 h-56"
  };

  const imageUrl = book.coverImage || book.cover_image_url || book.thumbnail_url || '/placeholder.svg';

  return (
    <div 
      className={cn(
        "book-card cursor-pointer flex flex-col overflow-hidden transition-all duration-300 hover:scale-105",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <div className="relative flex-grow overflow-hidden rounded-lg shadow-md">
        <img 
          src={imageUrl} 
          alt={`${book.title} by ${book.author}`}
          className="w-full h-full object-cover transition-transform duration-300" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
          <p className="text-xs text-white line-clamp-1 font-medium">{book.title}</p>
          <p className="text-xs text-white/80 line-clamp-1">{book.author}</p>
        </div>
      </div>

      {showDistance && (
        <div className="bg-primary/80 text-primary-foreground text-xs px-2 py-1 mt-1 rounded-md flex justify-between">
          <span className="line-clamp-1">{book.lender || 'Unknown'}</span>
          <span>{book.distance}</span>
        </div>
      )}
    </div>
  );
};

export default BookCard;
