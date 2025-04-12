
import React from 'react';
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="text-2xl font-bold text-book-maroon flex items-center gap-2">
      <BookOpen className="h-6 w-6 text-book-warm" />
      <span className="text-book-warm">Books</span>Bridge
    </Link>
  );
};

export default Logo;
