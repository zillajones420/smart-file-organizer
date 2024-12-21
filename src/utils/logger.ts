enum LogLevel {
     DEBUG = 'DEBUG',
     INFO = 'INFO',
     WARN = 'WARN',
     ERROR = 'ERROR'
}

class Logger {
     private static instance: Logger;
     private readonly logLevel: LogLevel;

     private constructor() {
          this.logLevel = LogLevel.INFO; // Default log level
     }

     public static getInstance(): Logger {
          if (!Logger.instance) {
               Logger.instance = new Logger();
          }
          return Logger.instance;
     }

     public debug(message: string, ...args: any[]): void {
          this.log(LogLevel.DEBUG, message, ...args);
     }

     public info(message: string, ...args: any[]): void {
          this.log(LogLevel.INFO, message, ...args);
     }

     public warn(message: string, ...args: any[]): void {
          this.log(LogLevel.WARN, message, ...args);
     }

     public error(message: string, ...args: any[]): void {
          this.log(LogLevel.ERROR, message, ...args);
     }

     private log(level: LogLevel, message: string, ...args: any[]): void {
          const timestamp = new Date().toISOString();
          console.log(`[${timestamp}] ${level}: ${message}`, ...args);
     }
}

export const logger = Logger.getInstance();