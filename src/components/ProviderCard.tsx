
import React from "react";
import { Link2, ExternalLink, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProviderCardProps {
  name: string;
  status: "active" | "inactive" | "error";
  lastSync: string;
  productCount: number;
  syncProgress: number;
  logo?: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  name,
  status,
  lastSync,
  productCount,
  syncProgress,
  logo
}) => {
  return (
    <div className="rounded-xl p-6 card-gradient border border-dark-border hover:border-electric/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md flex items-center justify-center bg-electric/10 text-electric">
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
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-electric">
          <ExternalLink size={18} />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Última sincronización: {lastSync}</span>
          <span>{productCount} productos</span>
        </div>
        
        <Progress value={syncProgress} className="h-1.5 bg-secondary" />
        
        <div className="flex justify-between items-center mt-4">
          {status === "active" && (
            <span className="text-xs flex items-center gap-1 text-green-400">
              <Check size={14} /> Sincronizado
            </span>
          )}
          
          <Button size="sm" className="ml-auto bg-electric hover:bg-electric-dark text-white">
            Sincronizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
