/**
 * Log levels supported by LogEngine
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Configuration options for LogEngine client
 */
export interface LogEngineConfig {
  /**
   * gRPC server URI (host or host:port)
   *
   * Examples:
   * - "grpc.logengine.io" - Remote server without port (SSL enabled)
   * - "grpc.logengine.io:50051" - Remote server with port (SSL disabled)
   * - "localhost:50051" - Local server (SSL disabled)
   * - "localhost" - Local server without port (SSL disabled)
   *
   * Note: SSL/TLS is automatically disabled when:
   * - Host contains 'localhost'
   * - Port is specified (contains ':')
   * Otherwise, SSL is enabled
   */
  host: string;

  /**
   * API key for authentication
   */
  apiKey: string;
}

/**
 * Log message structure
 */
export interface LogMessage {
  /**
   * Log level
   */
  level: LogLevel | string;

  /**
   * Log message content
   */
  message: string;

  /**
   * Timestamp (ISO 8601 format)
   * @default new Date().toISOString()
   */
  timestamp?: string;

  /**
   * Process ID
   * @default process.pid
   */
  pid?: string;

  /**
   * Hostname
   * @default os.hostname()
   */
  hostname?: string;

  /**
   * Application ID
   * @default from config or "default-app"
   */
  appId?: string;
}

/**
 * Response from LogEngine server
 */
export interface LogResponse {
  code: string;
  message: string;
  status: number;
}

/**
 * Logger interface with convenience methods
 */
export interface Logger {
  /**
   * Send a debug log
   * Accepts any number of arguments of any type
   */
  debug(...args: any[]): Promise<LogResponse>;

  /**
   * Send an info log
   * Accepts any number of arguments of any type
   */
  info(...args: any[]): Promise<LogResponse>;

  /**
   * Send a warning log
   * Accepts any number of arguments of any type
   */
  warn(...args: any[]): Promise<LogResponse>;

  /**
   * Send an error log
   * Accepts any number of arguments of any type
   */
  error(...args: any[]): Promise<LogResponse>;

  /**
   * Send a fatal log
   * Accepts any number of arguments of any type
   */
  fatal(...args: any[]): Promise<LogResponse>;

  /**
   * Close the gRPC connection
   */
  close(): void;
}
