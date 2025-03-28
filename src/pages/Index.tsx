
import React from "react";
import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import SyncProgress from "@/components/SyncProgress";
import RecentActivity from "@/components/RecentActivity";
import ProviderCard from "@/components/ProviderCard";
import AddProviderDialog from "@/components/AddProviderDialog";
import { 
  BarChart, 
  ShoppingCart, 
  RefreshCw, 
  Store, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/contexts/ProvidersContext";

const Dashboard: React.FC = () => {
  const { activeProviders } = useProviders();
  
  // Datos de ejemplo
  const activities = [
    {
      id: "a1",
      type: "sync" as const,
      message: "Sincronización completada: 128 productos actualizados",
      timestamp: "Hace 45 minutos"
    },
    {
      id: "a2",
      type: "error" as const,
      message: "Error de conexión con Proveedor B",
      timestamp: "Hace 2 horas"
    },
    {
      id: "a3",
      type: "update" as const,
      message: "Mapeo de categorías actualizado para Proveedor A",
      timestamp: "Hace 3 horas"
    },
    {
      id: "a4",
      type: "info" as const,
      message: "Próxima sincronización programada a las 18:00",
      timestamp: "Programado"
    }
  ];

  // Calcular estadísticas basadas en proveedores
  const totalProducts = activeProviders.reduce((total, provider) => total + provider.productCount, 0);
  const totalProviders = activeProviders.length;
  
  const stats = [
    {
      id: "1",
      title: "Total Productos",
      value: totalProducts.toString(),
      description: "Disponibles para sincronizar",
      icon: <ShoppingCart size={20} />,
      trend: "up" as const,
      trendValue: "12%"
    },
    {
      id: "2",
      title: "Proveedores",
      value: totalProviders.toString(),
      description: `${activeProviders.length} activos`,
      icon: <Store size={20} />,
    },
    {
      id: "3",
      title: "Sincronizaciones",
      value: "24",
      description: "Última: hace 45min",
      icon: <RefreshCw size={20} />,
    },
    {
      id: "4",
      title: "Conversión Exitosa",
      value: "98%",
      description: "2% errores",
      icon: <BarChart size={20} />,
      trend: "up" as const,
      trendValue: "3%"
    }
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inicio</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo, Admin</p>
        </div>
        <AddProviderDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SyncProgress 
            progress={65} 
            totalProducts={128} 
            syncedProducts={83} 
            status="syncing" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProviders.slice(0, 2).map((provider) => (
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
            
            <div className="flex items-center justify-center rounded-xl p-6 border border-dashed border-white/10 hover:border-primary/50 transition-all h-full backdrop-blur-md">
              <AddProviderDialog 
                trigger={
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Plus size={18} className="mr-2" /> Añadir Proveedor
                  </Button>
                }
              />
            </div>
          </div>
        </div>
        
        <RecentActivity activities={activities} />
      </div>
    </Layout>
  );
};

export default Dashboard;
