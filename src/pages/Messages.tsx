
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MessageUI from '@/components/messaging/MessageUI';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Messages = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4">
        <div className="container mx-auto max-w-6xl py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Connect with fellow readers and coordinate book exchanges
            </p>
          </div>
          
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle>Your Conversations</CardTitle>
              <CardDescription>
                Chat with other readers about books you're interested in borrowing or lending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessageUI />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
