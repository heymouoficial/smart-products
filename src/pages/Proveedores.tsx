
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Link2, 
  ExternalLink, 
  MoreHorizontal, 
  Download,
  RefreshCw
} from "lucide-react";
import { Button as MovingButton } from "@/components/ui/moving-border";
import { useProviders } from "@/contexts/ProvidersContext";
import ProviderCard from "@/components/ProviderCard";
import AddProviderDialog from "@/components/AddProviderDialog";

const Proveedores: React.FC = () => {
  const { providers, activeProviders, inactiveProviders } = useProviders();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrar proveedores por término de búsqueda
  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredActive = activeProviders.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredInactive = inactiveProviders.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tus proveedores de productos</p>
        </div>
        <AddProviderDialog />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Buscar proveedores..." 
            className="pl-10" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <RefreshCw size={18} className="mr-2" /> Sincronizar Todo
          </Button>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Download size={18} className="mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activos" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="activos">Activos ({filteredActive.length})</TabsTrigger>
          <TabsTrigger value="inactivos">Inactivos ({filteredInactive.length})</TabsTrigger>
          <TabsTrigger value="todos">Todos ({filteredProviders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActive.map(provider => (
              <ProviderCard 
                key={provider.id} 
                id={provider.id}
                name={provider.name}
                status={provider.status}
                lastSync={provider.lastSync}
                productCount={provider.productCount}
                syncProgress={provider.syncProgress}
                url={provider.url}
                type={provider.type}
                logo={provider.logo}
              />
            ))}
            
            <div className="flex items-center justify-center rounded-xl p-6 border border-dashed border-white/10 hover:border-primary/50 transition-all h-[300px] backdrop-blur-md">
              <AddProviderDialog 
                trigger={
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Plus size={18} className="mr-2" /> Añadir Proveedor
                  </Button>
                }
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inactivos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInactive.map(provider => (
              <ProviderCard 
                key={provider.id} 
                id={provider.id}
                name={provider.name}
                status={provider.status}
                lastSync={provider.lastSync}
                productCount={provider.productCount}
                syncProgress={provider.syncProgress}
                url={provider.url}
                type={provider.type}
                logo={provider.logo}
              />
            ))}
            
            {filteredInactive.length === 0 && (
              <div className="col-span-3 flex items-center justify-center p-10 text-center border border-dashed border-white/10 rounded-xl">
                <div>
                  <p className="text-muted-foreground mb-4">No hay proveedores inactivos o con error que coincidan con tu búsqueda.</p>
                  <AddProviderDialog 
                    trigger={
                      <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                        <Plus size={18} className="mr-2" /> Añadir Proveedor
                      </Button>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="todos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <ProviderCard 
                key={provider.id} 
                id={provider.id}
                name={provider.name}
                status={provider.status}
                lastSync={provider.lastSync}
                productCount={provider.productCount}
                syncProgress={provider.syncProgress}
                url={provider.url}
                type={provider.type}
                logo={provider.logo}
              />
            ))}
            
            <div className="flex items-center justify-center rounded-xl p-6 border border-dashed border-white/10 hover:border-primary/50 transition-all h-[300px] backdrop-blur-md">
              <AddProviderDialog 
                trigger={
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Plus size={18} className="mr-2" /> Añadir Proveedor
                  </Button>
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Proveedores;
