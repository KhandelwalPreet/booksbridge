
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ISBNSearch from './ISBNSearch';
import CSVUpload from './CSVUpload';

interface AddBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookAdded: () => void;
}

const AddBookModal = ({ open, onOpenChange, onBookAdded }: AddBookModalProps) => {
  const [activeTab, setActiveTab] = useState('isbn');

  const handleBookAdded = () => {
    onBookAdded();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#2E86AB]">Add a New Book</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(85vh-120px)]">
          <div className="p-1">
            <Tabs defaultValue="isbn" value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="isbn">List by ISBN</TabsTrigger>
                <TabsTrigger value="csv">Upload via CSV</TabsTrigger>
              </TabsList>
              
              <TabsContent value="isbn" className="mt-4">
                <ISBNSearch onBookAdded={handleBookAdded} />
              </TabsContent>
              
              <TabsContent value="csv" className="mt-4">
                <CSVUpload onBooksAdded={handleBookAdded} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
