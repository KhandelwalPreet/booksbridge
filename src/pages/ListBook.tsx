
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  isbn: z.string().min(10, { message: "ISBN must be at least 10 characters." }),
  publisher: z.string().optional(),
  published_date: z.string().optional(),
  description: z.string().optional(),
  categories: z.string().optional(),
  page_count: z.number().int().positive().optional().or(z.string().transform(val => val === "" ? undefined : parseInt(val, 10))),
  condition: z.enum(["New", "Like New", "Very Good", "Good", "Fair", "Poor"]),
  condition_notes: z.string().optional(),
  lending_duration: z.number().int().min(1).max(90),
  pickup_preferences: z.string().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const ListBook = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      published_date: "",
      description: "",
      categories: "",
      page_count: undefined,
      condition: "Good",
      condition_notes: "",
      lending_duration: 14, // Default lending duration - 2 weeks
      pickup_preferences: "",
      thumbnail_url: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // First check if we're authenticated (this is a placeholder, you'd need to implement auth)
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError || !authData.session) {
        toast.error("You must be logged in to list a book.");
        // Here you could redirect to login page
        return;
      }

      const { error } = await supabase.from('inventory').insert({
        ...data,
        user_id: authData.session.user.id, // Set the user_id from the authenticated user
      });

      if (error) {
        throw error;
      }

      toast.success("Book listed successfully!");
      navigate("/"); // Redirect back to home page
    } catch (error) {
      console.error("Error listing book:", error);
      toast.error("Failed to list book. Please try again.");
    }
  };

  const fetchBookDetails = async (isbn: string) => {
    if (!isbn || isbn.length < 10) return;
    
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        
        form.setValue("title", book.title || "");
        form.setValue("author", book.authors ? book.authors.join(", ") : "");
        form.setValue("publisher", book.publisher || "");
        form.setValue("published_date", book.publishedDate || "");
        form.setValue("description", book.description || "");
        form.setValue("categories", book.categories ? book.categories.join(", ") : "");
        form.setValue("page_count", book.pageCount || undefined);
        form.setValue("thumbnail_url", book.imageLinks?.thumbnail || "");
        
        toast.success("Book details found!");
      } else {
        toast.error("No book found with that ISBN.");
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      toast.error("Failed to fetch book details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-book-maroon">List a Book</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-book-warm">Book Details</h2>
            
            <div className="mb-8">
              <div className="flex items-end mb-2 gap-4">
                <div className="flex-1">
                  <Label htmlFor="isbn-lookup" className="mb-2 block">Quick Lookup by ISBN</Label>
                  <div className="relative">
                    <Input 
                      id="isbn-lookup" 
                      placeholder="Enter ISBN to look up details" 
                      className="pr-12"
                      onChange={(e) => form.setValue("isbn", e.target.value)}
                    />
                    <Button 
                      type="button"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      onClick={() => fetchBookDetails(form.getValues("isbn"))}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Enter an ISBN to automatically fill in book details</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Book title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author *</FormLabel>
                        <FormControl>
                          <Input placeholder="Book author" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ISBN *</FormLabel>
                      <FormControl>
                        <Input placeholder="ISBN-10 or ISBN-13" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher</FormLabel>
                        <FormControl>
                          <Input placeholder="Publisher name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication Date</FormLabel>
                        <FormControl>
                          <Input placeholder="YYYY-MM-DD or YYYY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the book" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <Input placeholder="Fiction, Mystery, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="page_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page Count</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Number of pages" 
                            {...field}
                            onChange={e => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="thumbnail_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/book-cover.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-2">
                          <img 
                            src={field.value} 
                            alt="Book cover preview" 
                            className="h-32 object-cover rounded border" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=2730&ixlib=rb-4.0.3";
                            }}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Condition *</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="grid grid-cols-2 md:grid-cols-3 gap-2"
                        >
                          {["New", "Like New", "Very Good", "Good", "Fair", "Poor"].map((condition) => (
                            <div key={condition} className="flex items-center space-x-2 border rounded-md p-2">
                              <RadioGroupItem value={condition} id={`condition-${condition}`} />
                              <Label htmlFor={`condition-${condition}`}>{condition}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any specific notes about the book's condition" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lending_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lending Duration (days) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="How many days you're willing to lend" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pickup_preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Preferences</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your preferences for pickup/return (location, time, etc.)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-book-warm hover:bg-book-warm/90">
                    List Book
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ListBook;
