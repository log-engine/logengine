/**
 * Error handling example
 *
 * This example demonstrates various ways to log errors with LogEngine
 */

import { createPlatformLogger } from '@logengine/engine';

const logger = createPlatformLogger({
  host: 'localhost:50051',
  apiKey: 'your-api-key'
});

async function demonstrateErrorLogging() {
  console.log('📝 Demonstrating error logging...\n');

  // 1. Simple error string
  console.log('1️⃣ Logging simple error string:');
  await logger.error('Something went wrong');

  // 2. Error object with stack trace
  console.log('2️⃣ Logging Error object with stack trace:');
  const error = new Error('Database connection failed');
  await logger.error(error);

  // 3. Try-catch block
  console.log('3️⃣ Logging from try-catch block:');
  try {
    throw new Error('Invalid input data');
  } catch (err) {
    await logger.error(err as Error);
  }

  // 4. Custom error class
  console.log('4️⃣ Logging custom error class:');
  class ValidationError extends Error {
    constructor(message: string, public field: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }

  const validationError = new ValidationError('Email is required', 'email');
  await logger.error(validationError);

  // 5. Async error handling
  console.log('5️⃣ Logging async errors:');
  async function riskyOperation() {
    throw new Error('Async operation failed');
  }

  try {
    await riskyOperation();
  } catch (err) {
    await logger.error(err as Error);
  }

  // 6. Fatal errors (critical)
  console.log('6️⃣ Logging fatal error:');
  await logger.fatal('Critical system failure - shutting down');

  // 7. Promise rejection
  console.log('7️⃣ Logging promise rejection:');
  Promise.reject(new Error('Promise was rejected'))
    .catch(async (err) => {
      await logger.error(err);
    });

  console.log('\n✅ Error logging demonstration completed!');
}

// Global unhandled rejection handler
process.on('unhandledRejection', async (reason, promise) => {
  await logger.fatal(`Unhandled Rejection: ${reason}`);
  logger.close();
  process.exit(1);
});

// Global uncaught exception handler
process.on('uncaughtException', async (error) => {
  await logger.fatal(`Uncaught Exception: ${error.message}`);
  logger.close();
  process.exit(1);
});

// Run the demonstration
demonstrateErrorLogging()
  .then(() => {
    setTimeout(() => {
      logger.close();
      process.exit(0);
    }, 1000);
  })
  .catch(async (err) => {
    console.error('Demo failed:', err);
    await logger.error(err);
    logger.close();
    process.exit(1);
  });
