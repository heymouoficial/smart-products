import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { configureLLM } from '@/services/llmService';
import { toast } from '@/hooks/use-toast';

export const LLMConfigDialog = () => {
  const [provider, setProvider] = useState<'openrouter' | 'deepseek'>('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [maxTokens, setMaxTokens] = useState('');

  const handleSubmit = async () => {
    if (!apiKey || apiKey.length < 20) {
      toast({
        title: 'Error',
        description: 'La clave API debe tener al menos 20 caracteres.',
        variant: 'destructive'
      });
      return;
    }

    const config = {
      provider,
      apiKey,
      model,
      maxTokens: parseInt(maxTokens) || 1000
    };

    const success = await configureLLM(config);
    if (success) {
      toast({
        title: 'Configuración exitosa',
        description: `Proveedor ${provider} configurado correctamente.`
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar Proveedor LLM</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="llm-config-provider">Proveedor</Label>
            <Select value={provider} onValueChange={(v: 'openrouter' | 'deepseek') => setProvider(v)}>
              <SelectTrigger id="llm-config-provider">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
                <SelectItem value="deepseek">DeepSeek</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="llm-api-key-input">Clave API</Label>
            <Input
              id="llm-api-key-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="llm-model-input">Modelo</Label>
            <Input
              id="llm-model-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ej: gpt-4"
            />
          </div>
          <div>
            <Label htmlFor="llm-max-tokens-input">Máximo de Tokens</Label>
            <Input
              id="llm-max-tokens-input"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="Ej: 1000"
            />
          </div>
          <Button onClick={handleSubmit}>Guardar Configuración</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};