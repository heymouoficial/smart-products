
import React from "react";
import { Progress } from "@/components/ui/progress";

interface SyncProgressProps {
  progress: number;
  totalProducts: number;
  syncedProducts: number;
  status: "idle" | "syncing" | "completed" | "error";
}

const SyncProgress: React.FC<SyncProgressProps> = ({
  progress,
  totalProducts,
  syncedProducts,
  status
}) => {
  return (
    <div className="rounded-xl p-6 glass border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Estado de Sincronización</h3>
        <div className={`px-2 py-1 rounded-full text-xs 
          ${status === "idle" ? "bg-muted text-muted-foreground" : 
            status === "syncing" ? "bg-primary/20 text-primary animate-pulse" : 
            status === "completed" ? "bg-green-500/20 text-green-400" : 
            "bg-red-500/20 text-red-400"}`}>
          {status === "idle" ? "Inactivo" : 
           status === "syncing" ? "Sincronizando..." : 
           status === "completed" ? "Completado" : 
           "Error"}
        </div>
      </div>
      
      <div className="space-y-3">
        <Progress value={progress} className="h-2 bg-secondary" />
        
        <div className="flex justify-between text-sm">
          <span>{syncedProducts} de {totalProducts} productos</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
        
        {status === "syncing" && (
          <div className="text-xs text-muted-foreground mt-2">
            Sincronizando productos desde Proveedor A - Estimado: 2 min restantes
          </div>
        )}
        
        {status === "error" && (
          <div className="text-xs text-red-400 mt-2">
            Error en la sincronización. Revisar logs para más detalles.
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncProgress;
