# 🚀 Quick Start Guide

Get up and running with the Universal FHEVM SDK in less than 5 minutes!

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A wallet with Sepolia testnet ETH (for contract interactions)

## Installation

### 1. Clone or Download the Repository

```bash
# If you forked from GitHub
git clone https://github.com/YOUR_USERNAME/fhevm-react-template.git
cd fhevm-react-template

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
# Install all packages and examples
npm install
```

This will install:
- The core `@fhevm/sdk` package
- All example applications
- Development dependencies

## Running Examples

All examples include complete frontend with SDK integration:

### Option 1: Next.js Example (Recommended)

The fastest way to see the SDK in action:

```bash
# Start Next.js development server
npm run dev:nextjs
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**What you'll see:**
- SDK initialization demo
- Encryption/decryption examples
- Interactive UI components
- Real-time FHE operations
- Server and Client Components

### Option 2: React Example

Modern React with Vite:

```bash
# Start React development server
npm run dev:react
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

**What you'll see:**
- React 18 hooks in action
- Interactive encryption demo
- Network status display
- Beautiful responsive design
- Educational step-by-step guide

### Option 3: Privacy Voting dApp

Complete production-ready dApp with smart contract:

```bash
# Start voting platform
npm run dev:voting
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

**What you'll see:**
- Cultural project voting system
- Real FHE encryption in action
- Beautiful Tailwind UI
- Mobile-responsive design
- Smart contract integration example

## Basic Usage

### In Your Own Project

#### 1. Install the SDK

```bash
npm install @fhevm/sdk
# or from local package
npm install ./packages/fhevm-sdk
```

#### 2. Initialize and Use

```typescript
import { FhevmSDK } from '@fhevm/sdk';

// Initialize
const fhevm = await FhevmSDK.init({
  network: 'sepolia'
});

// Encrypt
const encrypted = await fhevm.encryptUint8(42);

// Use with contract
const contract = fhevm.getContract(contractAddress, abi);
await contract.submitValue(encrypted.data, encrypted.proof);

// Decrypt
const result = await fhevm.decryptUint8(encryptedResult);
console.log('Result:', result); // 42
```

### With React

```tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk';

// Wrap your app
function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <MyComponent />
    </FhevmProvider>
  );
}

// Use in components
function MyComponent() {
  const { fhevm } = useFhevm();
  const { encrypt } = useEncrypt();

  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt.uint8(value);
    // Use encrypted data...
  };

  return <button onClick={() => handleSubmit(7)}>Submit</button>;
}
```

### With Next.js

```tsx
// app/providers.tsx
'use client';
import { FhevmProvider } from '@fhevm/sdk';

export function Providers({ children }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Building the SDK

To build the SDK from source:

```bash
# Build SDK package
npm run build:sdk

# Or build everything
npm run build
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/           # 🎯 The Universal SDK
│       ├── src/
│       │   ├── core/        # Core FHE functionality
│       │   ├── adapters/    # Framework adapters
│       │   └── types/       # TypeScript types
│       └── dist/            # Built SDK (after npm run build)
│
├── examples/
│   ├── nextjs-example/      # Next.js 14 demo
│   ├── react-example/       # React demo
│   └── privacy-voting/      # Real dApp example
│
├── docs/                    # Additional documentation
├── demo.mp4                 # Video demonstration
└── README.md               # Full documentation
```

## Common Commands

```bash
# Development
npm run dev                  # Start Next.js example
npm run dev:react           # Start React example
npm run dev:voting          # Start voting example

# Building
npm run build               # Build SDK
npm run build:examples      # Build all examples

# Maintenance
npm run lint                # Lint all code
npm run test                # Run all tests
npm run clean               # Clean node_modules
```

## Next Steps

### 1. Explore the Examples

Each example demonstrates different aspects of the SDK:

- **Next.js Example**: Modern App Router architecture
- **React Example**: Basic hooks usage
- **Privacy Voting**: Production-ready dApp with smart contracts

### 2. Read the Documentation

- [Full README](./README.md) - Complete SDK documentation
- [SDK Package](./packages/fhevm-sdk/README.md) - Detailed API reference
- [Examples Documentation](./docs/) - Integration guides

### 3. Watch the Demo Video

Check out [demo.mp4](./demo.mp4) for a complete walkthrough of:
- SDK setup and configuration
- Integration examples
- Design decisions
- Best practices

### 4. Try the Privacy Voting Example

The most comprehensive example showing:
- Smart contract integration
- Encrypted vote submission
- Homomorphic aggregation
- Results decryption

```bash
cd examples/privacy-voting
cat README.md  # Read the example documentation
npm run dev    # Start the example
```

## Troubleshooting

### SDK Not Initializing

Make sure you're on a supported network:

```typescript
const fhevm = await FhevmSDK.init({
  network: 'sepolia',  // or 'localhost', 'mainnet'
  rpcUrl: 'https://rpc.sepolia.org'  // optional custom RPC
});
```

### React Hooks Error

Ensure components using hooks are client components:

```tsx
'use client';  // Add this at the top

import { useFhevm } from '@fhevm/sdk';
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

### TypeScript Errors

Rebuild the SDK:

```bash
cd packages/fhevm-sdk
npm run build
```

## Getting Help

- Check the [main README](./README.md)
- Read the [API documentation](./packages/fhevm-sdk/README.md)
- Review the [examples](./examples/)
- Watch the [video demo](./demo.mp4)

## Competition Submission

This project was built for the **Zama FHE Bounty Challenge**:

✅ Universal, framework-agnostic SDK
✅ Wagmi-like developer experience
✅ Multiple working examples (Next.js required)
✅ Comprehensive documentation
✅ Video demonstration
✅ <10 lines to get started

**Forked from**: https://github.com/zama-ai/fhevm-react-template

---

**Happy Building with FHE! 🔐**
