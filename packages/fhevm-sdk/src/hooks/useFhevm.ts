import { useContext } from 'react';
import { FhevmContext } from '../adapters/react';

/**
 * React hook for accessing FHEVM SDK instance and state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm, isReady, error } = useFhevm();
 *
 *   const handleEncrypt = async (value: number) => {
 *     if (!fhevm) return;
 *     const encrypted = await fhevm.encryptUint8(value);
 *     return encrypted;
 *   };
 * }
 * ```
 */
export function useFhevm() {
  const context = useContext(FhevmContext);

  if (!context) {
    throw new Error('useFhevm must be used within FhevmProvider');
  }

  return context;
}

/**
 * Hook for encryption operations
 * Provides convenient encryption methods with loading state
 */
export function useEncrypt() {
  const { fhevm, isReady } = useFhevm();

  return {
    encrypt: {
      uint8: async (value: number) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.encryptUint8(value);
      },
      uint16: async (value: number) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.encryptUint16(value);
      },
      uint32: async (value: number) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.encryptUint32(value);
      },
      bool: async (value: boolean) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.encryptBool(value);
      },
      address: async (address: string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.encryptAddress(address);
      }
    },
    isReady
  };
}

/**
 * Hook for decryption operations
 * Provides convenient decryption methods with loading state
 */
export function useDecrypt() {
  const { fhevm, isReady } = useFhevm();

  return {
    decrypt: {
      uint8: async (data: Uint8Array | string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.decryptUint8(data);
      },
      uint16: async (data: Uint8Array | string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.decryptUint16(data);
      },
      uint32: async (data: Uint8Array | string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.decryptUint32(data);
      },
      bool: async (data: Uint8Array | string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.decryptBool(data);
      },
      address: async (data: Uint8Array | string) => {
        if (!fhevm) throw new Error('FHEVM not initialized');
        return fhevm.decryptAddress(data);
      }
    },
    isReady
  };
}

/**
 * Hook for accessing network information
 */
export function useNetwork() {
  const { fhevm } = useFhevm();

  return {
    network: fhevm?.getNetwork(),
    provider: fhevm?.getProvider(),
    signer: fhevm?.getSigner()
  };
}

/**
 * Hook for contract interactions
 */
export function useContract(address: string, abi: any[]) {
  const { fhevm, isReady } = useFhevm();

  const contract = fhevm?.getContract(address, abi);

  return {
    contract,
    isReady
  };
}
