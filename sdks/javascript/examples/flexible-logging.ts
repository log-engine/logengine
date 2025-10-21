/**
 * Flexible logging example
 *
 * This example demonstrates how LogEngine accepts any type of data
 */

import { createPlatformLogger } from '@logengine/engine';

async function main() {
  const appLog = createPlatformLogger({
    host: 'localhost:50051',
    apiKey: 'your-api-key'
  });

  console.log('📝 Demonstrating flexible logging...\n');

  try {
    // 1. Strings
    console.log('1️⃣ Strings:');
    await appLog.info('Simple string message');
    await appLog.info('Multiple', 'string', 'arguments');

    // 2. Numbers
    console.log('2️⃣ Numbers:');
    await appLog.info('Count:', 42);
    await appLog.info('Price:', 19.99, 'Quantity:', 5);
    await appLog.info('BigInt:', BigInt(9007199254740991));

    // 3. Booleans
    console.log('3️⃣ Booleans:');
    await appLog.info('Is active:', true);
    await appLog.info('Enabled:', false);

    // 4. Objects
    console.log('4️⃣ Objects:');
    const user = {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      roles: ['admin', 'user']
    };
    await appLog.info('User object:', user);

    // 5. Nested objects
    console.log('5️⃣ Nested objects:');
    const config = {
      database: {
        host: 'localhost',
        port: 5432,
        credentials: {
          username: 'admin',
          password: '***'
        }
      },
      features: {
        enabled: true,
        flags: ['feature1', 'feature2']
      }
    };
    await appLog.info('Config:', config);

    // 6. Arrays
    console.log('6️⃣ Arrays:');
    await appLog.info('Numbers:', [1, 2, 3, 4, 5]);
    await appLog.info('Mixed array:', [1, 'two', true, { key: 'value' }]);

    // 7. Maps
    console.log('7️⃣ Maps:');
    const userMap = new Map([
      ['user1', { name: 'Alice', age: 30 }],
      ['user2', { name: 'Bob', age: 25 }]
    ]);
    await appLog.info('User map:', userMap);

    // 8. Sets
    console.log('8️⃣ Sets:');
    const uniqueIds = new Set([1, 2, 3, 4, 5]);
    await appLog.info('Unique IDs:', uniqueIds);

    // 9. Dates
    console.log('9️⃣ Dates:');
    await appLog.info('Current time:', new Date());
    await appLog.info('Event at:', new Date('2025-01-01T00:00:00Z'));

    // 10. Errors
    console.log('🔟 Errors:');
    const error = new Error('Something went wrong');
    error.stack = 'Error: Something went wrong\n    at main (example.ts:10:20)';
    await appLog.error('Error object:', error);

    // 11. Custom Error classes
    console.log('1️⃣1️⃣ Custom Errors:');
    class ValidationError extends Error {
      constructor(message: string, public field: string) {
        super(message);
        this.name = 'ValidationError';
      }
    }
    const validationError = new ValidationError('Invalid email', 'email');
    await appLog.error('Validation failed:', validationError);

    // 12. null and undefined
    console.log('1️⃣2️⃣ Null and undefined:');
    await appLog.warn('Null value:', null);
    await appLog.warn('Undefined value:', undefined);

    // 13. Symbols
    console.log('1️⃣3️⃣ Symbols:');
    const sym = Symbol('mySymbol');
    await appLog.debug('Symbol:', sym);

    // 14. Mixed types in one call
    console.log('1️⃣4️⃣ Mixed types:');
    await appLog.info(
      'Request processed:',
      { userId: 123 },
      'in',
      250,
      'ms',
      'status:',
      true
    );

    // 15. Complex scenario
    console.log('1️⃣5️⃣ Complex scenario:');
    const requestLog = {
      method: 'POST',
      path: '/api/users',
      body: { name: 'Alice', email: 'alice@example.com' },
      headers: new Map([
        ['content-type', 'application/json'],
        ['authorization', 'Bearer ***']
      ]),
      timestamp: new Date(),
      duration: 156,
      success: true
    };
    await appLog.info('API Request:', requestLog);

    console.log('\n✅ All flexible logging examples completed!');
  } catch (error) {
    console.error('❌ Error during logging:', error);
  } finally {
    appLog.close();
  }
}

main();
