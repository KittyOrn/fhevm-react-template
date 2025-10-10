'use client';

import { FhevmProvider } from '@fhevm/sdk';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      {children}
    </FhevmProvider>
  );
}
