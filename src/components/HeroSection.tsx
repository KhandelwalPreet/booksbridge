
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2080&auto=format&fit=crop"
          alt="Library with books"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Discover Books Around You – Borrow for Free
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Find books nearby. Read more. Share more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-book-warm hover:bg-book-warm/90 text-white px-8 py-6 text-lg">
              Browse Books
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg">
              List Your Books
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
