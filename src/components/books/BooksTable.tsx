
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BookListing } from '@/types/database';

interface BooksTableProps {
  books: BookListing[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const BooksTable = ({ books, loading, onEdit, onDelete }: BooksTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-medium mb-2 dark:text-white">You haven't listed any books yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Add your first book to start sharing with the community</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Listed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Lent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Returned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-[100px]">Cover</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id} className="dark:border-gray-700">
              <TableCell>
                <div className="h-16 w-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  {book.book?.cover_image_url || book.thumbnail_url ? (
                    <img
                      src={book.book?.cover_image_url || book.thumbnail_url}
                      alt={`Cover of ${book.book?.title || book.title}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                      No Cover
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium dark:text-white">{book.book?.title || book.title}</TableCell>
              <TableCell className="dark:text-gray-300">{book.book?.author || book.author}</TableCell>
              <TableCell className="font-mono text-xs dark:text-gray-400">{book.book?.isbn_13 || book.book?.isbn_10 || book.isbn || 'N/A'}</TableCell>
              <TableCell className="dark:text-gray-300">{book.condition}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getStatusColor(book.status || 'Listed')}`}>
                  {book.status || 'Listed'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book.id)}
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-800"
                    onClick={() => onDelete(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BooksTable;
