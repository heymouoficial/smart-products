
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
import { logger } from "./services/logger";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logger.info('Iniciando autenticación con Supabase', { category: 'auth' });
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        logger.info('Sesión obtenida correctamente', { category: 'auth', context: session ? `Usuario: ${session.user.email}` : 'Sin sesión' });
        
        setSession(session);

        if (session) {
          logger.info('Buscando perfil del usuario', { category: 'auth', user_id: session.user.id });
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_complete')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;
          logger.info('Perfil de usuario cargado', { category: 'auth', user_id: session.user.id, context: profile ? `Onboarding: ${profile.onboarding_complete}` : 'Sin perfil' });

          if (!profile?.onboarding_complete) {
            logger.info('Iniciando tour de onboarding para nuevo usuario', { category: 'system', user_id: session.user.id });
            useTour.getState().startTour();
          }
        }
      } catch (error) {
        logger.error('Error en proceso de autenticación', { category: 'auth', error: error as Error });
      } finally {
        logger.info('Finalizando carga inicial de la aplicación', { category: 'system' });
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

  // Verificar periodicamente el estado de autenticación - Movido antes de las condiciones de renderizado
  useEffect(() => {
    // Solo configurar el intervalo si hay una sesión activa
    let checkAuth: NodeJS.Timeout | null = null;
    
    // La lógica condicional está dentro del efecto, pero el hook siempre se ejecuta
    if (session) {
      checkAuth = setInterval(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          window.location.href = '/';
        }
      }, 30000);
    }

    return () => {
      if (checkAuth) clearInterval(checkAuth);
    };
  }, [session]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;

  // Redirigir al login solo si no estamos ya en la página de login
  if (!session && window.location.pathname !== '/login') {
    window.location.href = '/login';
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg">
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ProvidersProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={
                <div className="min-h-screen flex items-center justify-center bg-dark">
                  <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg">
                    <AuthForm />
                  </div>
                </div>
              } />
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
