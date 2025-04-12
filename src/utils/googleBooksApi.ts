
interface GoogleBooksApiResponse {
  items: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      pageCount?: number;
      categories?: string[];
      publisher?: string;
      publishedDate?: string;
      language?: string;
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
      industryIdentifiers?: Array<{
        type: string;
        identifier: string;
      }>;
    };
  }[];
}

export interface EnhancedBookDetails {
  title: string;
  authors: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  publishedDate?: string;
  language?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
  isbn10?: string;
  isbn13?: string;
  googleBooksId?: string;
}

export const fetchBookByISBN = async (isbn: string): Promise<EnhancedBookDetails | null> => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
    const data: GoogleBooksApiResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    return processBookData(data.items[0]);
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    return null;
  }
};

export const fetchBookByTitle = async (title: string): Promise<EnhancedBookDetails | null> => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`);
    const data: GoogleBooksApiResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    return processBookData(data.items[0]);
  } catch (error) {
    console.error('Error fetching book by title:', error);
    return null;
  }
};

export const fetchMultipleBookDetails = async (identifiers: {isbn?: string, title?: string}[]): Promise<(EnhancedBookDetails | null)[]> => {
  // Rate limiting - pause between requests to avoid Google Books API rate limits
  const results: (EnhancedBookDetails | null)[] = [];
  
  for (const identifier of identifiers) {
    try {
      let result: EnhancedBookDetails | null = null;
      
      if (identifier.isbn && identifier.isbn.length >= 10) {
        result = await fetchBookByISBN(identifier.isbn);
      } 
      
      if (!result && identifier.title) {
        result = await fetchBookByTitle(identifier.title);
      }
      
      results.push(result);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error in batch book fetching:', error);
      results.push(null);
    }
  }
  
  return results;
};

const processBookData = (bookItem: GoogleBooksApiResponse['items'][0]): EnhancedBookDetails => {
  const volumeInfo = bookItem.volumeInfo;
  let isbn10 = '';
  let isbn13 = '';
  
  if (volumeInfo.industryIdentifiers) {
    const isbn10Obj = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
    const isbn13Obj = volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
    
    isbn10 = isbn10Obj?.identifier || '';
    isbn13 = isbn13Obj?.identifier || '';
  }
  
  return {
    title: volumeInfo.title,
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    publisher: volumeInfo.publisher,
    publishedDate: volumeInfo.publishedDate,
    language: volumeInfo.language,
    imageLinks: volumeInfo.imageLinks,
    industryIdentifiers: volumeInfo.industryIdentifiers,
    isbn10,
    isbn13,
    googleBooksId: bookItem.id
  };
};
