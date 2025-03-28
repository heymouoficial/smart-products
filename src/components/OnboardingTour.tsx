import { useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useProviders } from '../contexts/ProvidersContext';
import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';

type TourStep = {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

interface TourState {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  completeTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useTour = create<TourState>((set) => ({
  isActive: false,
  currentStep: 0,
  steps: [
    {
      target: '#add-provider-button',
      title: '¡Bienvenido a Smart Products!',
      content: 'Comencemos agregando tu primer proveedor de productos. Haz clic aquí para iniciar el proceso.',
      position: 'bottom'
    },
    {
      target: '#provider-name-input',
      title: 'Nombre del Proveedor',
      content: 'Ingresa el nombre comercial de tu proveedor. Ej: "Mi Tienda Online"'
    },
    {
      target: '#provider-url-input',
      title: 'URL del Proveedor',
      content: 'Ingresa la URL base donde obtendremos los productos. Ej: https://mitienda.com/productos'
    },
    {
      target: '#provider-type-select',
      title: 'Tipo de Conexión',
      content: 'Selecciona el método de integración: API para servicios modernos o Scraping para sitios web tradicionales'
    },
    {
      target: '#provider-submit-button',
      title: '¡Guardar Proveedor!',
      content: 'Revisa los datos y haz clic aquí para completar la configuración inicial.'
    },
    {
      target: '#llm-config-button',
      title: 'Configuración de IA',
      content: 'Ahora configura tu proveedor de inteligencia artificial para análisis avanzado de productos.',
      position: 'top'
    }
  ],
  startTour: () => set({ isActive: true, currentStep: 0 }),
  completeTour: async () => {
    set({ isActive: false });
    // Marcar onboarding completado en Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_complete: true })
        .eq('id', user.id);
    }
  },
  nextStep: () => set((state) => ({
    currentStep: state.currentStep < state.steps.length - 1 ? state.currentStep + 1 : state.currentStep
  })),
  prevStep: () => set((state) => ({
    currentStep: state.currentStep > 0 ? state.currentStep - 1 : 0
  })),
}));

export const OnboardingTour = () => {
  const { isActive, currentStep, steps, nextStep, prevStep, completeTour } = useTour();
  const { providers } = useProviders();

  useEffect(() => {
    if (providers.length > 0) {
      completeTour();
    }
  }, [providers, completeTour]);

  if (!isActive || currentStep >= steps.length) return null;

  const current = steps[currentStep];

  return (
    <Dialog open={isActive} onOpenChange={() => completeTour()}>
      <DialogContent className="max-w-md" style={{ position: 'absolute', ...getPositionStyle(current) }}>
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{current.content}</p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Anterior
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={completeTour}>
                Saltar
              </Button>
              <Button onClick={currentStep === steps.length - 1 ? completeTour : nextStep}>
                {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getPositionStyle = (step: TourStep) => {
  const target = document.querySelector(step.target);
  if (!target) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  const rect = target.getBoundingClientRect();
  const offset = 20;
  
  switch(step.position) {
    case 'top':
      return { top: rect.top - offset + 'px', left: rect.left + 'px' };
    case 'bottom':
      return { top: rect.bottom + offset + 'px', left: rect.left + 'px' };
    case 'left':
      return { top: rect.top + 'px', left: rect.left - offset + 'px' };
    case 'right':
      return { top: rect.top + 'px', left: rect.right + offset + 'px' };
    default:
      return { top: rect.bottom + offset + 'px', left: rect.left + 'px' };
  }
};