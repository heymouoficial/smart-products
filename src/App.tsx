
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Index";
import Proveedores from "./pages/Proveedores";
import NotFound from "./pages/NotFound";
import { ProvidersProvider } from "./contexts/ProvidersContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProvidersProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proveedores" element={<Proveedores />} />
            {/* Otras rutas se agregarán a medida que se implementen las páginas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProvidersProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
