
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="text-center max-w-md p-8 rounded-xl border border-dark-border card-gradient">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-electric/10 flex items-center justify-center text-electric text-3xl font-bold electric-glow">
            404
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Lo sentimos, la página que estás buscando no existe o ha sido eliminada.
        </p>
        <Button asChild className="bg-electric hover:bg-electric-dark text-white">
          <Link to="/">
            <Home size={18} className="mr-2" /> Volver al Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
