
import axios from 'axios';
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

    const response = await axios.post('https://api.deepseek.com/v1/scrape', {
      url,
      config: {
        api_key: llmConfig.apiKey,
        extract_rules: {
          products: {
            listItem: '.product',
            data: {
              name: 'h2',
              price: '.price',
              description: '.description',
              images: ['img@src'],
              stock: '.stock',
              category: '.category',
              attributes: {
                listItem: '.attributes li',
                data: {
                  name: '.attr-name',
                  value: '.attr-value'
                }
              }
            }
          }
        }
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error en la API de DeepSeek');
    }

    return {
      success: true,
      message: `Found ${response.data.data.products.length} products`,
      data: response.data.data.products
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
  adaptToWooCommerce
};
