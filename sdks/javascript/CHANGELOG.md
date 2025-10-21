# Changelog

All notable changes to the LogEngine Node.js SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-21

### Added
- Initial release of @logengine/engine
- gRPC client implementation for LogEngine
- TypeScript support with full type definitions
- Convenience methods for all log levels (debug, info, warn, error, fatal)
- Automatic metadata injection (hostname, pid, timestamp)
- API key authentication
- SSL/TLS support
- Connection timeout configuration
- Custom metadata support
- Comprehensive documentation and examples
- Express.js integration example
- Error handling examples

### Features
- `createPlatformLogger()` factory function
- `LogEngineClient` class for advanced usage
- Auto-detection of secure/insecure connections
- Graceful connection cleanup
- Error stack trace formatting

[1.0.0]: https://github.com/log-engine/logengine/releases/tag/v1.0.0
