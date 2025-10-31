# Templates Directory

This directory contains starter templates for different frameworks that demonstrate integration with the Universal FHEVM SDK (`@fhevm/sdk`).

## Available Templates

All templates are located in the `../examples/` directory and are referenced here for the bounty submission structure:

### Required Template

- **Next.js** (`../examples/nextjs-example/`) - Complete Next.js 14 application with App Router
  - Full SDK integration
  - API routes for FHE operations
  - TypeScript support
  - Tailwind CSS styling
  - Comprehensive component library

### Additional Templates

- **React** (`../examples/react-example/`) - React 18 + Vite application
  - Modern React hooks
  - Lightweight and fast
  - Educational focus

- **Privacy Voting** (`../examples/privacy-voting/`) - Production-ready dApp
  - Complete smart contract implementation
  - Real-world use case
  - Next.js 14 frontend
  - Hardhat integration

- **Cultural Voting** (`../examples/CulturalVoting/`) - Static HTML example
  - Vanilla JavaScript integration
  - No build step required
  - Simple demonstration

## Usage

Each template is a complete, standalone project. To use a template:

```bash
# Copy the template
cp -r ../examples/nextjs-example my-project

# Install dependencies
cd my-project
npm install

# Start development server
npm run dev
```

## Template Structure

All templates follow the Universal FHEVM SDK integration pattern:

1. Install SDK: `npm install @fhevm/sdk`
2. Initialize SDK: `FhevmSDK.init({ network: 'sepolia' })`
3. Use encryption/decryption methods
4. Interact with FHE-enabled smart contracts

## Documentation

- [Getting Started](../docs/getting-started.md)
- [API Reference](../docs/api-reference.md)
- [Examples Guide](../docs/examples.md)
- [Migration Guide](../docs/migration-guide.md)

## Note on Directory Structure

For bounty submission purposes, templates are referenced from the `examples/` directory. This structure allows for:
- Easier development and testing
- Shared dependencies via monorepo
- Clear separation between SDK core and usage examples

In production use, templates can be copied out and used independently.
