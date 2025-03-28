
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AuthForm from "@/components/AuthForm";
import { useTour } from "@/components/OnboardingTour";
import { supabase } from "./services/supabaseClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Index";
import Proveedores from "./pages/Proveedores";
import NotFound from "./pages/NotFound";
import { ProvidersProvider } from "./contexts/ProvidersContext";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Iniciando autenticación con Supabase');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        console.log('Sesión obtenida:', session);
        
        setSession(session);

        if (session) {
          console.log('Buscando perfil del usuario');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_complete')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;
          console.log('Perfil cargado:', profile);

          if (!profile?.onboarding_complete) {
            console.log('Iniciando tour de onboarding');
            useTour.getState().startTour();
          }
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
      } finally {
        console.log('Finalizando carga inicial');
        setLoading(false);
      }
    };
    
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Agregar meta viewport para dispositivos móviles
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    return () => {
      document.getElementsByTagName('head')[0].removeChild(meta);
    };
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg">
        <AuthForm />
      </div>
    </div>
  );

  return (
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
};

export default App;
