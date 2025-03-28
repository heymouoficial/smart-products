
import { scrape } from 'llm-scraper';
import { LLMConfig } from './llmService';

export interface ScrapResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  sku?: string;
  description?: string;
  images?: string[];
  stock?: number;
  category?: string;
  attributes?: Record<string, string>;
}

export const scrapWebsite = async (url: string, llmConfig: LLMConfig): Promise<ScrapResult> => {
  try {
    if (!llmConfig?.apiKey) {
      throw new Error('Configuración LLM no disponible');
    }

    const result = await scrape({
      url,
      llm: {
        apiKey: llmConfig.apiKey,
        provider: llmConfig.provider,
        model: llmConfig.model,
        maxTokens: llmConfig.maxTokens
      },
      schema: {
        products: [{
          name: 'string',
          price: 'number',
          currency: 'string',
          sku: 'string?',
          description: 'string?',
          images: 'string[]?',
          stock: 'number?',
          category: 'string?',
          attributes: 'object?'
        }]
      }
    });

    if (!result.products || result.products.length === 0) {
      return {
        success: false,
        message: 'No se encontraron productos',
        error: 'El scraping no encontró datos estructurados'
      };
    }

    return {
      success: true,
      message: `Se encontraron ${result.products.length} productos`,
      data: result.products
    };
  } catch (error) {
    console.error('[Scrap Service] Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido en el scraping',
      error: error instanceof Error ? error.stack : undefined
    };
  }
};

// Función para normalizar datos del scraper
export const normalizeScrapData = (data: any): Product[] => {
  return data.map((item: any) => ({
    id: item.id || Math.random().toString(36).substring(2, 10),
    name: item.name,
    price: item.price,
    currency: item.currency || 'USD',
    sku: item.sku,
    description: item.description,
    images: item.images || [],
    stock: item.stock,
    category: item.category,
    attributes: item.attributes || {}
  }));
};

// Adaptador para WooCommerce
export const adaptToWooCommerce = (products: Product[]) => {
  return products.map(product => ({
    name: product.name,
    type: 'simple',
    regular_price: product.price.toFixed(2),
    description: product.description,
    short_description: product.description?.substring(0, 100) + '...',
    categories: product.category ? [{ name: product.category }] : [],
    images: product.images?.map(src => ({ src })),
    attributes: Object.entries(product.attributes).map(([name, value]) => ({
      name,
      options: [value]
    })),
    sku: product.sku,
    stock_quantity: product.stock
  }));
};

export default {
  scrapWebsite,
  mapToWooCommerceFormat
};
