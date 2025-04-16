
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-book-cream text-book-dark py-8 border-t border-book-warm/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-book-maroon">BookShare</h3>
            <p className="text-sm">
              Connect with fellow readers, share books, and build a community of book lovers in your neighborhood.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-book-warm">How it Works</a></li>
              <li><a href="#" className="hover:text-book-warm">Browse Books</a></li>
              <li><a href="#" className="hover:text-book-warm">List Your Books</a></li>
              <li><a href="#" className="hover:text-book-warm">Connect with Readers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-book-warm">FAQs</a></li>
              <li><a href="#" className="hover:text-book-warm">Contact Us</a></li>
              <li><a href="#" className="hover:text-book-warm">Terms of Service</a></li>
              <li><a href="#" className="hover:text-book-warm">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-book-warm">Blog</a></li>
              <li><a href="#" className="hover:text-book-warm">Events</a></li>
              <li><a href="#" className="hover:text-book-warm">Partner with Us</a></li>
              <li><a href="#" className="hover:text-book-warm">Book Clubs</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-book-warm/20 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BookShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
