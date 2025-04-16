
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Plus } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center">
      {/* Background with purple gradient and image overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800 to-indigo-900/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/lovable-uploads/f4b12f86-3a42-4332-bf8a-d1b7d408ad83.png')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('https://gist.githubusercontent.com/GrantJamesdotme/c50cc31745115bead6c70aa1be21b784/raw/217ca01157c2d9c0d09ca97742e089b6756e89a9/grain.svg')] opacity-[0.15] pointer-events-none"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-white">
        <div className="max-w-3xl mx-auto md:mx-0">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            Share Books,<br /> Connect <span className="text-amber-400">Minds</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/80 leading-relaxed max-w-2xl">
            Find books in your neighborhood, share your collection, and join a
            community of readers who love to exchange stories and ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg"
              asChild
              className="bg-violet-600 text-white hover:bg-violet-700 py-6 flex items-center justify-center gap-2 rounded-full"
            >
              <Link to="/my-books">
                <Search className="h-5 w-5" /> Find Books Nearby
              </Link>
            </Button>
            
            <Button 
              size="lg"
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 py-6 flex items-center justify-center gap-2 rounded-full"
            >
              <Link to="/my-books">
                <BookOpen className="h-5 w-5" /> Explore Library
              </Link>
            </Button>
            
            <Button 
              size="lg"
              asChild
              className="bg-amber-600 text-white hover:bg-amber-700 py-6 flex items-center justify-center gap-2 rounded-full"
            >
              <Link to="/list-book">
                <Plus className="h-5 w-5" /> Share Your Books
              </Link>
            </Button>
          </div>
          
          {/* User avatars */}
          <div className="mt-12 flex items-center">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-violet-400 flex items-center justify-center border-2 border-white text-sm font-medium">K</div>
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white text-sm font-medium">S</div>
              <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center border-2 border-white text-sm font-medium">M</div>
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white text-sm font-medium">+</div>
            </div>
            <span className="ml-4 text-sm text-white/80">
              Join 2,000+ readers already sharing books in your area
            </span>
          </div>
        </div>
      </div>
      
      {/* Curved bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-background w-full h-auto">
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,261.3C672,256,768,224,864,213.3C960,203,1056,213,1152,224C1248,235,1344,245,1392,250.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
