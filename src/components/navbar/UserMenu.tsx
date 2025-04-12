
import React from 'react';
import { Link } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogIn, 
  UserCircle, 
  LogOut, 
  PlusCircle
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
        size="sm" 
        className="bg-book-warm hover:bg-book-warm/90"
        asChild
      >
        <Link to="/auth">
          <LogIn className="mr-2 h-4 w-4" /> Log In / Sign Up
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="border-book-warm text-book-warm hover:bg-book-warm/10"
        asChild
      >
        <Link to="/my-books">
          <PlusCircle className="h-4 w-4 mr-1" /> Add a Book
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg dark:bg-card">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/my-books" className="cursor-pointer">My Books</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">Profile Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-500 cursor-pointer flex items-center" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
