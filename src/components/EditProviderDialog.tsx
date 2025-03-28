
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Link2 } from "lucide-react";
import { useProviders } from "@/contexts/ProvidersContext";
import { Provider } from "@/contexts/ProvidersContext";

interface EditProviderDialogProps {
  provider: Provider;
  trigger?: React.ReactNode;
}

const EditProviderDialog: React.FC<EditProviderDialogProps> = ({ provider, trigger }) => {
  const { updateProvider } = useProviders();
  const [name, setName] = useState(provider.name);
  const [url, setUrl] = useState(provider.url);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setName(provider.name);
      setUrl(provider.url);
    }
  }, [open, provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProvider(provider.id, {
        name,
        url,
        status: "active", // Reactivamos el proveedor si estaba inactivo
        lastSync: "Pendiente",
        syncProgress: 0,
      });

      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon" className="h-8 w-8 border-dark-border">
            <Edit size={14} className="text-muted-foreground hover:text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass border border-white/10">
        <DialogHeader>
          <DialogTitle>Editar Proveedor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Proveedor</Label>
            <Input
              id="name"
              placeholder="Nombre descriptivo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL del Proveedor</Label>
            <div className="flex items-center space-x-2">
              <Link2 size={16} className="text-muted-foreground" />
              <Input
                id="url"
                placeholder="https://proveedor.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="border-dark-border">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProviderDialog;
