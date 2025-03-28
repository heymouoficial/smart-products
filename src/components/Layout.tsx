
import React from "react";
import { useProviders } from "@/contexts/ProvidersContext";
import { AlertCircle, RefreshCw } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { OnboardingTour } from "./OnboardingTour";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { error } = useProviders();

  if (error) return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="text-center text-red-500">
        <AlertCircle className="h-12 w-12 mb-4 mx-auto" />
        <h2 className="text-xl font-bold mb-2">Error cargando proveedores</h2>
        <p className="text-sm opacity-75">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
