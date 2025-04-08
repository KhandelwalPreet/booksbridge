
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-book-maroon flex items-center gap-2">
            <span className="text-book-warm">Book</span>Share
          </a>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by title, author, or ISBN..." 
              className="w-full pl-10 border-book-warm/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-book-warm text-book-warm hover:bg-book-warm/10">
            List a Book
          </Button>
          <Button size="sm" className="bg-book-warm hover:bg-book-warm/90">
            Log In / Sign Up
          </Button>
        </div>
      </div>
      
      <div className="md:hidden flex items-center px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search by title, author, or ISBN..." 
            className="w-full pl-10 border-book-warm/50"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
