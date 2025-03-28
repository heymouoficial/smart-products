
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
import { FileText, Download, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Provider } from "@/contexts/ProvidersContext";
import { useToast } from "@/hooks/use-toast";

interface LogsDialogProps {
  provider: Provider;
  trigger?: React.ReactNode;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

const LogsDialog: React.FC<LogsDialogProps> = ({ provider, trigger }) => {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generar logs de ejemplo
  const generateSampleLogs = () => {
    setLoading(true);
    
    setTimeout(() => {
      const sampleLogs: LogEntry[] = [];
      const levels: ("info" | "warning" | "error")[] = ["info", "warning", "error"];
      const messageTemplates = [
        "Iniciando sincronización de {provider}",
        "Conectando con {url}",
        "Extrayendo productos de {provider}",
        "Encontrados {count} productos",
        "Procesando datos de productos",
        "Actualizando base de datos local",
        "Sincronización completada con {success} éxitos y {failed} fallos",
        "Error al conectar con {url}",
        "Timeout en la solicitud a {provider}",
        "Error de formato en respuesta de {provider}"
      ];
      
      const timestamps = [];
      const now = new Date();
      for (let i = 0; i < 15; i++) {
        const pastTime = new Date(now.getTime() - i * 60000 * (Math.random() * 10 + 1));
        timestamps.push(pastTime);
      }
      timestamps.sort((a, b) => b.getTime() - a.getTime());
      
      for (let i = 0; i < 15; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        let message = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
        
        message = message
          .replace("{provider}", provider.name)
          .replace("{url}", provider.url)
          .replace("{count}", Math.floor(Math.random() * 1000 + 50).toString())
          .replace("{success}", Math.floor(Math.random() * 100).toString())
          .replace("{failed}", Math.floor(Math.random() * 10).toString());
        
        sampleLogs.push({
          id: `log-${i}`,
          timestamp: timestamps[i].toISOString(),
          level,
          message
        });
      }
      
      setLogs(sampleLogs);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      generateSampleLogs();
    }
  }, [open]);

  const downloadLogs = () => {
    toast({
      title: "Descarga iniciada",
      description: "Los logs se están descargando.",
    });
    
    setTimeout(() => {
      const logText = logs.map(log => 
        `[${new Date(log.timestamp).toLocaleString()}] [${log.level.toUpperCase()}] ${log.message}`
      ).join("\n");
      
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
            
            <Button onClick={generateSampleLogs} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} /> Actualizar
            </Button>
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
                    <span className="ml-2">{log.message}</span>
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
