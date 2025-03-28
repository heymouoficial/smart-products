
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Database, 
  BarChart, 
  Settings, 
  RefreshCw,
  Link2,
  FileText,
  HelpCircle
} from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-dark-border bg-sidebar flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-electric flex items-center justify-center">
            <RefreshCw size={18} className="text-black" />
          </div>
          <span className="font-bold text-xl">SyncPro</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        <SidebarLink icon={<Home size={20} />} to="/" label="Dashboard" active />
        <SidebarLink icon={<Database size={20} />} to="/proveedores" label="Proveedores" />
        <SidebarLink icon={<Link2 size={20} />} to="/mapeo" label="Mapeo" />
        <SidebarLink icon={<RefreshCw size={20} />} to="/sincronizacion" label="Sincronización" />
        <SidebarLink icon={<BarChart size={20} />} to="/estadisticas" label="Estadísticas" />
        <SidebarLink icon={<FileText size={20} />} to="/logs" label="Logs" />
      </nav>
      
      <div className="p-4 border-t border-dark-border">
        <SidebarLink icon={<Settings size={20} />} to="/configuracion" label="Configuración" />
        <SidebarLink icon={<HelpCircle size={20} />} to="/ayuda" label="Ayuda" />
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, to, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
        active 
          ? "bg-electric/10 text-electric electric-glow" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-electric"
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && (
        <div className="ml-auto h-2 w-2 rounded-full bg-electric animate-pulse-glow"></div>
      )}
    </Link>
  );
};

export default Sidebar;
