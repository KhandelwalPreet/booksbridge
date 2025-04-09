
import { supabase } from '@/integrations/supabase/client';

/**
 * Migrates a book from the old inventory structure to the new books_db + inventory_new structure
 * This can be called on demand when viewing or editing an old book entry
 */
export const migrateBookToNewStructure = async (inventoryId: string) => {
  try {
    // Get the book from the old inventory table
    const { data: oldBookData, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', inventoryId)
      .single();

    if (fetchError || !oldBookData) {
      console.error('Error fetching book to migrate:', fetchError);
      return null;
    }

    // Check if book with same ISBN already exists in books_db
    const { data: existingBooks, error: searchError } = await supabase
      .from('books_db')
      .select('id')
      .eq('isbn_13', oldBookData.isbn)
      .maybeSingle();

    let bookDbId;

    if (searchError) {
      console.error('Error searching for existing book:', searchError);
      return null;
    }

    if (existingBooks) {
      // Book already exists in books_db, use its ID
      bookDbId = existingBooks.id;
    } else {
      // Create new entry in books_db
      const bookData = {
        title: oldBookData.title,
        author: oldBookData.author,
        isbn_13: oldBookData.isbn,
        publisher: oldBookData.publisher,
        published_date: oldBookData.published_date,
        description: oldBookData.description,
        categories: oldBookData.categories,
        page_count: oldBookData.page_count,
        cover_image_url: oldBookData.thumbnail_url
      };
      
      const { data: newBookData, error: insertError } = await supabase
        .from('books_db')
        .insert(bookData)
        .select('id')
        .single();

      if (insertError || !newBookData) {
        console.error('Error creating new book in books_db:', insertError);
        return null;
      }

      bookDbId = newBookData.id;
    }

    // Create new entry in inventory_new
    const inventoryData = {
      book_id: bookDbId,
      lender_id: oldBookData.user_id,
      condition: oldBookData.condition,
      condition_notes: oldBookData.condition_notes,
      available: true, // Default to available
      lending_duration: oldBookData.lending_duration,
      pickup_preferences: oldBookData.pickup_preferences
    };
    
    const { data: newInventory, error: inventoryError } = await supabase
      .from('inventory_new')
      .insert(inventoryData)
      .select('id')
      .single();

    if (inventoryError) {
      console.error('Error creating inventory entry:', inventoryError);
      return null;
    }

    // Optionally delete the old entry
    // This is commented out for safety; you may want to keep the old data until migration is complete
    /*
    const { error: deleteError } = await supabase
      .from('inventory')
      .delete()
      .eq('id', inventoryId);

    if (deleteError) {
      console.error('Error deleting old inventory entry:', deleteError);
    }
    */

    return newInventory;
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
    const { data: oldBooks, error: fetchError } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching user books to migrate:', fetchError);
      return { success: false, migrated: 0, total: 0 };
    }

    if (!oldBooks || oldBooks.length === 0) {
      return { success: true, migrated: 0, total: 0 };
    }

    let migratedCount = 0;

    for (const book of oldBooks) {
      const migrated = await migrateBookToNewStructure(book.id);
      if (migrated) {
        migratedCount++;
      }
    }

    return { 
      success: true, 
      migrated: migratedCount, 
      total: oldBooks.length 
    };
  } catch (error) {
    console.error('Batch migration error:', error);
    return { success: false, migrated: 0, total: 0 };
  }
};
