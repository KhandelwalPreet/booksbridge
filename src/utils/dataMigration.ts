
import { supabase } from '@/integrations/supabase/client';

/**
 * Migrates a book from the old inventory structure to the new books_db + inventory_new structure
 * This can be called on demand when viewing or editing an old book entry
 */
export const migrateBookToNewStructure = async (inventoryId: string) => {
  try {
    // This function is for reference only as the old inventory table is no longer available
    // It's kept for documentation purposes but will return null
    console.warn('Migration function called but the old inventory table is no longer available');
    return null;
  } catch (error) {
    console.error('Migration error:', error);
    return null;
  }
};

/**
 * Migrates all books for a specific user from the old structure to the new structure
 */
export const migrateAllUserBooks = async (userId: string) => {
  try {
    // This function is for reference only as the old inventory table is no longer available
    // It's kept for documentation purposes
    console.warn('Batch migration function called but the old inventory table is no longer available');
    return { success: true, migrated: 0, total: 0 };
  } catch (error) {
    console.error('Batch migration error:', error);
    return { success: false, migrated: 0, total: 0 };
  }
};

/**
 * Helper function to create a book entry in the new structure
 */
export const createBookEntry = async (bookData: {
  title: string;
  author: string;
  isbn_10?: string | null;
  isbn_13?: string | null;
  publisher?: string | null;
  published_date?: string | null;
  description?: string | null;
  categories?: string | null;
  page_count?: number | null;
  cover_image_url?: string | null;
}) => {
  const { data, error } = await supabase
    .from('books_db')
    .insert(bookData)
    .select();
    
  if (error) throw error;
  return data?.[0];
};

/**
 * Helper function to create an inventory entry in the new structure
 */
export const createInventoryEntry = async (inventoryData: {
  book_id: string;
  lender_id: string;
  condition: string;
  condition_notes?: string | null;
  available?: boolean;
  lending_duration: number;
  pickup_preferences?: string | null;
}) => {
  const { data, error } = await supabase
    .from('inventory_new')
    .insert(inventoryData)
    .select();
    
  if (error) throw error;
  return data?.[0];
};
