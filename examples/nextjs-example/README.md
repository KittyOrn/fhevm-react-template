# Next.js 14 FHEVM Example

Complete Next.js 14 application demonstrating **@fhevm/sdk** integration with App Router.

## Features

- **Next.js 14 App Router**: Modern React Server Components architecture
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Beautiful, responsive UI components
- **@fhevm/sdk Integration**: Seamless FHE encryption/decryption
- **Real-time Demo**: Interactive encryption/decryption showcase

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
nextjs-example/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with encryption demo
│   ├── providers.tsx       # FhevmProvider configuration
│   └── globals.css         # Global styles with Tailwind
├── package.json            # Dependencies and scripts
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## SDK Integration

### 1. Provider Setup

Wrap your app with `FhevmProvider` in `app/providers.tsx`:

```tsx
'use client';

import { FhevmProvider } from '@fhevm/sdk';

export function Providers({ children }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}
```

### 2. Layout Configuration

Include provider in `app/layout.tsx`:

```tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Using Hooks in Components

Use SDK hooks in client components:

```tsx
'use client';

import { useFhevm, useEncrypt } from '@fhevm/sdk';

export default function Page() {
  const { fhevm, initState } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const handleEncrypt = async () => {
    const encrypted = await encrypt.uint8(42);
    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={isEncrypting}>
      Encrypt Value
    </button>
  );
}
```

## Key Components

### Network Status Display

```tsx
const { network, signer } = useNetwork();

return (
  <div>
    <p>Network: {network}</p>
    <p>Wallet: {signer ? 'Connected' : 'Not connected'}</p>
  </div>
);
```

### Encryption Demo

```tsx
const { encrypt, isEncrypting } = useEncrypt();
const [result, setResult] = useState(null);

const handleEncrypt = async (value: number) => {
  const encrypted = await encrypt.uint8(value);
  setResult(encrypted);
};
```

### Decryption Demo

```tsx
const { decrypt, isDecrypting } = useDecrypt();
const [decrypted, setDecrypted] = useState(null);

const handleDecrypt = async (encryptedData: Uint8Array) => {
  const value = await decrypt.uint8(encryptedData);
  setDecrypted(value);
};
```

## Loading States

Handle SDK initialization states:

```tsx
import { InitState } from '@fhevm/sdk';

const { initState, error } = useFhevm();

if (initState === InitState.INITIALIZING) {
  return <LoadingSpinner />;
}

if (initState === InitState.FAILED) {
  return <ErrorMessage error={error} />;
}

// SDK ready
return <YourComponent />;
```

## Styling with Tailwind

The example uses Tailwind CSS for modern, responsive design:

```tsx
<button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
  Encrypt
</button>
```

### Key Design Features

- **Gradient backgrounds**: Visually appealing color schemes
- **Card layouts**: Clean, organized information display
- **Responsive design**: Works on mobile, tablet, and desktop
- **Loading states**: Animated spinners and disabled states
- **Color-coded feedback**: Green for success, red for errors

## Environment Variables

Create `.env.local` for configuration:

```env
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

Access in components:

```tsx
const network = process.env.NEXT_PUBLIC_NETWORK || 'sepolia';
```

## Error Handling

Implement robust error handling:

```tsx
try {
  const encrypted = await encrypt.uint8(value);
} catch (err) {
  if (err instanceof FhevmError) {
    // Handle specific FHEVM errors
    console.error('FHE Error:', err.type, err.message);
  } else {
    // Handle general errors
    console.error('Error:', err);
  }
}
```

## Performance Optimization

### 1. React Server Components

Use Server Components where possible for better performance:

```tsx
// app/components/ServerComponent.tsx
export default async function ServerComponent() {
  // Fetch data on server
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### 2. Client-Side Optimization

Use `'use client'` directive only when needed:

```tsx
'use client';  // Only for components using hooks

import { useEncrypt } from '@fhevm/sdk';
```

### 3. Lazy Loading

Lazy load heavy components:

```tsx
import dynamic from 'next/dynamic';

const EncryptionDemo = dynamic(() => import('./EncryptionDemo'), {
  loading: () => <LoadingSpinner />
});
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

```bash
npm run build
```

### Other Platforms

The app works on any platform supporting Next.js 14:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## Testing

### Run Development Build

```bash
npm run dev
```

### Test Production Build

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Common Issues

### Hydration Errors

If you see hydration errors, ensure client components are marked:

```tsx
'use client';  // Add this at the top
```

### Window Not Defined

For browser-only code, check if window exists:

```tsx
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

### Module Not Found

Ensure all dependencies are installed:

```bash
npm install
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [@fhevm/sdk Documentation](../../packages/fhevm-sdk/README.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)

## License

MIT License

---

**Built for the Zama FHE Challenge**
