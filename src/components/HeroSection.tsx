
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Search, Users, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center">
      {/* Background with purple gradient and image overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-violet-800/80 to-indigo-900/70 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        <div 
          className="absolute inset-0 bg-[url('https://gist.githubusercontent.com/GrantJamesdotme/c50cc31745115bead6c70aa1be21b784/raw/217ca01157c2d9c0d09ca97742e089b6756e89a9/grain.svg')] 
          opacity-[0.15] [mask-image:linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_100%)] pointer-events-none"
        ></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-white">
        <div className="max-w-3xl mx-auto md:mx-0">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            A community of book lovers
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Share books,</span> build connections
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/80 leading-relaxed max-w-2xl">
            Join our vibrant community where readers connect to share books, exchange ideas, and discover new stories together. Your next favorite book is just around the corner.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-xl">
            <Button 
              size="lg"
              asChild
              className="bg-primary text-white hover:bg-primary/90 py-6 rounded-xl shadow-lg shadow-primary/25 btn-glow flex items-center justify-center gap-2"
            >
              <Link to="/my-books">
                <Search className="h-5 w-5" /> Discover Books
              </Link>
            </Button>
            
            <Button 
              size="lg"
              asChild
              variant="outline"
              className="border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 py-6 flex items-center justify-center gap-2 rounded-xl"
            >
              <Link to="/list-book">
                <BookOpen className="h-5 w-5" /> Share Your Library
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/80">Find books near you</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/80">Join 2,000+ readers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/80">Over 5,000 books shared</p>
              </div>
            </div>
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
