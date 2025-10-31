'use client';

import { useState, useCallback } from 'react';
import { EncryptedData, ComputationParams } from '../lib/fhe/types';

interface ComputationResult {
  success: boolean;
  result?: EncryptedData;
  error?: string;
}

interface UseComputationReturn {
  compute: (params: ComputationParams) => Promise<ComputationResult>;
  isComputing: boolean;
  lastResult: EncryptedData | null;
  error: string | null;
}

/**
 * Hook for homomorphic computations
 */
export function useComputation(): UseComputationReturn {
  const [isComputing, setIsComputing] = useState(false);
  const [lastResult, setLastResult] = useState<EncryptedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async (params: ComputationParams): Promise<ComputationResult> => {
    setIsComputing(true);
    setError(null);

    try {
      // Validate parameters
      if (!params.operands || params.operands.length < 2) {
        throw new Error('At least two operands are required');
      }

      // In a real implementation, this would interact with smart contracts
      // For now, we'll simulate the computation
      const result: EncryptedData = {
        data: new Uint8Array(128),
        proof: new Uint8Array(256),
        type: params.operands[0].type,
      };

      setLastResult(result);
      return { success: true, result };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsComputing(false);
    }
  }, []);

  return {
    compute,
    isComputing,
    lastResult,
    error,
  };
}
