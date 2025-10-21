# LogEngine Node.js SDK Examples

This directory contains examples demonstrating how to use the LogEngine Node.js SDK in various scenarios.

## Running the Examples

First, make sure you have LogEngine server running (see main [README](../../../README.md) for setup instructions).

Then install dependencies:

```bash
cd sdks/javascript
npm install
npm run build
```

### Basic Example

The simplest way to use LogEngine:

```bash
npx ts-node examples/basic.ts
```

### Express.js Integration

Shows how to integrate LogEngine with Express.js web server:

```bash
# Install Express
npm install express @types/express

# Run the example
npx ts-node examples/express.ts

# Test the endpoints
curl http://localhost:3000
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"John"}'
curl http://localhost:3000/error
```

### Error Handling

Demonstrates various error logging patterns:

```bash
npx ts-node examples/error-handling.ts
```

## Environment Variables

You can configure the examples using environment variables:

```bash
export LOGENGINE_HOST=grpc.logengine.io
export LOGENGINE_API_KEY=your-api-key

npx ts-node examples/basic.ts
```

Or create a `.env` file:

```env
LOGENGINE_HOST=localhost
LOGENGINE_API_KEY=your-api-key
```

## Next Steps

- Check out the main [SDK documentation](../README.md)
- Read the [LogEngine documentation](../../../README.md)
- Explore the [API reference](../README.md#api-reference)

## Support

If you have questions or run into issues:

- GitHub Issues: [Report a bug](https://github.com/log-engine/logengine/issues)
- Email: support@logengine.io
