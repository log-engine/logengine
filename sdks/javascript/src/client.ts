import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { LogEngineConfig, Logger, LogLevel, LogResponse } from './types';

/**
 * LogEngine client implementation
 */
export class LogEngineClient implements Logger {
  #client: any;
  #host: string;
  #apiKey: string;
  #metadata: grpc.Metadata;

  constructor(config: LogEngineConfig) {
    this.#host = config.host;
    this.#apiKey = config.apiKey;

    // Initialize metadata
    this.#metadata = new grpc.Metadata();
    this.#metadata.add('x-api-key', this.#apiKey);

    // Load proto file
    const PROTO_PATH = path.join(__dirname, '../proto/logger.proto');
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition) as any;

    // Determine if SSL should be used (disable for localhost or when port is specified)
    const isInSecure = this.#host.toLowerCase().includes('localhost') || this.#host.includes(":");
    const credentials = isInSecure
      ? grpc.credentials.createInsecure()
      : grpc.credentials.createSsl();

    this.#client = new proto.logengine_grpc.Logger(this.#host, credentials);
  }

  /**
   * Serialize any value to a string
   */
  #serialize(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';

    // Handle Error objects
    if (value instanceof Error) {
      return `${value.name}: ${value.message}\n${value.stack}`;
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle Map
    if (value instanceof Map) {
      return util.inspect(value, { depth: null, colors: false });
    }

    // Handle Set
    if (value instanceof Set) {
      return util.inspect(value, { depth: null, colors: false });
    }

    // Handle primitive types
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'bigint') return String(value);
    if (typeof value === 'symbol') return String(value);

    // Handle objects and arrays
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      // Fallback for circular references
      return util.inspect(value, { depth: null, colors: false });
    }
  }

  /**
   * Format multiple arguments into a single message
   */
  #formatMessage(...args: any[]): string {
    if (args.length === 0) return '';
    if (args.length === 1) return this.#serialize(args[0]);

    return args.map((arg) => this.#serialize(arg)).join(' ');
  }

  /**
   * Send a log message to LogEngine
   */
  async #sendLog(level: LogLevel, ...args: any[]): Promise<LogResponse> {
    const message = this.#formatMessage(...args);

    return new Promise((resolve, reject) => {
      const deadline = new Date();
      deadline.setMilliseconds(deadline.getMilliseconds() + 5000); // 5s timeout

      this.#client.addLog(
        {
          level,
          appId: this.#apiKey,
          message,
          pid: String(process.pid),
          ts: String(Date.now()),
          hostname: os.hostname(),
        },
        this.#metadata,
        { deadline },
        (error: grpc.ServiceError | null, response: LogResponse) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  /**
   * Send a debug log
   */
  async debug(...args: any[]): Promise<LogResponse> {
    return this.#sendLog(LogLevel.DEBUG, ...args);
  }

  /**
   * Send an info log
   */
  async info(...args: any[]): Promise<LogResponse> {
    return this.#sendLog(LogLevel.INFO, ...args);
  }

  /**
   * Send a warning log
   */
  async warn(...args: any[]): Promise<LogResponse> {
    return this.#sendLog(LogLevel.WARN, ...args);
  }

  /**
   * Send an error log
   */
  async error(...args: any[]): Promise<LogResponse> {
    return this.#sendLog(LogLevel.ERROR, ...args);
  }

  /**
   * Send a fatal log
   */
  async fatal(...args: any[]): Promise<LogResponse> {
    return this.#sendLog(LogLevel.FATAL, ...args);
  }

  /**
   * Close the gRPC connection
   */
  close(): void {
    if (this.#client) {
      this.#client.close();
    }
  }
}

/**
 * Create a new LogEngine logger instance
 *
 * @example
 * ```typescript
 * import { createPlatformLogger } from '@logengine/engine';
 *
 * const logger = createPlatformLogger({
 *   host: 'grpc.logengine.io',
 *   apiKey: 'your-api-key'
 * });
 *
 * await logger.info('Hello from LogEngine!');
 * ```
 */
export function createPlatformLogger(config: LogEngineConfig): Logger {
  return new LogEngineClient(config);
}
