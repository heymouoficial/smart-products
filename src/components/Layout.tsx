
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark relative">
      {/* Fondo con cuadrícula parpadeante */}
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="size-full"
          squareSize={4}
          gridGap={6}
          color="#1C61E7"
          maxOpacity={0.2}
          flickerChance={0.1}
        />
      </div>
      
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-64 border-r border-dark-border bg-sidebar/95 backdrop-blur-lg">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col w-full overflow-hidden relative z-10">
            <Header>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </Button>
            </Header>
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </>
      ) : (
        <>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden relative z-10">
            <Header />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
