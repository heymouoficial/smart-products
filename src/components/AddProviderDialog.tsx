
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddProviderForm from "./AddProviderForm";
import { Button as MovingButton } from "@/components/ui/moving-border";

interface AddProviderDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const AddProviderDialog: React.FC<AddProviderDialogProps> = ({ 
  trigger,
  onSuccess 
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <MovingButton 
            containerClassName="w-auto h-10"
            borderClassName="bg-[radial-gradient(var(--primary)_40%,transparent_60%)]"
            className="bg-dark/50 border-dark-border text-sm h-full"
            borderRadius="0.5rem"
          >
            <Plus size={18} className="mr-2" /> Nuevo Proveedor
          </MovingButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass border border-white/10">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Proveedor</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del proveedor para conectar y extraer sus productos.
          </DialogDescription>
        </DialogHeader>
        <AddProviderForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddProviderDialog;
