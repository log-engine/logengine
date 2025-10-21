/**
 * Basic usage example
 *
 * This example shows the simplest way to use LogEngine
 */

import { createPlatformLogger } from '@logengine/engine';

async function main() {
  // Create logger instance
  const appLog = createPlatformLogger({
    host: 'localhost:50051',
    apiKey: 'your-api-key'
  });

  try {
    // String messages
    await appLog.info('Application started');

    // Multiple arguments
    await appLog.info('User logged in:', 'user123', 'from IP:', '192.168.1.1');

    // Numbers
    await appLog.debug('Processing item', 42, 'of', 100);

    // Objects
    const user = { id: 1, name: 'John', email: 'john@example.com' };
    await appLog.info('User data:', user);

    // Arrays
    const items = [1, 2, 3, 4, 5];
    await appLog.info('Items:', items);

    // Maps
    const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
    await appLog.info('Config:', map);

    // Sets
    const set = new Set([1, 2, 3, 4, 5]);
    await appLog.info('Unique IDs:', set);

    // Errors
    const error = new Error('Something went wrong');
    await appLog.error('Error occurred:', error);

    // Mixed types
    await appLog.warn('Warning:', { code: 'WARN_001' }, 'Count:', 5, true);

    console.log('✅ Logs sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send logs:', error);
  } finally {
    // Close the connection
    appLog.close();
  }
}

main();
