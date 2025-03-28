
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, Loader2, Link2 } from "lucide-react";
import { useProviders } from "@/contexts/ProvidersContext";

const providerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  url: z.string().url("Debe ser una URL válida"),
  type: z.enum(["API", "Scraping", "XML", "JSON"]),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

interface AddProviderFormProps {
  onSuccess?: () => void;
}

const AddProviderForm: React.FC<AddProviderFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [scraping, setScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapingStatus, setScrapingStatus] = useState<"idle" | "scraping" | "success" | "error">("idle");
  const [productCount, setProductCount] = useState(0);
  const { addProvider } = useProviders();

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      url: "",
      type: "Scraping",
    },
  });

  const simulateScrapingProgress = () => {
    setScraping(true);
    setScrapingStatus("scraping");
    
    let progress = 0;
    let productsFound = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setScrapingStatus("success");
        toast({
          title: "Scraping completado",
          description: `Se encontraron ${productsFound} productos`,
        });
        setScraping(false);
        
        // Añadir el proveedor después de que se complete el scraping
        const values = form.getValues();
        const newProvider = {
          id: `p${Date.now()}`,
          name: values.name,
          url: values.url,
          type: values.type,
          status: "active" as const,
          lastSync: "Justo ahora",
          productCount: productsFound,
          syncProgress: 100,
        };
        
        addProvider(newProvider);
        if (onSuccess) onSuccess();
      } else {
        // Simular encontrar productos mientras avanza el progreso
        if (Math.random() > 0.7) {
          const newProducts = Math.floor(Math.random() * 20) + 1;
          productsFound += newProducts;
          setProductCount(productsFound);
          
          toast({
            title: "Productos encontrados",
            description: `Se encontraron ${newProducts} nuevos productos`,
            variant: "default",
          });
        }
      }
      
      setScrapingProgress(progress);
    }, 800);
    
    return () => clearInterval(interval);
  };

  const onSubmit = async (data: ProviderFormValues) => {
    try {
      toast({
        title: "Iniciando scraping",
        description: `Conectando con ${data.url}`,
      });
      
      // Simular el proceso de scraping
      const cleanup = simulateScrapingProgress();
      
      // En un caso real, aquí se llamaría a la API de scraping
      
      return () => cleanup();
    } catch (error) {
      setScrapingStatus("error");
      setScraping(false);
      toast({
        title: "Error al hacer scraping",
        description: "No se pudo conectar con el proveedor",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mi Proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del Proveedor</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/productos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Conexión</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Scraping">Scraping</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {scrapingStatus !== "idle" && (
          <div className="space-y-4 my-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {scrapingStatus === "scraping" && (
                  <Loader2 className="animate-spin text-primary" size={18} />
                )}
                {scrapingStatus === "success" && (
                  <CheckCircle className="text-green-500" size={18} />
                )}
                {scrapingStatus === "error" && (
                  <AlertCircle className="text-red-500" size={18} />
                )}
                <span>
                  {scrapingStatus === "scraping" && "Extrayendo datos..."}
                  {scrapingStatus === "success" && "Extracción completada"}
                  {scrapingStatus === "error" && "Error en la extracción"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {productCount} productos encontrados
              </span>
            </div>
            <Progress value={scrapingProgress} />
            <p className="text-xs text-muted-foreground">
              {scrapingStatus === "scraping" && "Analizando página y extrayendo datos..."}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            disabled={scraping}
            className="bg-primary hover:bg-primary/90"
          >
            {scraping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Conectar y Extraer
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddProviderForm;
