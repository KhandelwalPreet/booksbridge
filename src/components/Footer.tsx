
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border mt-16">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-gradient">BooksConnect</h3>
            <p className="text-sm text-muted-foreground">
              Connecting readers and building communities through shared stories. Discover, share, and exchange your favorite books with people in your neighborhood.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Browse Books</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Top Genres</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">New Additions</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Book Clubs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Guidelines</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Forums</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Terms</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Privacy</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Cookies</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Licensing</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BooksConnect. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-primary" /> for readers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
