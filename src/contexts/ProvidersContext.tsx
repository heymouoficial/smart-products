
import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const ProvidersContext = createContext<ProvidersContextType | undefined>(undefined);

export const ProvidersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<Provider[]>(() => {
    const savedProviders = localStorage.getItem("providers");
    return savedProviders ? JSON.parse(savedProviders) : initialProviders;
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
  };

  const syncProvider = async (id: string) => {
    // Actualizar el estado a "sincronizando"
    updateProvider(id, { syncProgress: 0 });
    
    // Simular una sincronización
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Sincronización completada
        updateProvider(id, { 
          syncProgress: 100, 
          lastSync: "Justo ahora",
          status: "active"
        });
      } else {
        updateProvider(id, { syncProgress: progress });
      }
    }, 500);
    
    // Para demostración, devolver una promesa que se resuelve
    return new Promise<void>(resolve => {
      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, 5000);
    });
  };

  return (
    <ProvidersContext.Provider
      value={{
        providers,
        activeProviders,
        inactiveProviders,
        addProvider,
        updateProvider,
        removeProvider,
        syncProvider,
      }}
    >
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
