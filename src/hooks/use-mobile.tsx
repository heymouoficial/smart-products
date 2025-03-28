
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Función para verificar si el dispositivo es móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Verificar al inicio
    checkIsMobile();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', checkIsMobile);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}
