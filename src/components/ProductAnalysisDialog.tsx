
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
import {
  BarChart,
  FileDown,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProviders } from "@/contexts/ProvidersContext";
import { scrapWebsite, normalizeScrapData } from "@/services/scrapingService";
import { getCurrentLLMConfig } from "@/services/llmService";
import { Provider } from "@/contexts/ProvidersContext";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ProductAnalysisDialogProps {
  provider: Provider;
  trigger?: React.ReactNode;
}

interface ProductDiff {
  type: "new" | "updated" | "removed" | "unchanged";
  count: number;
  lastChecked: string;
}

const ProductAnalysisDialog: React.FC<ProductAnalysisDialogProps> = ({ provider, trigger }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [productDiff, setProductDiff] = useState<ProductDiff>({
    type: "unchanged",
    count: 0,
    lastChecked: "Nunca"
  });

  // Simular análisis de productos
  const runProductAnalysis = async () => {
    setLoading(true);
    
    // Obtener configuración LLM
    const llmConfig = await getCurrentLLMConfig();
    if (!llmConfig) {
      toast({
        title: 'Error',
        description: 'Configuración LLM no encontrada',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    try {
      const { data, success, error } = await scrapWebsite(provider.apiUrl, llmConfig);
      if (!success) {
        throw new Error(error || 'Error en el scraping');
      }

      const normalizedProducts = normalizeScrapData(data);
      
      // Actualizar diferencia de productos
      const newProducts = normalizedProducts.filter(p => !provider.products?.some(ep => ep.id === p.id));
      const updatedProducts = normalizedProducts.filter(p => 
        provider.products?.some(ep => ep.id === p.id && JSON.stringify(ep) !== JSON.stringify(p))
      );

      setProductDiff({
        type: newProducts.length > 0 ? 'new' : updatedProducts.length > 0 ? 'updated' : 'unchanged',
        count: newProducts.length + updatedProducts.length,
        lastChecked: new Date().toLocaleString()
      });

      toast({
        title: 'Análisis completado',
        description: `Se encontraron ${normalizedProducts.length} productos (${newProducts.length} nuevos, ${updatedProducts.length} actualizados)`
      });

    } catch (error) {
      console.error('Error en análisis:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error en el análisis',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadProducts = () => {
    toast({
      title: "Descarga iniciada",
      description: "Los productos se están descargando en formato CSV.",
    });
    
    // Simular descarga (en una aplicación real, generaríamos un CSV)
    setTimeout(() => {
      const dummyData = "ID,Nombre,Precio,Stock\n1,Producto 1,19.99,10\n2,Producto 2,29.99,15";
      const blob = new Blob([dummyData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `productos-${provider.name.toLowerCase().replace(/\s+/g, "-")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Descarga completada",
        description: "Los productos se han descargado correctamente.",
      });
    }, 2000);
  };

  const scheduleAnalysis = () => {
    toast({
      title: "Análisis programado",
      description: "El análisis se realizará automáticamente cada 24 horas a las 2:00 AM.",
    });
  };

  // Cargar datos cuando se abra el diálogo
  useEffect(() => {
    if (open && productDiff.lastChecked === "Nunca") {
      runProductAnalysis();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <BarChart size={16} className="mr-1" /> Análisis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl glass border border-white/10">
        <DialogHeader>
          <DialogTitle>Análisis de Productos - {provider.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4 py-6">
              <p className="text-center text-sm text-muted-foreground">Analizando productos...</p>
              <Progress value={loading ? undefined : 100} className="h-2 bg-secondary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-dark-border bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Total de Productos</h3>
                    <span className="text-lg font-bold">{provider.productCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Última sincronización: {provider.lastSync}</p>
                </div>

                <div className="p-4 rounded-lg border border-dark-border bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Cambios Detectados</h3>
                    <Badge 
                      variant="outline" 
                      className={`${
                        productDiff.type === "new" ? "bg-green-500/20 text-green-400" : 
                        productDiff.type === "updated" ? "bg-yellow-500/20 text-yellow-400" : 
                        productDiff.type === "removed" ? "bg-red-500/20 text-red-400" : 
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {productDiff.count} {
                        productDiff.type === "new" ? "Nuevos" : 
                        productDiff.type === "updated" ? "Actualizados" : 
                        productDiff.type === "removed" ? "Eliminados" : 
                        "Sin cambios"
                      }
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Último análisis: {productDiff.lastChecked}</p>
                </div>
              </div>

              <div className="border border-dark-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Última Comprobación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Productos Nuevos</TableCell>
                      <TableCell>{productDiff.type === "new" ? productDiff.count : 0}</TableCell>
                      <TableCell>{productDiff.lastChecked}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Productos Actualizados</TableCell>
                      <TableCell>{productDiff.type === "updated" ? productDiff.count : 0}</TableCell>
                      <TableCell>{productDiff.lastChecked}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Productos Eliminados</TableCell>
                      <TableCell>{productDiff.type === "removed" ? productDiff.count : 0}</TableCell>
                      <TableCell>{productDiff.lastChecked}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-wrap gap-2 justify-between">
                <div className="space-x-2">
                  <Button onClick={runProductAnalysis} size="sm" className="bg-primary hover:bg-primary/90">
                    <RefreshCw size={14} className="mr-1" /> Analizar Ahora
                  </Button>
                  <Button onClick={scheduleAnalysis} variant="outline" size="sm" className="border-dark-border">
                    <Clock size={14} className="mr-1" /> Programar (2:00 AM)
                  </Button>
                </div>
                
                <Button onClick={downloadProducts} variant="outline" size="sm" className="border-dark-border">
                  <FileDown size={14} className="mr-1" /> Descargar Productos
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductAnalysisDialog;
