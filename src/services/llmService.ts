import { toast } from '@/hooks/use-toast';

export type LLMProvider = 'openrouter' | 'deepseek';

// Clave API predeterminada para DeepSeek
const DEFAULT_DEEPSEEK_API_KEY = 'sk-c7ccc45b2fb04e0fb291cb99c862ea89';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  maxTokens: number;
}

export const configureLLM = async (config: LLMConfig) => {
  try {
    // Validación básica de la clave API
    if (!config.apiKey || config.apiKey.length < 20) {
      throw new Error('Clave API inválida');
    }

    // Configuración para OpenRouter
    if (config.provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': import.meta.env.VITE_APP_URL,
          'X-Title': 'Smart Products'
        }
      });

      if (!response.ok) throw new Error('Error de autenticación con OpenRouter');
    }

    // Configuración para DeepSeek
    if (config.provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      });

      if (!response.ok) throw new Error('Error de autenticación con DeepSeek');
    }

|    // Guardar la configuración en localStorage
    localStorage.setItem('llmConfig', JSON.stringify(config));

    toast({
      title: 'Configuración exitosa',
      description: `Conexión con ${config.provider} establecida correctamente`
    });

    return true;
  } catch (error) {
    console.error('Error en configuración LLM:', error);
    toast({
      title: 'Error de configuración',
      variant: 'destructive',
      description: error instanceof Error ? error.message : 'Error desconocido'
    });
    return false;
  }
};

// Obtener la configuración actual del LLM
export const getCurrentLLMConfig = (): LLMConfig | null => {
  try {
    // Intentar obtener la configuración guardada
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig) as LLMConfig;
    }
    
    // Si no hay configuración guardada, usar la configuración predeterminada para DeepSeek
    return {
      provider: 'deepseek',
      apiKey: DEFAULT_DEEPSEEK_API_KEY,
      model: 'deepseek-coder',
      maxTokens: 1000
    };
  } catch (error) {
    console.error('Error al obtener la configuración LLM:', error);
    return null;
  }
};