/**
 * @logengine/engine
 *
 * Official Node.js SDK for LogEngine - High-performance log management with gRPC
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
 * await logger.info('Application started');
 * await logger.error('Something went wrong');
 * ```
 *
 * @packageDocumentation
 */

export { createPlatformLogger, LogEngineClient } from './client';
export {
  LogEngineConfig,
  Logger,
  LogLevel,
  LogMessage,
  LogResponse,
} from './types';
