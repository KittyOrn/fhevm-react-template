'use client';

import { useFhevm as useSDKFhevm } from '@fhevm/sdk';

/**
 * Custom hook for FHE operations
 * Wraps the SDK's useFhevm hook with additional functionality
 */
export function useFHE() {
  const fhevmContext = useSDKFhevm();

  return {
    ...fhevmContext,
    // Add any custom functionality here
  };
}

// Re-export for convenience
export { useFhevm } from '@fhevm/sdk';
