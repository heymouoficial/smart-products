
import React, { createContext, useContext, useState, useEffect } from "react";
import { scrapWebsite } from "@/services/scrapingService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/services/supabaseClient";

// Definir el tipo para un proveedor
export interface Provider {
  id: string;
  name: string;
  url: string;
  type: "API" | "Scraping" | "XML" | "JSON";
  status: "active" | "inactive" | "error";
  lastSync: string;
  productCount: number;
  syncProgress: number;
  logo?: string;
  lastAnalysis?: string;
  scheduledSync?: boolean;
}

// Datos iniciales para demostración
const initialProviders: Provider[] = [
  {
    id: "p1",
    name: "Proveedor A",
    url: "https://proveedor-a.com/api",
    type: "API",
    status: "active",
    lastSync: "Hace 45 minutos",
    productCount: 743,
    syncProgress: 100,
    scheduledSync: true,
  },
  {
    id: "p2",
    name: "Proveedor B",
    url: "https://proveedor-b.com/feed.xml",
    type: "XML",
    status: "error",
    lastSync: "Hace 2 días",
    productCount: 128,
    syncProgress: 65,
    scheduledSync: false,
  },
  {
    id: "p3",
    name: "Proveedor C",
    url: "https://proveedor-c.com/products",
    type: "Scraping",
    status: "active",
    lastSync: "Hace 1 día",
    productCount: 377,
    syncProgress: 100,
    scheduledSync: true,
  },
];

interface ProvidersContextType {
  providers: Provider[];
  activeProviders: Provider[];
  inactiveProviders: Provider[];
  addProvider: (provider: Provider) => void;
  updateProvider: (id: string, provider: Partial<Provider>) => void;
  removeProvider: (id: string) => void;
  syncProvider: (id: string) => Promise<void>;
  toggleScheduledSync: (id: string) => void;
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export const ProvidersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<Provider[]>(() => {
    const savedProviders = localStorage.getItem("providers");
    console.log('Cargando proveedores desde localStorage:', savedProviders);
    const initial = savedProviders ? JSON.parse(savedProviders) : [{
      id: 'demo',
      name: 'Proveedor Demo',
      url: 'https://demo.com',
      type: 'API',
      status: 'active',
      lastSync: new Date().toISOString(),
      productCount: 42,
      syncProgress: 100
    }];
    console.log('Estado inicial de proveedores:', initial);
    return initial;
  });

  // Guardar proveedores en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("providers", JSON.stringify(providers));
  }, [providers]);

  const activeProviders = providers.filter(p => p.status === "active");
  const inactiveProviders = providers.filter(p => p.status !== "active");

  const addProvider = (provider: Provider) => {
    setProviders(prev => [...prev, provider]);
  };

  const updateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prev => 
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
          logger.info('Proveedor eliminado', 'ProvidersContext');
  };
const syncProvider = async (id: string) => {
    console.log('Iniciando sincronización para proveedor ID:', id);
    try {
      setProviders(prev => {
        const updated = prev.map(provider => {
          if (provider.id === id) {
            console.log('Actualizando proveedor:', provider.name);
            return {
              ...provider,
              status: 'active',
              lastSync: new Date().toISOString(),
              syncProgress: 100
            };
          }
          return provider;
        });
        console.log('Proveedores actualizados:', updated);
        localStorage.setItem("providers", JSON.stringify(updated));
        return updated;
      });
      toast({
        title: 'Sincronización exitosa',
        description: `Datos de ${providers.find(p => p.id === id)?.name} actualizados correctamente`
      });
    } catch (error) {
      console.error('Error en sincronización:', error);
      toast({
        title: 'Error de sincronización',
        variant: 'destructive',
        description: 'No se pudieron actualizar los datos del proveedor'
      });
    }
  };

  const toggleScheduledSync = (id: string) => {
    const provider = providers.find(p => p.id === id);
    if (!provider) return;
    
    updateProvider(id, { scheduledSync: !provider.scheduledSync });
    
    toast({
      title: provider.scheduledSync ? "Sincronización programada desactivada" : "Sincronización programada activada",
      description: provider.scheduledSync 
        ? `La sincronización automática de ${provider.name} ha sido desactivada.` 
        : `${provider.name} se sincronizará automáticamente cada 24 horas a las 2:00 AM.`,
    });
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('providers')
          .select('*');
  
        if (error) throw error;
        setProviders(data);
      } catch (err) {
        setError(err.message);
        logger.error('Error cargando proveedores', err);
      } finally {
        setLoading(false);
      }
    };
  
    loadProviders();
  }, []);

  return (
    <ProvidersContext.Provider value={{
      providers,
      activeProviders,
      inactiveProviders,
      loading,
      error,
      addProvider,
      updateProvider,
      removeProvider,
      syncProvider,
      toggleScheduledSync
    }}>
      {children}
    </ProvidersContext.Provider>
  );
};

export const useProviders = () => {
  const context = useContext(ProvidersContext);
  if (context === undefined) {
    throw new Error("useProviders debe usarse dentro de un ProvidersProvider");
  }
  return context;
};
