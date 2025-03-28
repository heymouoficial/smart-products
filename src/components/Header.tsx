
import React from "react";
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 border-b border-dark-border flex items-center justify-between">
      <div>
        <h1 className="text-lg font-medium">
          <span className="text-electric">Sync</span>Platform
        </h1>
        <p className="text-xs text-muted-foreground">Conectando tus productos</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell size={20} className="text-muted-foreground hover:text-electric transition-colors" />
          <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-electric text-xs">
            3
          </Badge>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-electric">
          <Settings size={20} />
        </Button>
        
        <div className="flex items-center gap-2 border-l pl-4 border-dark-border">
          <div className="h-8 w-8 rounded-full bg-electric flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
