# @logengine/engine

Official Node.js SDK for [LogEngine](https://logengine.io) - High-performance centralized logging with gRPC, RabbitMQ, and PostgreSQL.

[![npm version](https://badge.fury.io/js/@logengine%2Fengine.svg)](https://www.npmjs.com/package/@logengine/engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **High Performance** - Built on gRPC for fast, reliable communication
- 🔒 **Secure** - API key authentication with automatic TLS/SSL
- 📦 **Simple API** - Start logging in 3 lines of code
- 🎯 **Flexible** - Log any type: strings, numbers, objects, arrays, Maps, Sets, Errors, etc.
- ⚡ **Async Processing** - RabbitMQ queue for reliable log delivery
- 🔍 **Auto-Serialization** - Automatically converts any data type to readable format

## Installation

```bash
npm install @logengine/engine
```

## Quick Start

```typescript
import { createPlatformLogger } from '@logengine/engine';

const appLog = createPlatformLogger({
  host: 'grpc.logengine.io:50051',  // SSL disabled (port specified)
  apiKey: 'your-api-key'
});

await appLog.info('Hello from LogEngine!');
```

Or with SSL enabled:

```typescript
const appLog = createPlatformLogger({
  host: 'grpc.logengine.io',  // SSL enabled (no port)
  apiKey: 'your-api-key'
});
```

That's it! Your logs are now being sent to LogEngine.

## Configuration

### Basic (and Only) Configuration

```typescript
const appLog = createPlatformLogger({
  host: 'grpc.logengine.io:50051',  // Required: gRPC server URI (host:port)
  apiKey: 'your-api-key',           // Required: API key for authentication
});
```

**Host examples:**
- `'grpc.logengine.io'` - Remote server without port (SSL enabled)
- `'grpc.logengine.io:50051'` - Remote server with port (SSL disabled)
- `'localhost:50051'` - Local development (SSL disabled)
- `'localhost'` - Local without port (SSL disabled)

**SSL/TLS Logic:**
- SSL is **disabled** when: host contains `localhost` OR port is specified (contains `:`)
- SSL is **enabled** otherwise (remote host without port)

## Usage

### Log Levels

LogEngine supports five log levels:

```typescript
await appLog.debug('Debugging information');
await appLog.info('Informational message');
await appLog.warn('Warning message');
await appLog.error('Error occurred');
await appLog.fatal('Fatal error - application crash');
```

### Log Any Type of Data

The magic of LogEngine is that you can log **anything**:

```typescript
// Strings
await appLog.info('Simple message');
await appLog.info('User', 'logged in', 'successfully');

// Numbers
await appLog.info('Processing item', 42, 'of', 100);
await appLog.debug('Price:', 19.99);

// Objects
const user = { id: 1, name: 'John', email: 'john@example.com' };
await appLog.info('User data:', user);

// Arrays
await appLog.info('Items:', [1, 2, 3, 4, 5]);

// Maps
const config = new Map([['key', 'value']]);
await appLog.info('Config:', config);

// Sets
const ids = new Set([1, 2, 3]);
await appLog.info('Unique IDs:', ids);

// Errors (with stack traces)
const error = new Error('Something went wrong');
await appLog.error('Error occurred:', error);

// Dates
await appLog.info('Event at:', new Date());

// Mixed types
await appLog.info('Request:', { userId: 123 }, 'took', 250, 'ms', true);
```

### Automatic Serialization

LogEngine automatically serializes all data types:

| Type | How it's logged |
|------|----------------|
| String | As is |
| Number | Converted to string |
| Boolean | `true` or `false` |
| Object | Pretty-printed JSON |
| Array | Pretty-printed JSON |
| Map | Node.js inspect format |
| Set | Node.js inspect format |
| Error | `ErrorName: message\nstack trace` |
| Date | ISO 8601 string |
| null | `"null"` |
| undefined | `"undefined"` |

### Closing the Connection

When your application shuts down:

```typescript
appLog.close();
```

Or use graceful shutdown:

```typescript
process.on('SIGTERM', () => {
  appLog.close();
  process.exit(0);
});
```

## Examples

### Express.js Middleware

```typescript
import express from 'express';
import { createPlatformLogger } from '@logengine/engine';

const app = express();
const appLog = createPlatformLogger({
  host: 'grpc.logengine.io:50051',
  apiKey: process.env.LOGENGINE_API_KEY!
});

// Log all requests
app.use((req, res, next) => {
  appLog.info(req.method, req.path);
  next();
});

// Log with objects
app.post('/users', (req, res) => {
  appLog.info('Creating user:', req.body);
  res.status(201).json({ success: true });
});

// Error handling
app.use((err, req, res, next) => {
  appLog.error('Request failed:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
  appLog.info('Server started on port', 3000);
});
```

### NestJS Integration

```typescript
import { Injectable } from '@nestjs/common';
import { createPlatformLogger, Logger } from '@logengine/engine';

@Injectable()
export class AppService {
  private appLog: Logger;

  constructor() {
    this.appLog = createPlatformLogger({
      host: process.env.LOGENGINE_HOST!,
      apiKey: process.env.LOGENGINE_API_KEY!
    });
  }

  async getUsers() {
    await this.appLog.info('Fetching users');
    const users = await this.userRepository.find();
    await this.appLog.info('Found', users.length, 'users');
    return users;
  }

  onModuleDestroy() {
    this.appLog.close();
  }
}
```

### Next.js API Route

```typescript
import { createPlatformLogger } from '@logengine/engine';
import type { NextApiRequest, NextApiResponse } from 'next';

const appLog = createPlatformLogger({
  host: process.env.LOGENGINE_HOST!,
  apiKey: process.env.LOGENGINE_API_KEY!
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await appLog.info('API called:', req.url, 'method:', req.method);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    await appLog.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

### Background Worker

```typescript
import { createPlatformLogger } from '@logengine/engine';

const appLog = createPlatformLogger({
  host: 'grpc.logengine.io:50051',
  apiKey: process.env.LOGENGINE_API_KEY!
});

async function processJob(job: any) {
  await appLog.info('Processing job:', job.id, 'type:', job.type);

  try {
    // Process the job
    const result = await doWork(job);
    await appLog.info('Job completed:', { jobId: job.id, result });
  } catch (error) {
    await appLog.error('Job failed:', job.id, error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  appLog.info('Worker shutting down');
  appLog.close();
  process.exit(0);
});
```

## Self-Hosting

If you're self-hosting LogEngine locally:

```typescript
const appLog = createPlatformLogger({
  host: 'localhost:50051',  // SSL disabled (localhost)
  apiKey: 'your-api-key'
});
```

For production self-hosted instances with your own domain:

```typescript
// With SSL disabled (port specified)
const appLog = createPlatformLogger({
  host: 'logs.yourdomain.com:50051',
  apiKey: 'your-api-key'
});

// With SSL enabled (no port specified)
const appLog = createPlatformLogger({
  host: 'logs.yourdomain.com',
  apiKey: 'your-api-key'
});
```

Remember: SSL is disabled when port is specified or host contains `localhost`.

See the [LogEngine documentation](https://github.com/log-engine/logengine) for self-hosting instructions.

## TypeScript Support

Full TypeScript support included:

```typescript
import {
  createPlatformLogger,
  LogEngineConfig,
  Logger,
  LogResponse
} from '@logengine/engine';

// With SSL disabled (port specified)
const config: LogEngineConfig = {
  host: 'grpc.logengine.io:50051',
  apiKey: 'your-api-key'
};

// Or with SSL enabled (no port)
const configSecure: LogEngineConfig = {
  host: 'grpc.logengine.io',
  apiKey: 'your-api-key'
};

const appLog: Logger = createPlatformLogger(config);

const response: LogResponse = await appLog.info('Typed logging!');
```

## API Reference

### `createPlatformLogger(config: LogEngineConfig): Logger`

Creates a new LogEngine logger instance.

#### Configuration

```typescript
interface LogEngineConfig {
  host: string;    // gRPC server URI (host or host:port)
  apiKey: string;  // API key for authentication
}
```

**Examples:**
- `{ host: 'grpc.logengine.io', apiKey: 'key' }` - Production cloud (SSL enabled)
- `{ host: 'grpc.logengine.io:50051', apiKey: 'key' }` - With port (SSL disabled)
- `{ host: 'localhost:50051', apiKey: 'key' }` - Local development (SSL disabled)
- `{ host: 'localhost', apiKey: 'key' }` - Local without port (SSL disabled)

**SSL Logic:** Disabled when host contains `localhost` OR port specified (`:`), enabled otherwise

#### Logger Methods

All methods accept any number of arguments of any type:

```typescript
interface Logger {
  debug(...args: any[]): Promise<LogResponse>;
  info(...args: any[]): Promise<LogResponse>;
  warn(...args: any[]): Promise<LogResponse>;
  error(...args: any[]): Promise<LogResponse>;
  fatal(...args: any[]): Promise<LogResponse>;
  close(): void;
}
```

#### Response

```typescript
interface LogResponse {
  code: string;    // Response code
  message: string; // Response message
  status: number;  // HTTP-like status code
}
```

## Performance

LogEngine is designed for high performance:

- **Async by default** - All logging operations are non-blocking
- **Binary protocol** - Efficient serialization with Protocol Buffers
- **Connection pooling** - Reuses gRPC connections
- **Queue-based** - RabbitMQ handles spikes in log volume
- **Auto-retry** - Failed logs are retried automatically

## Requirements

- Node.js >= 18.0.0
- Network access to LogEngine server

## Examples

See the [examples directory](./examples) for more examples:

- [basic.ts](./examples/basic.ts) - Basic usage with all data types
- [flexible-logging.ts](./examples/flexible-logging.ts) - Advanced serialization examples
- [express.ts](./examples/express.ts) - Express.js integration
- [error-handling.ts](./examples/error-handling.ts) - Error logging patterns

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT © [LogEngine Team](https://logengine.io)

## Links

- [Homepage](https://logengine.io)
- [Documentation](https://github.com/log-engine/logengine)
- [GitHub Repository](https://github.com/log-engine/logengine)
- [Issue Tracker](https://github.com/log-engine/logengine/issues)
- [NPM Package](https://www.npmjs.com/package/@logengine/engine)

## Support

- GitHub Issues: [Report a bug](https://github.com/log-engine/logengine/issues)
- Email: support@logengine.io
- Website: https://logengine.io
