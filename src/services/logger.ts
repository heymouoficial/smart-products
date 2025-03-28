import { format } from 'date-fns';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  stack?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: string, error?: Error) {
    const entry: LogEntry = {
      timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      level,
      message,
      context,
      stack: error?.stack
    };

    this.logs.push(entry);
    console[level](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, context || '');

    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  public info(message: string, context?: string) {
    this.log('info', message, context);
  }

  public warn(message: string, context?: string) {
    this.log('warn', message, context);
  }

  public error(message: string, context?: string, error?: Error) {
    this.log('error', message, context, error);
  }

  public debug(message: string, context?: string) {
    this.log('debug', message, context);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = Logger.getInstance();