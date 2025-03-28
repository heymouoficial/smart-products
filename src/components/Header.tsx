
import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="px-4 sm:px-6 py-4 border-b border-dark-border flex items-center justify-between backdrop-blur-lg bg-dark/50">
      <div className="flex items-center">
        {children}
        <div>
          <h1 className="text-lg font-medium">
            <span className="text-primary">Smart</span>Product
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">Conectando tus productos</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="relative">
          <Bell size={20} className="text-muted-foreground hover:text-primary transition-colors" />
          <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-primary text-xs">
            3
          </Badge>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hidden sm:inline-flex">
          <Settings size={20} />
        </Button>
        
        <div className="flex items-center gap-2 pl-2 sm:pl-4 sm:border-l sm:border-dark-border">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">Plan Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
