import { format } from 'date-fns';
import { supabase } from './supabaseClient';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type LogCategory = 'system' | 'auth' | 'sync' | 'api' | 'scraping' | 'llm';

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  stack?: string;
  category?: LogCategory;
  user_id?: string;
  provider_id?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxMemoryLogs: number = 100;
  private persistLogs: boolean = true;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private async log(level: LogLevel, message: string, options?: {
    context?: string;
    error?: Error;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
  }) {
    const { context, error, category = 'system', user_id, provider_id } = options || {};
    
    const entry: LogEntry = {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      level,
      message,
      context,
      stack: error?.stack,
      category,
      user_id,
      provider_id
    };

    // Guardar en memoria
    this.logs.push(entry);
    console[level](`[${entry.timestamp}] [${level.toUpperCase()}] [${category}] ${message}`, context || '');

    // Limitar logs en memoria
    if (this.logs.length > this.maxMemoryLogs) {
      this.logs.shift();
    }

    // Persistir en Supabase si está habilitado
    if (this.persistLogs) {
      try {
        const { error: insertError } = await supabase
          .from('logs')
          .insert(entry);

        if (insertError) {
          console.error('Error al guardar log en Supabase:', insertError);
        }
      } catch (err) {
        console.error('Error al persistir log:', err);
      }
    }
  }

  public info(message: string, options?: {
    context?: string;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
  }) {
    this.log('info', message, options);
  }

  public warn(message: string, options?: {
    context?: string;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
  }) {
    this.log('warn', message, options);
  }

  public error(message: string, options?: {
    context?: string;
    error?: Error;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
  }) {
    this.log('error', message, options);
  }

  public debug(message: string, options?: {
    context?: string;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
  }) {
    this.log('debug', message, options);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public async getPersistedLogs(options?: {
    limit?: number;
    level?: LogLevel;
    category?: LogCategory;
    user_id?: string;
    provider_id?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<LogEntry[]> {
    const {
      limit = 100,
      level,
      category,
      user_id,
      provider_id,
      from_date,
      to_date
    } = options || {};

    try {
      let query = supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (level) query = query.eq('level', level);
      if (category) query = query.eq('category', category);
      if (user_id) query = query.eq('user_id', user_id);
      if (provider_id) query = query.eq('provider_id', provider_id);
      if (from_date) query = query.gte('timestamp', from_date);
      if (to_date) query = query.lte('timestamp', to_date);

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener logs de Supabase:', error);
        return [];
      }

      return data as LogEntry[];
    } catch (err) {
      console.error('Error al consultar logs:', err);
      return [];
    }
  }

  public setPersistence(enabled: boolean): void {
    this.persistLogs = enabled;
  }

  public setMaxMemoryLogs(max: number): void {
    this.maxMemoryLogs = max;
  }
}

export const logger = Logger.getInstance();