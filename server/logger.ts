/**
 * Structured logging utility for serverless environment
 * Outputs JSON logs that can be easily parsed by monitoring tools
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogData {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: any;
}

class Logger {
  private env: string;

  constructor() {
    this.env = process.env.NODE_ENV || 'development';
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>) {
    const logData: LogData = {
      level,
      message,
      timestamp: new Date().toISOString(),
      env: this.env,
      ...meta,
    };

    // In production, output structured JSON for log aggregators
    if (this.env === 'production') {
      console.log(JSON.stringify(logData));
    } else {
      // In development, output readable format
      const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
      console.log(`[${level.toUpperCase()}] ${message}${metaStr}`);
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    if (this.env !== 'production') {
      this.log('debug', message, meta);
    }
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | any, meta?: Record<string, any>) {
    const errorMeta = error instanceof Error
      ? {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          ...meta,
        }
      : { error, ...meta };

    this.log('error', message, errorMeta);
  }
}

export const logger = new Logger();
