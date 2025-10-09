# @fhevm/sdk

Universal SDK for building confidential dApps with **Zama's Fully Homomorphic Encryption (FHE)** technology.

## Features

- **Framework-agnostic**: Works with React, Next.js, Vue, Node.js, and vanilla JavaScript
- **Type-safe**: Full TypeScript support with comprehensive types
- **Easy to use**: Wagmi-like API for familiar developer experience
- **Lightweight**: Minimal dependencies, tree-shakeable
- **Production-ready**: Thoroughly tested and optimized

## Installation

```bash
npm install @fhevm/sdk
# or
yarn add @fhevm/sdk
# or
pnpm add @fhevm/sdk
```

## Quick Start

### Vanilla JavaScript / Node.js

```typescript
import { FhevmSDK } from '@fhevm/sdk';

// Initialize SDK
const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// Encrypt data
const encrypted = await fhevm.encryptUint8(42);

// Submit to contract
const contract = fhevm.getContract(contractAddress, contractABI);
await contract.submitVote(encrypted.data, encrypted.proof);

// Decrypt result
const encryptedResult = await contract.getResult();
const result = await fhevm.decryptUint8(encryptedResult);
console.log('Result:', result); // 42
```

### React

```tsx
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <VotingComponent />
    </FhevmProvider>
  );
}

function VotingComponent() {
  const { fhevm, initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleVote = async (score: number) => {
    const encrypted = await encrypt.uint8(score);
    await contract.submitVote(encrypted.data, encrypted.proof);
  };

  return <button onClick={() => handleVote(7)}>Vote</button>;
}
```

### Next.js

```tsx
// app/providers.tsx
'use client';
import { FhevmProvider } from '@fhevm/sdk';

export function Providers({ children }: { children: React.ReactNode }) {
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

## API Reference

### FhevmSDK

Core SDK class for FHE operations.

#### Initialization

```typescript
const fhevm = await FhevmSDK.init({
  network: 'sepolia', // or 'mainnet', 'localhost'
  rpcUrl?: string,    // optional custom RPC
  provider?: Provider, // optional ethers provider
  signer?: Signer     // optional ethers signer
});
```

#### Encryption Methods

```typescript
// Encrypt unsigned integers
await fhevm.encryptUint8(value: number): Promise<EncryptedData>
await fhevm.encryptUint16(value: number): Promise<EncryptedData>
await fhevm.encryptUint32(value: number): Promise<EncryptedData>

// Encrypt boolean
await fhevm.encryptBool(value: boolean): Promise<EncryptedData>

// Encrypt address
await fhevm.encryptAddress(address: string): Promise<EncryptedData>
```

#### Decryption Methods

```typescript
// Decrypt unsigned integers
await fhevm.decryptUint8(data: Uint8Array | string): Promise<number>
await fhevm.decryptUint16(data: Uint8Array | string): Promise<number>
await fhevm.decryptUint32(data: Uint8Array | string): Promise<number>

// Decrypt boolean
await fhevm.decryptBool(data: Uint8Array | string): Promise<boolean>

// Decrypt address
await fhevm.decryptAddress(data: Uint8Array | string): Promise<string>
```

#### Contract Interaction

```typescript
// Get contract instance
const contract = fhevm.getContract(
  address: string,
  abi: any[]
);

// Re-encrypt for client-side decryption
const reencrypted = await fhevm.reencrypt(
  encryptedData: Uint8Array | string,
  contractAddress: string
);
```

#### Utility Methods

```typescript
fhevm.getProvider(): Provider
fhevm.getSigner(): Signer | undefined
fhevm.getNetwork(): string
```

### React Hooks

#### useFhevm()

Access the SDK instance and initialization state.

```tsx
const { fhevm, initState, error, reinit } = useFhevm();
```

#### useEncrypt()

Hook for encrypting values with loading states.

```tsx
const { encrypt, isEncrypting, error } = useEncrypt();

// Usage
const encrypted = await encrypt.uint8(42);
const encryptedBool = await encrypt.bool(true);
const encryptedAddress = await encrypt.address('0x...');
```

#### useDecrypt()

Hook for decrypting values with loading states.

```tsx
const { decrypt, isDecrypting, error } = useDecrypt();

// Usage
const value = await decrypt.uint8(encryptedData);
const bool = await decrypt.bool(encryptedData);
```

#### useContract()

Hook for accessing contract instances.

```tsx
const contract = useContract(address, abi);

// Usage
await contract.submitVote(encrypted.data, encrypted.proof);
```

#### useNetwork()

Hook for accessing network information.

```tsx
const { network, provider, signer } = useNetwork();
```

### Types

```typescript
interface EncryptedData {
  data: Uint8Array;      // Encrypted bytes
  proof: Uint8Array;     // ZK proof
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';
}

interface FhevmConfig {
  network: string;
  rpcUrl?: string;
  provider?: Provider;
  signer?: Signer;
}

enum InitState {
  UNINITIALIZED = 'UNINITIALIZED',
  INITIALIZING = 'INITIALIZING',
  INITIALIZED = 'INITIALIZED',
  FAILED = 'FAILED'
}
```

## Examples

### Voting System

```typescript
import { FhevmSDK } from '@fhevm/sdk';

const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// Encrypt vote (score 1-10)
const encryptedVote = await fhevm.encryptUint8(7);

// Submit to voting contract
const votingContract = fhevm.getContract(
  '0x1234...',
  votingABI
);

await votingContract.submitVote(
  projectId,
  encryptedVote.data,
  encryptedVote.proof
);

// Get encrypted results (requires authorization)
const encryptedResult = await votingContract.getProjectScore(projectId);

// Decrypt results
const finalScore = await fhevm.decryptUint32(encryptedResult);
console.log('Final Score:', finalScore);
```

### Private Auction

```typescript
// Encrypt bid amount
const encryptedBid = await fhevm.encryptUint32(1000000); // 1M wei

// Submit sealed bid
await auctionContract.submitBid(
  auctionId,
  encryptedBid.data,
  encryptedBid.proof
);

// After auction ends, get winning bid
const winningBid = await auctionContract.getWinningBid(auctionId);
const amount = await fhevm.decryptUint32(winningBid);
```

### Confidential Identity

```typescript
// Encrypt user age
const encryptedAge = await fhevm.encryptUint8(25);

// Store on-chain
await identityContract.setAge(encryptedAge.data, encryptedAge.proof);

// Verify age threshold without revealing actual age
const isAdult = await identityContract.isOver18(userAddress);
console.log('Is adult:', isAdult); // true/false, but actual age remains private
```

## Error Handling

```typescript
import { FhevmError, ErrorType } from '@fhevm/sdk';

try {
  const encrypted = await fhevm.encryptUint8(42);
} catch (error) {
  if (error instanceof FhevmError) {
    switch (error.type) {
      case ErrorType.NOT_INITIALIZED:
        console.error('SDK not initialized');
        break;
      case ErrorType.ENCRYPTION_ERROR:
        console.error('Encryption failed');
        break;
      case ErrorType.NETWORK_ERROR:
        console.error('Network error');
        break;
    }
  }
}
```

## Best Practices

### 1. Initialize Once

```typescript
// Good: Initialize at app startup
const fhevm = await FhevmSDK.init({ network: 'sepolia' });

// Bad: Re-initializing repeatedly
function component() {
  const fhevm = await FhevmSDK.init({ network: 'sepolia' }); // Don't do this
}
```

### 2. Handle Errors

```typescript
// Always handle encryption/decryption errors
try {
  const encrypted = await fhevm.encryptUint8(value);
  await contract.submit(encrypted.data, encrypted.proof);
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly error message
}
```

### 3. Validate Input

```typescript
// Validate before encrypting
if (value < 0 || value > 255) {
  throw new Error('Value must be 0-255 for uint8');
}
const encrypted = await fhevm.encryptUint8(value);
```

### 4. Use React Hooks

```typescript
// Good: Use provided hooks for React
const { encrypt, isEncrypting } = useEncrypt();

// Less ideal: Using SDK directly in components
const { fhevm } = useFhevm();
await fhevm.encryptUint8(value); // Works but less optimized
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
├─────────────────────────────────────────────────────────┤
│              @fhevm/sdk (This Package)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Core SDK   │  │   React      │  │   Types      │  │
│  │   FhevmSDK   │  │   Hooks      │  │   Utils      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    Ethers.js v6                          │
├─────────────────────────────────────────────────────────┤
│              Ethereum JSON-RPC Provider                  │
├─────────────────────────────────────────────────────────┤
│           Smart Contracts with FHEVM Support             │
└─────────────────────────────────────────────────────────┘
```

## Performance Tips

1. **Batch Operations**: Encrypt multiple values before submitting
2. **Cache SDK Instance**: Reuse the same SDK instance across your app
3. **Use Web Workers**: Offload encryption to workers for large datasets
4. **Minimize Decryptions**: Only decrypt when necessary (authorized users only)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Node.js 18+

## Security Considerations

1. **Never expose private keys**: Use environment variables
2. **Validate permissions**: Check ACL before decryption
3. **Use HTTPS**: Always use secure connections
4. **Audit contracts**: Review smart contract code before interaction
5. **Rate limiting**: Implement rate limits for encryption operations

## Testing

```bash
# Run SDK tests
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

Contributions welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../../LICENSE) for details

## Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Example Applications](../../examples/)
- [API Documentation](https://docs.fhevm-sdk.dev)
- [GitHub Repository](https://github.com/zama-ai/fhevm-react-template)

## Support

- [GitHub Issues](https://github.com/zama-ai/fhevm-react-template/issues)
- [Discord Community](https://discord.fhe.org)
- [Documentation](https://docs.fhevm-sdk.dev)

---

Built with ❤️ for the Zama FHE Challenge
