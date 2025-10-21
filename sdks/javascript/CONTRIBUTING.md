# Contributing to LogEngine Node.js SDK

Thank you for your interest in contributing to the LogEngine Node.js SDK!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/log-engine/logengine.git
cd logengine/sdks/javascript
```

2. Install dependencies:
```bash
npm install
```

3. Build the SDK:
```bash
npm run build
```

4. Run in development mode:
```bash
npm run dev
```

## Project Structure

```
sdks/javascript/
├── src/
│   ├── client.ts      # Main client implementation
│   ├── types.ts       # TypeScript type definitions
│   └── index.ts       # Public API exports
├── proto/
│   └── logger.proto   # Protocol Buffers definition
├── examples/          # Usage examples
├── dist/              # Compiled output (generated)
└── package.json
```

## Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes in the `src/` directory

3. Build and test:
```bash
npm run build
```

4. Test with examples:
```bash
npx ts-node examples/basic.ts
```

## Code Style

- Use TypeScript for all new code
- Follow existing code style
- Add JSDoc comments for public APIs
- Use meaningful variable names
- Keep functions small and focused

## Testing

Before submitting a PR:

1. Ensure the code builds without errors:
```bash
npm run build
```

2. Test with the examples:
```bash
npx ts-node examples/basic.ts
npx ts-node examples/express.ts
npx ts-node examples/error-handling.ts
```

3. Update documentation if needed

## Documentation

- Update README.md if you add new features
- Add JSDoc comments for new public APIs
- Create examples for significant new features
- Update CHANGELOG.md

## Submitting Changes

1. Commit your changes:
```bash
git add .
git commit -m "feat: add awesome feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

2. Push to your fork:
```bash
git push origin feature/your-feature-name
```

3. Open a Pull Request on GitHub

## Release Process

(For maintainers only)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes:
```bash
git add .
git commit -m "chore: release v1.x.x"
```
4. Tag the release:
```bash
git tag v1.x.x
git push origin v1.x.x
```
5. Publish to npm:
```bash
npm publish
```

## Need Help?

- GitHub Issues: [Report a bug](https://github.com/log-engine/logengine/issues)
- Email: support@logengine.io

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
