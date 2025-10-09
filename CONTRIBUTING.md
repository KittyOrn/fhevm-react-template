# Contributing to Universal FHEVM SDK

Thank you for your interest in contributing to the Universal FHEVM SDK! This document provides guidelines and instructions for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project follows a standard Code of Conduct. Please be respectful and constructive in all interactions.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- Basic understanding of TypeScript and React
- Familiarity with Ethereum and smart contracts

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/zama-ai/fhevm-react-template.git
```

## Development Setup

### Install Dependencies

```bash
# Install all dependencies
npm install

# Build SDK package
cd packages/fhevm-sdk
npm run build
cd ../..
```

### Run Examples

```bash
# Next.js example
cd examples/nextjs-example
npm install
npm run dev

# Privacy voting example
cd examples/privacy-voting
npm install
npm test
```

### Development Workflow

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes:
```bash
npm test
npm run lint
```

4. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/              # Core SDK package
│       ├── src/
│       │   ├── core/           # Core SDK logic
│       │   ├── adapters/       # Framework adapters (React, etc.)
│       │   └── types/          # TypeScript types
│       └── README.md
│
├── examples/
│   ├── nextjs-example/         # Next.js integration example
│   ├── privacy-voting/         # Real-world voting example
│   └── react-example/          # React integration example
│
└── docs/                       # Documentation
```

## Making Changes

### Adding New Features

1. **Discuss First**: Open an issue to discuss significant changes
2. **Write Tests**: Add tests for new functionality
3. **Update Documentation**: Update relevant documentation
4. **Follow Style Guide**: Match existing code style

### Bug Fixes

1. **Create Issue**: Report the bug if not already reported
2. **Write Test**: Add a failing test that demonstrates the bug
3. **Fix Bug**: Make the minimal change to fix the issue
4. **Verify Fix**: Ensure the test now passes

### Documentation Updates

- Keep documentation clear and concise
- Include code examples where applicable
- Update both README and inline documentation
- Check for broken links

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

Use Jest for unit tests:

```typescript
import { FhevmSDK } from '../src/core/FhevmSDK';

describe('FhevmSDK', () => {
  it('should initialize successfully', async () => {
    const sdk = await FhevmSDK.init({ network: 'sepolia' });
    expect(sdk).toBeDefined();
  });

  it('should encrypt uint8 values', async () => {
    const sdk = await FhevmSDK.init({ network: 'sepolia' });
    const encrypted = await sdk.encryptUint8(42);
    expect(encrypted.data).toBeDefined();
    expect(encrypted.proof).toBeDefined();
  });
});
```

### Test Coverage Requirements

- Unit tests: Minimum 80% coverage
- Integration tests for all public APIs
- E2E tests for critical user flows

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: Ensure all docs are updated
2. **Add Tests**: Include tests for new features
3. **Run Linter**: Fix all linting errors
4. **Update Changelog**: Add entry to CHANGELOG.md
5. **Create PR**: Submit pull request with clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Changelog updated
```

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address all review comments
4. Maintainer will merge when approved

## Style Guidelines

### TypeScript

```typescript
// Good: Clear types and documentation
/**
 * Encrypt a uint8 value
 * @param value - Value to encrypt (0-255)
 * @returns Encrypted data with proof
 */
async encryptUint8(value: number): Promise<EncryptedData> {
  if (value < 0 || value > 255) {
    throw new Error('Value must be between 0 and 255');
  }
  return this.encrypt(value, 'uint8');
}

// Bad: No types or documentation
async encrypt(value) {
  return this.doEncrypt(value);
}
```

### React Components

```tsx
// Good: Functional component with proper types
interface VoteButtonProps {
  projectId: number;
  score: number;
  onVoteSubmit?: () => void;
}

export function VoteButton({ projectId, score, onVoteSubmit }: VoteButtonProps) {
  const { encrypt, isEncrypting } = useEncrypt();

  const handleVote = async () => {
    const encrypted = await encrypt.uint8(score);
    await submitVote(projectId, encrypted);
    onVoteSubmit?.();
  };

  return (
    <button onClick={handleVote} disabled={isEncrypting}>
      {isEncrypting ? 'Encrypting...' : 'Vote'}
    </button>
  );
}
```

### Naming Conventions

- **Files**: `camelCase.ts` for modules, `PascalCase.tsx` for components
- **Functions**: `camelCase()` for functions and methods
- **Classes**: `PascalCase` for classes
- **Constants**: `UPPER_SNAKE_CASE` for constants
- **Interfaces**: `PascalCase` with descriptive names

### Code Organization

```typescript
// 1. Imports (external, then internal)
import { ethers } from 'ethers';
import { FhevmSDK } from '../core/FhevmSDK';

// 2. Types and interfaces
interface Config {
  network: string;
  rpcUrl?: string;
}

// 3. Constants
const DEFAULT_NETWORK = 'sepolia';

// 4. Main code
export class MyClass {
  // Implementation
}
```

### Documentation

```typescript
/**
 * Brief description of function
 *
 * Detailed description if needed. Explain:
 * - What the function does
 * - When to use it
 * - Any important considerations
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws Description of errors that may be thrown
 *
 * @example
 * ```typescript
 * const result = await myFunction(42);
 * console.log(result);
 * ```
 */
export async function myFunction(paramName: number): Promise<Result> {
  // Implementation
}
```

## Commit Message Guidelines

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good
feat(sdk): add support for uint64 encryption
fix(react): resolve hook dependency issue
docs(readme): update installation instructions

# Bad
update stuff
fixed bug
changes
```

## Release Process

Maintainers handle releases:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Publish to npm: `npm publish`
6. Create GitHub release

## Getting Help

### Resources

- [Documentation](./docs/)
- [API Reference](./packages/fhevm-sdk/README.md)
- [Examples](./examples/)
- [GitHub Issues](https://github.com/zama-ai/fhevm-react-template/issues)
- [Discord Community](https://discord.fhe.org)

### Questions

- Check existing issues first
- Ask in Discord #fhevm-sdk channel
- Create a new issue with "question" label

### Reporting Bugs

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Code sample (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Universal FHEVM SDK! Your help makes confidential computing accessible to everyone.
