
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FileText, Download, RefreshCw, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Provider } from "@/contexts/ProvidersContext";
import { useToast } from "@/hooks/use-toast";
import { logger, LogEntry } from "@/services/logger";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/services/supabaseClient";

interface LogsDialogProps {
  provider: Provider;
  trigger?: React.ReactNode;
}

type LogLevel = "info" | "warn" | "error" | "debug";
type LogCategory = "system" | "auth" | "sync" | "api" | "scraping" | "llm";

const LogsDialog: React.FC<LogsDialogProps> = ({ provider, trigger }) => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | "">("");
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | "">("");
  const { toast } = useToast();

  // Cargar logs reales desde Supabase
  const fetchLogs = async () => {
    setLoading(true);
    
    try {
      // Obtener el ID del usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Obtener logs filtrados
      const fetchedLogs = await logger.getPersistedLogs({
        limit: 50,
        level: selectedLevel || undefined,
        category: selectedCategory || undefined,
        provider_id: provider.id,
        user_id: userId
      });
      
      // Convertir nivel "warn" a "warning" para mantener compatibilidad con la interfaz
      const formattedLogs = fetchedLogs.map(log => ({
        ...log,
        id: log.id || `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        level: log.level === 'warn' ? 'warning' as any : log.level
      }));
      
      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error al cargar logs:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los logs. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open, selectedLevel, selectedCategory]);

  const downloadLogs = () => {
    toast({
      title: "Descarga iniciada",
      description: "Los logs se están descargando.",
    });
    
    setTimeout(() => {
      const logText = logs.map(log => {
        const category = log.category ? `[${log.category.toUpperCase()}]` : '';
        return `[${new Date(log.timestamp).toLocaleString()}] [${log.level.toUpperCase()}] ${category} ${log.message} ${log.context ? `(${log.context})` : ''}`;
      }).join("\n");
      
      const blob = new Blob([logText], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logs-${provider.name.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Descarga completada",
        description: "Los logs se han descargado correctamente.",
      });
    }, 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <FileText size={16} className="mr-1" /> Logs
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl glass border border-white/10">
        <DialogHeader>
          <DialogTitle>Logs del Sistema - {provider.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400">
                Info: {logs.filter(l => l.level === "info").length}
              </Badge>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
                Advertencias: {logs.filter(l => l.level === "warning").length}
              </Badge>
              <Badge variant="outline" className="bg-red-500/20 text-red-400">
                Errores: {logs.filter(l => l.level === "error").length}
              </Badge>
            </div>
            
            <Button onClick={fetchLogs} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} /> Actualizar
            </Button>
          </div>
          
          <div className="flex gap-2 items-center">
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Filtrar por:</span>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Advertencia</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
                <SelectItem value="auth">Autenticación</SelectItem>
                <SelectItem value="sync">Sincronización</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="scraping">Scraping</SelectItem>
                <SelectItem value="llm">LLM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="h-60 flex items-center justify-center">
              <p className="text-muted-foreground">Cargando logs...</p>
            </div>
          ) : (
            <ScrollArea className="h-60 rounded-md border border-dark-border bg-background/50">
              <div className="p-4 space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="text-xs">
                    <span className="text-muted-foreground">[{formatTimestamp(log.timestamp)}]</span>
                    <span className={`ml-2 font-medium ${
                      log.level === "info" ? "text-blue-400" : 
                      log.level === "warning" ? "text-yellow-400" : 
                      "text-red-400"
                    }`}>
                      [{log.level.toUpperCase()}]
                    </span>
                    {log.category && (
                      <span className="ml-2 text-purple-400">[{log.category.toUpperCase()}]</span>
                    )}
                    <span className="ml-2">{log.message}</span>
                    {log.context && (
                      <span className="ml-2 text-gray-400">({log.context})</span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end">
            <Button onClick={downloadLogs} variant="outline" size="sm" className="border-dark-border">
              <Download size={14} className="mr-1" /> Descargar Logs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogsDialog;
