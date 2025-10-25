# React FHEVM Example

Complete React application demonstrating **@fhevm/sdk** integration with Vite.

## Features

- **React 18**: Modern React with hooks
- **TypeScript**: Full type safety
- **Vite**: Fast build tool and dev server
- **@fhevm/sdk Integration**: Seamless FHE encryption/decryption
- **Interactive Demo**: Real-time encryption/decryption showcase
- **Responsive Design**: Works on all devices

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
react-example/
├── src/
│   ├── components/
│   │   ├── NetworkStatus.tsx    # SDK status display
│   │   └── EncryptionDemo.tsx   # Encryption demo
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App styles
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
└── tsconfig.json               # TypeScript config
```

## SDK Integration

### 1. Provider Setup

Wrap your app with `FhevmProvider` in `App.tsx`:

```tsx
import { FhevmProvider } from '@fhevm/sdk';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <YourComponents />
    </FhevmProvider>
  );
}
```

### 2. Using Hooks in Components

Use SDK hooks in your components:

```tsx
import { useFhevm, useEncrypt, useDecrypt } from '@fhevm/sdk';

function MyComponent() {
  const { initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const handleEncrypt = async (value: number) => {
    const encrypted = await encrypt.uint8(value);
    console.log('Encrypted:', encrypted);
  };

  const handleDecrypt = async (data: Uint8Array) => {
    const result = await decrypt.uint8(data);
    console.log('Decrypted:', result);
  };

  return (
    <div>
      <button onClick={() => handleEncrypt(42)}>Encrypt</button>
      <button onClick={() => handleDecrypt(encryptedData)}>Decrypt</button>
    </div>
  );
}
```

## Key Components

### NetworkStatus Component

Displays SDK initialization status and network information:

```tsx
import { useFhevm, useNetwork, InitState } from '@fhevm/sdk';

function NetworkStatus() {
  const { initState, error } = useFhevm();
  const { network, signer } = useNetwork();

  return (
    <div>
      <p>Status: {initState}</p>
      <p>Network: {network}</p>
      <p>Wallet: {signer ? 'Connected' : 'Not Connected'}</p>
    </div>
  );
}
```

### EncryptionDemo Component

Interactive encryption/decryption demonstration:

```tsx
import { useEncrypt, useDecrypt } from '@fhevm/sdk';

function EncryptionDemo() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const [value, setValue] = useState(42);
  const [encrypted, setEncrypted] = useState(null);
  const [decrypted, setDecrypted] = useState(null);

  const handleEncrypt = async () => {
    const result = await encrypt.uint8(value);
    setEncrypted(result.data);
  };

  const handleDecrypt = async () => {
    const result = await decrypt.uint8(encrypted);
    setDecrypted(result);
  };

  return (
    <div>
      <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
      <button onClick={handleEncrypt}>Encrypt</button>
      {encrypted && <button onClick={handleDecrypt}>Decrypt</button>}
      {decrypted !== null && <div>Result: {decrypted}</div>}
    </div>
  );
}
```

## Available Hooks

### useFhevm()

Access SDK instance and initialization state:

```tsx
const { fhevm, initState, error, reinit } = useFhevm();
```

### useEncrypt()

Encrypt values:

```tsx
const { encrypt, isEncrypting, error } = useEncrypt();

// Usage
const encrypted = await encrypt.uint8(42);
const encrypted = await encrypt.uint32(1000);
const encrypted = await encrypt.bool(true);
```

### useDecrypt()

Decrypt values:

```tsx
const { decrypt, isDecrypting, error } = useDecrypt();

// Usage
const value = await decrypt.uint8(encryptedData);
const value = await decrypt.uint32(encryptedData);
const value = await decrypt.bool(encryptedData);
```

### useNetwork()

Get network information:

```tsx
const { network, provider, signer } = useNetwork();
```

### useContract()

Get contract instance:

```tsx
const contract = useContract(contractAddress, contractABI);
await contract.methodName(...args);
```

## Loading States

Handle SDK initialization states:

```tsx
import { InitState } from '@fhevm/sdk';

const { initState, error } = useFhevm();

if (initState === InitState.INITIALIZING) {
  return <div>Loading SDK...</div>;
}

if (initState === InitState.FAILED) {
  return <div>Error: {error?.message}</div>;
}

// SDK ready
return <YourComponent />;
```

## Error Handling

Implement robust error handling:

```tsx
import { FhevmError, ErrorType } from '@fhevm/sdk';

try {
  const encrypted = await encrypt.uint8(value);
} catch (err) {
  if (err instanceof FhevmError) {
    switch (err.type) {
      case ErrorType.ENCRYPTION_ERROR:
        console.error('Encryption failed:', err.message);
        break;
      case ErrorType.NOT_INITIALIZED:
        console.error('SDK not initialized');
        break;
      default:
        console.error('Unknown error:', err.message);
    }
  }
}
```

## Styling

The example uses custom CSS for styling. Key features:

- Gradient backgrounds
- Card layouts
- Responsive design
- Loading states
- Color-coded status indicators

## Environment Variables

Create `.env.local` for configuration:

```env
VITE_NETWORK=sepolia
VITE_RPC_URL=https://rpc.sepolia.org
VITE_CONTRACT_ADDRESS=0x...
```

Access in components:

```tsx
const network = import.meta.env.VITE_NETWORK || 'sepolia';
```

## Common Issues

### SDK Not Initializing

Ensure proper network configuration:

```tsx
<FhevmProvider config={{
  network: 'sepolia',
  rpcUrl: 'https://rpc.sepolia.org'  // Optional
}}>
```

### Hooks Error

Ensure components are inside `FhevmProvider`:

```tsx
<FhevmProvider config={{ network: 'sepolia' }}>
  <ComponentUsingHooks />
</FhevmProvider>
```

### Module Not Found

Reinstall dependencies:

```bash
rm -rf node_modules
npm install
```

## Deployment

### Vercel

```bash
npm run build
# Deploy dist/ folder
```

### Netlify

```bash
npm run build
# Deploy dist/ folder
```

### Other Platforms

The built files in `dist/` can be deployed to any static hosting service.

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [@fhevm/sdk Documentation](../../packages/fhevm-sdk/README.md)
- [React Documentation](https://react.dev/)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)

## License

MIT License

---

**Built for the Zama FHE Challenge**
