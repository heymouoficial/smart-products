
import React from "react";
import { Link2, ExternalLink, Check, RefreshCw, Trash2, AlertCircle, Loader2, Clock, Edit, BarChart, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/contexts/ProvidersContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProviderDialog from "./EditProviderDialog";
import ProductAnalysisDialog from "./ProductAnalysisDialog";
import LogsDialog from "./LogsDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProviderCardProps {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  lastSync: string;
  productCount: number;
  syncProgress: number;
  url: string;
  type: string;
  logo?: string;
  scheduledSync?: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  id,
  name,
  status,
  lastSync,
  productCount,
  syncProgress,
  url,
  type,
  logo,
  scheduledSync = false
}) => {
  const { syncProvider, removeProvider, toggleScheduledSync } = useProviders();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Sincronización iniciada",
      description: `Sincronizando ${name}...`,
    });
    
    try {
      await syncProvider(id);
      toast({
        title: "Sincronización completada",
        description: `${name} se ha sincronizado correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: `No se pudo sincronizar ${name}.`,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemove = () => {
    removeProvider(id);
    toast({
      title: "Proveedor eliminado",
      description: `${name} ha sido eliminado.`,
    });
  };

  const handleToggleScheduledSync = () => {
    toggleScheduledSync(id);
  };

  const openProviderUrl = () => {
    window.open(url, "_blank");
  };

  return (
    <div className="rounded-xl p-6 glass border border-white/10 hover:border-primary/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
            {logo ? <img src={logo} alt={name} className="h-6 w-6" /> : <Link2 size={20} />}
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
              {scheduledSync && (
                <span className="text-xs flex items-center text-blue-400">
                  <Clock size={10} className="mr-1" /> Auto
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={openProviderUrl}>
            <ExternalLink size={18} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Edit size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border border-white/10">
              <EditProviderDialog 
                provider={{ 
                  id, name, url, type: type as any, status, lastSync, productCount, syncProgress, logo 
                }}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                    <Edit size={14} className="mr-2" /> Editar Proveedor
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem onClick={handleToggleScheduledSync} className="cursor-pointer">
                <Clock size={14} className="mr-2" /> 
                {scheduledSync ? "Desactivar Auto-Sync" : "Activar Auto-Sync"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Última sincronización: {lastSync}</span>
          <span>{productCount} productos</span>
        </div>
        
        <Progress value={syncProgress} className="h-1.5 bg-secondary" />
        
        <div className="flex justify-between items-center mt-4">
          {status === "active" && !isSyncing && (
            <span className="text-xs flex items-center gap-1 text-green-400">
              <Check size={14} /> Sincronizado
            </span>
          )}
          
          {status === "error" && !isSyncing && (
            <span className="text-xs flex items-center gap-1 text-red-400">
              <AlertCircle size={14} /> Error
            </span>
          )}
          
          {isSyncing && (
            <span className="text-xs flex items-center gap-1 text-primary">
              <Loader2 size={14} className="animate-spin" /> Sincronizando...
            </span>
          )}
          
          <div className="flex gap-2 ml-auto">
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-dark-border">
                    <MoreHorizontal size={14} className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border border-white/10">
                  <ProductAnalysisDialog 
                    provider={{ 
                      id, name, url, type: type as any, status, lastSync, productCount, syncProgress, logo 
                    }}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <BarChart size={14} className="mr-2" /> Análisis de Productos
                      </DropdownMenuItem>
                    }
                  />
                  <LogsDialog 
                    provider={{ 
                      id, name, url, type: type as any, status, lastSync, productCount, syncProgress, logo 
                    }}
                    trigger={
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <FileText size={14} className="mr-2" /> Ver Logs
                      </DropdownMenuItem>
                    }
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-400">
                        <Trash2 size={14} className="mr-2" /> Eliminar
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass border border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este proveedor?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente {name} y todos sus productos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-dark-border bg-background text-muted-foreground">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <ProductAnalysisDialog 
                  provider={{ 
                    id, name, url, type: type as any, status, lastSync, productCount, syncProgress, logo 
                  }}
                />
                
                <LogsDialog 
                  provider={{ 
                    id, name, url, type: type as any, status, lastSync, productCount, syncProgress, logo 
                  }}
                />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-dark-border">
                      <Trash2 size={14} className="text-muted-foreground hover:text-red-400" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass border border-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar este proveedor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente {name} y todos sus productos asociados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-dark-border bg-background text-muted-foreground">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemove} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-electric-dark text-white"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : (
                <RefreshCw size={14} className="mr-1" />
              )}
              Sincronizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
