
import React from 'react';
import { Link } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogIn, 
  UserCircle, 
  LogOut, 
  MessageCircle, 
  BookOpen, 
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: any | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white hover:bg-white/10 rounded-full"
      >
        <UserCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/90 text-white border-white/10">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
          <Link to="/my-books" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> My Books
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
          <Link to="/messages" className="flex items-center">
            <MessageCircle className="mr-2 h-4 w-4" /> Messages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
          <Link to="/profile" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" /> Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="text-rose-400 cursor-pointer flex items-center hover:bg-white/10" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
