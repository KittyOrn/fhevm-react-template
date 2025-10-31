'use client';

import { useState, useCallback } from 'react';
import { useEncrypt } from '@fhevm/sdk';
import { FHEDataType, EncryptedData } from '../lib/fhe/types';
import { validateEncryptionInput } from '../lib/utils/validation';

interface UseEncryptionReturn {
  encryptValue: (value: any, type: FHEDataType) => Promise<EncryptedData | null>;
  isEncrypting: boolean;
  error: string | null;
  lastEncrypted: EncryptedData | null;
  clearError: () => void;
}

/**
 * Enhanced encryption hook with validation and error handling
 */
export function useEncryption(): UseEncryptionReturn {
  const { encrypt, isEncrypting } = useEncrypt();
  const [error, setError] = useState<string | null>(null);
  const [lastEncrypted, setLastEncrypted] = useState<EncryptedData | null>(null);

  const encryptValue = useCallback(async (value: any, type: FHEDataType): Promise<EncryptedData | null> => {
    setError(null);

    // Validate input
    const validation = validateEncryptionInput(value, type);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return null;
    }

    try {
      let encrypted;

      switch (type) {
        case 'uint8':
          encrypted = await encrypt.uint8(validation.sanitized as number);
          break;
        case 'uint32':
          encrypted = await encrypt.uint32(validation.sanitized as number);
          break;
        case 'bool':
          encrypted = await encrypt.bool(validation.sanitized as boolean);
          break;
        default:
          throw new Error(`Unsupported encryption type: ${type}`);
      }

      const result: EncryptedData = {
        ...encrypted,
        type,
      };

      setLastEncrypted(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMsg);
      return null;
    }
  }, [encrypt]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    encryptValue,
    isEncrypting,
    error,
    lastEncrypted,
    clearError,
  };
}
