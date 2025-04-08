
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  condition: string;
  thumbnail_url?: string;
  status?: string;
  created_at: string;
};

interface BooksTableProps {
  books: Book[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const BooksTable = ({ books, loading, onDelete, onEdit }: BooksTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-book-warm mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading your books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-2">You haven't listed any books yet</h3>
        <p className="text-gray-500 mb-6">Add your first book to start sharing with the community</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Listed':
        return 'bg-green-100 text-green-800';
      case 'Lent':
        return 'bg-blue-100 text-blue-800';
      case 'Returned':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={book.id}>
              <TableCell>
                <div className="h-16 w-12 bg-gray-200 rounded overflow-hidden">
                  {book.thumbnail_url ? (
                    <img
                      src={book.thumbnail_url}
                      alt={`Cover of ${book.title}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                      No Cover
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
              <TableCell>{book.condition}</TableCell>
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
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
