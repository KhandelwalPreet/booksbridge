
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Search, PlusCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] flex items-center">
      {/* Background with purple gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-800"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513185041617-8ab03f83d6c5?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-white">
            Share Books, Connect Minds
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 leading-relaxed">
            Find books in your neighborhood, share your collection, and join a community of readers who love to exchange stories and ideas.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-purple-700/30"
            >
              <Search className="h-5 w-5" /> Find Books Nearby
            </Button>
            
            <Button 
              size="lg"
              asChild
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-white py-6 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm"
            >
              <Link to="/my-books">
                <BookOpen className="h-5 w-5" /> Explore Library
              </Link>
            </Button>
            
            <Button 
              size="lg"
              asChild
              variant="secondary"
              className="bg-white text-purple-900 hover:bg-purple-50 py-6 flex items-center justify-center gap-2 rounded-xl shadow-lg"
            >
              <Link to="/my-books">
                <PlusCircle className="h-5 w-5" /> Share Your Books
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-purple-900 font-bold border-2 border-purple-900">K</div>
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-purple-900 font-bold border-2 border-purple-900">S</div>
              <div className="w-10 h-10 rounded-full bg-violet-400 flex items-center justify-center text-purple-900 font-bold border-2 border-purple-900">M</div>
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-purple-900 font-bold border-2 border-purple-900">+</div>
            </div>
            <p className="text-sm text-purple-200">Join 2,000+ readers already sharing books in your area</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
