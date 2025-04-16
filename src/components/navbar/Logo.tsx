
import React from 'react';
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <Link to="/" className="text-2xl font-bold flex items-center gap-2">
      <BookOpen className="h-6 w-6 text-amber-400" />
      <span className="text-amber-400">Books</span>
      <span className="text-rose-500">Bridge</span>
    </Link>
  );
};

export default Logo;
