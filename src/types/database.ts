
export interface BookDb {
  id: string;
  title: string;
  author: string;
  isbn_10?: string;
  isbn_13?: string;
  publisher?: string;
  published_date?: string;
  description?: string;
  cover_image_url?: string;
  page_count?: number;
  categories?: string;
  language?: string;
  google_books_id?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  book_id: string;
  lender_id: string;
  condition: string;
  condition_notes?: string;
  available: boolean;
  location?: string;
  lending_duration: number;
  pickup_preferences?: string;
  created_at: string;
  updated_at: string;
  
  // Join properties from books_db
  book?: BookDb;
}

export interface BookListing extends InventoryItem {
  // UI display properties
  status?: string;
}
