/**
 * Express.js integration example
 *
 * This example shows how to integrate LogEngine with Express.js
 *
 * Install dependencies:
 * npm install express @types/express
 */

import express, { Request, Response, NextFunction } from 'express';
import { createPlatformLogger } from '@logengine/engine';

const app = express();
const PORT = 3000;

// Create logger instance
const logger = createPlatformLogger({
  host: process.env.LOGENGINE_HOST || 'localhost:50051',
  apiKey: process.env.LOGENGINE_API_KEY || 'your-api-key'
});

// Middleware to parse JSON
app.use(express.json());

// Request logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log when response is finished
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await logger.info(
      `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
});

// Routes
app.get('/', async (req: Request, res: Response) => {
  await logger.info('Homepage accessed');
  res.json({ message: 'Hello from LogEngine!' });
});

app.post('/users', async (req: Request, res: Response) => {
  await logger.info(`Creating user: ${JSON.stringify(req.body)}`);
  res.status(201).json({ id: 1, ...req.body });
});

app.get('/error', async (req: Request, res: Response) => {
  const error = new Error('Intentional error for testing');
  await logger.error(error);
  res.status(500).json({ error: 'Something went wrong' });
});

// Error handling middleware
app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  await logger.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, async () => {
  await logger.info(`Server started on port ${PORT}`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('📊 Logs are being sent to LogEngine');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await logger.info('Server shutting down...');
  logger.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await logger.info('Server interrupted');
  logger.close();
  process.exit(0);
});
