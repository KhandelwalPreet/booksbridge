
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Calendar, UserRound, Phone, Video, Image, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
}

const MessageUI = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // Mock data - would be fetched from Supabase in reality
  const conversations: Conversation[] = [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=1', lastMessage: 'I can drop off the book tomorrow if that works for you', lastMessageTime: new Date(), unread: 2 },
    { id: '2', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3', lastMessage: 'Thanks for the book recommendation!', lastMessageTime: new Date(Date.now() - 1000*60*60), unread: 0 },
    { id: '3', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=5', lastMessage: 'Would you like to join our book club?', lastMessageTime: new Date(Date.now() - 1000*60*60*24), unread: 1 },
    { id: '4', name: 'Alex Rodriguez', avatar: 'https://i.pravatar.cc/150?img=7', lastMessage: 'The book is in excellent condition', lastMessageTime: new Date(Date.now() - 1000*60*60*24*2), unread: 0 },
  ];
  
  const messages: Message[] = [
    { id: '1', content: 'Hi there! I saw you have "The Midnight Library" available', sender: 'user1', timestamp: new Date(Date.now() - 1000*60*60*2), isMe: false },
    { id: '2', content: 'Yes I do! Are you interested in borrowing it?', sender: 'me', timestamp: new Date(Date.now() - 1000*60*60*1), isMe: true },
    { id: '3', content: 'Absolutely! I\'ve been wanting to read it for months. When could we meet?', sender: 'user1', timestamp: new Date(Date.now() - 1000*60*30), isMe: false },
    { id: '4', content: 'I can drop off the book tomorrow if that works for you', sender: 'user1', timestamp: new Date(), isMe: false },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return formatTime(date);
    } else if (date.getTime() > now.getTime() - 86400000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Message sent:', messageInput);
    setMessageInput('');
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-md overflow-hidden h-[600px] flex">
      {/* Conversations list */}
      <div className="w-full md:w-1/3 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">Requests</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[490px]">
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-4 hover:bg-muted/40 cursor-pointer transition-colors border-b border-border ${activeConversation === conversation.id ? 'bg-muted/60' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(conversation.lastMessageTime)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="min-w-[20px] h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{conversation.unread}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0 p-4 h-[490px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No unread messages</p>
            </div>
          </TabsContent>
          
          <TabsContent value="requests" className="m-0 p-4 h-[490px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No book requests yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chat area */}
      <div className="hidden md:flex flex-col w-2/3">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserRound className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.isMe 
                      ? 'bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' 
                      : 'bg-muted text-foreground rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'} 
                      px-4 py-3 shadow-sm`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Message input */}
            <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center space-x-2">
              <Button type="button" variant="ghost" size="icon" className="rounded-full">
                <Image className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="rounded-full">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                className="flex-1" 
                placeholder="Type a message..." 
                value={messageInput} 
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button type="submit" size="icon" className="rounded-full" disabled={!messageInput.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 p-4 rounded-full bg-muted">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Connect with fellow readers to exchange books and ideas
            </p>
            <Button className="bg-primary text-primary-foreground">
              Start a Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageUI;
