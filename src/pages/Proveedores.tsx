
import React from "react";
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

const Proveedores: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tus proveedores de productos</p>
        </div>
        <Button className="bg-electric hover:bg-electric-dark text-white">
          <Plus size={18} className="mr-2" /> Nuevo Proveedor
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Buscar proveedores..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-electric/30 text-electric hover:bg-electric/10">
            <RefreshCw size={18} className="mr-2" /> Sincronizar Todo
          </Button>
          <Button variant="outline" className="border-electric/30 text-electric hover:bg-electric/10">
            <Download size={18} className="mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activos" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="activos">Activos (2)</TabsTrigger>
          <TabsTrigger value="inactivos">Inactivos (1)</TabsTrigger>
          <TabsTrigger value="todos">Todos (3)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProviderDetailCard 
              name="Proveedor A"
              url="https://proveedor-a.com/api"
              productCount={743}
              type="API"
              status="active"
              lastSync="Hace 45 minutos"
            />
            
            <ProviderDetailCard 
              name="Proveedor C"
              url="https://proveedor-c.com/products"
              productCount={377}
              type="Scraping"
              status="active"
              lastSync="Hace 1 día"
            />
            
            <div className="flex items-center justify-center rounded-xl p-6 border border-dashed border-dark-border hover:border-electric/50 transition-all h-[300px]">
              <Button variant="outline" className="border-electric/30 text-electric hover:bg-electric/10">
                <Plus size={18} className="mr-2" /> Añadir Proveedor
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inactivos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProviderDetailCard 
              name="Proveedor B"
              url="https://proveedor-b.com/feed.xml"
              productCount={128}
              type="XML"
              status="error"
              lastSync="Hace 2 días"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="todos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mostraría todos los proveedores */}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

interface ProviderDetailCardProps {
  name: string;
  url: string;
  productCount: number;
  type: "API" | "XML" | "JSON" | "Scraping";
  status: "active" | "inactive" | "error";
  lastSync: string;
}

const ProviderDetailCard: React.FC<ProviderDetailCardProps> = ({
  name,
  url,
  productCount,
  type,
  status,
  lastSync
}) => {
  return (
    <div className="rounded-xl p-6 card-gradient border border-dark-border hover:border-electric/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md flex items-center justify-center bg-electric/10 text-electric">
            <Link2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`h-2 w-2 rounded-full ${
                status === "active" ? "bg-green-400" : 
                status === "inactive" ? "bg-muted" : 
                "bg-red-400"
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {status === "active" ? "Activo" : 
                 status === "inactive" ? "Inactivo" : 
                 "Error"}
              </span>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-electric">
          <MoreHorizontal size={18} />
        </Button>
      </div>
      
      <div className="space-y-4 mt-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1">URL del proveedor</p>
          <div className="flex items-center gap-2">
            <p className="text-sm truncate flex-1">{url}</p>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-electric h-6 w-6">
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Productos</p>
            <p className="font-medium">{productCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Tipo</p>
            <p className="font-medium">{type}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Última sync</p>
            <p className="font-medium">{lastSync}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="sm" className="border-dark-border text-muted-foreground hover:text-foreground">
            Ver detalles
          </Button>
          
          <Button size="sm" className="bg-electric hover:bg-electric-dark text-white">
            <RefreshCw size={14} className="mr-1" /> Sincronizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Proveedores;
