'use client';

import { FhevmProvider as SDKProvider } from '@fhevm/sdk';
import { ReactNode } from 'react';

interface FHEProviderProps {
  children: ReactNode;
  network?: string;
  contractAddress?: string;
}

export function FHEProvider({
  children,
  network = 'sepolia',
  contractAddress,
}: FHEProviderProps) {
  return (
    <SDKProvider
      config={{
        network,
        contractAddress,
      }}
    >
      {children}
    </SDKProvider>
  );
}
