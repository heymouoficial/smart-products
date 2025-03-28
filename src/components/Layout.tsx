
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
