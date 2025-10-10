/**
 * React adapter for FHEVM SDK
 *
 * Provides React hooks and context for easy integration with React applications
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FhevmSDK, FhevmConfig, EncryptedData } from '../core/FhevmSDK';
import { InitState, FhevmError, ErrorType } from '../types';

/**
 * Context value type
 */
interface FhevmContextValue {
  /** SDK instance */
  fhevm: FhevmSDK | null;
  /** Initialization state */
  initState: InitState;
  /** Initialization error if any */
  error: Error | null;
  /** Re-initialize with new config */
  reinit: (config: FhevmConfig) => Promise<void>;
}

/**
 * React Context for FHEVM SDK
 */
const FhevmContext = createContext<FhevmContextValue | undefined>(undefined);

/**
 * Props for FhevmProvider
 */
interface FhevmProviderProps {
  /** SDK configuration */
  config: FhevmConfig;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for FHEVM SDK
 *
 * @example
 * ```tsx
 * import { FhevmProvider } from '@fhevm/sdk';
 *
 * function App() {
 *   return (
 *     <FhevmProvider config={{ network: 'sepolia' }}>
 *       <YourApp />
 *     </FhevmProvider>
 *   );
 * }
 * ```
 */
export function FhevmProvider({ config, children }: FhevmProviderProps) {
  const [fhevm, setFhevm] = useState<FhevmSDK | null>(null);
  const [initState, setInitState] = useState<InitState>(InitState.UNINITIALIZED);
  const [error, setError] = useState<Error | null>(null);

  const initializeSdk = async (cfg: FhevmConfig) => {
    try {
      setInitState(InitState.INITIALIZING);
      setError(null);
      const instance = await FhevmSDK.init(cfg);
      setFhevm(instance);
      setInitState(InitState.INITIALIZED);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown initialization error');
      setError(error);
      setInitState(InitState.FAILED);
    }
  };

  useEffect(() => {
    initializeSdk(config);
  }, [config.network, config.rpcUrl]);

  const reinit = async (newConfig: FhevmConfig) => {
    await initializeSdk(newConfig);
  };

  return (
    <FhevmContext.Provider value={{ fhevm, initState, error, reinit }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Hook to access FHEVM SDK instance
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { fhevm, initState } = useFhevm();
 *
 *   if (initState !== InitState.INITIALIZED) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>SDK Ready!</div>;
 * }
 * ```
 */
export function useFhevm() {
  const context = useContext(FhevmContext);
  if (context === undefined) {
    throw new FhevmError(
      ErrorType.NOT_INITIALIZED,
      'useFhevm must be used within a FhevmProvider'
    );
  }
  return context;
}

/**
 * Hook for encrypting values
 *
 * @example
 * ```tsx
 * function VoteButton() {
 *   const { encrypt, isEncrypting, error } = useEncrypt();
 *
 *   const handleVote = async () => {
 *     const encrypted = await encrypt.uint8(7);
 *     await contract.submitVote(encrypted.data, encrypted.proof);
 *   };
 *
 *   return <button onClick={handleVote}>Vote</button>;
 * }
 * ```
 */
export function useEncrypt() {
  const { fhevm } = useFhevm();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEncryptFn = <T,>(
    encryptFn: (value: T) => Promise<EncryptedData>
  ) => {
    return async (value: T): Promise<EncryptedData> => {
      if (!fhevm) {
        throw new FhevmError(ErrorType.NOT_INITIALIZED, 'SDK not initialized');
      }

      try {
        setIsEncrypting(true);
        setError(null);
        const result = await encryptFn(value);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Encryption failed');
        setError(error);
        throw error;
      } finally {
        setIsEncrypting(false);
      }
    };
  };

  return {
    encrypt: {
      uint8: createEncryptFn((value: number) => fhevm!.encryptUint8(value)),
      uint16: createEncryptFn((value: number) => fhevm!.encryptUint16(value)),
      uint32: createEncryptFn((value: number) => fhevm!.encryptUint32(value)),
      bool: createEncryptFn((value: boolean) => fhevm!.encryptBool(value)),
      address: createEncryptFn((value: string) => fhevm!.encryptAddress(value))
    },
    isEncrypting,
    error
  };
}

/**
 * Hook for decrypting values
 *
 * @example
 * ```tsx
 * function ResultDisplay({ encryptedResult }) {
 *   const { decrypt, isDecrypting } = useDecrypt();
 *   const [result, setResult] = useState<number | null>(null);
 *
 *   useEffect(() => {
 *     decrypt.uint8(encryptedResult).then(setResult);
 *   }, [encryptedResult]);
 *
 *   if (isDecrypting) return <div>Decrypting...</div>;
 *   return <div>Result: {result}</div>;
 * }
 * ```
 */
export function useDecrypt() {
  const { fhevm } = useFhevm();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createDecryptFn = <T,>(
    decryptFn: (data: Uint8Array | string) => Promise<T>
  ) => {
    return async (data: Uint8Array | string): Promise<T> => {
      if (!fhevm) {
        throw new FhevmError(ErrorType.NOT_INITIALIZED, 'SDK not initialized');
      }

      try {
        setIsDecrypting(true);
        setError(null);
        const result = await decryptFn(data);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Decryption failed');
        setError(error);
        throw error;
      } finally {
        setIsDecrypting(false);
      }
    };
  };

  return {
    decrypt: {
      uint8: createDecryptFn((data: Uint8Array | string) => fhevm!.decryptUint8(data)),
      uint16: createDecryptFn((data: Uint8Array | string) => fhevm!.decryptUint16(data)),
      uint32: createDecryptFn((data: Uint8Array | string) => fhevm!.decryptUint32(data)),
      bool: createDecryptFn((data: Uint8Array | string) => fhevm!.decryptBool(data)),
      address: createDecryptFn((data: Uint8Array | string) => fhevm!.decryptAddress(data))
    },
    isDecrypting,
    error
  };
}

/**
 * Hook for working with encrypted contracts
 *
 * @example
 * ```tsx
 * function VotingContract() {
 *   const contract = useContract(contractAddress, contractABI);
 *
 *   const handleVote = async () => {
 *     await contract.submitVote(encryptedData, proof);
 *   };
 *
 *   return <button onClick={handleVote}>Submit Vote</button>;
 * }
 * ```
 */
export function useContract(address: string, abi: any[]) {
  const { fhevm } = useFhevm();

  if (!fhevm) {
    throw new FhevmError(ErrorType.NOT_INITIALIZED, 'SDK not initialized');
  }

  return fhevm.getContract(address, abi);
}

/**
 * Hook for getting network information
 *
 * @example
 * ```tsx
 * function NetworkDisplay() {
 *   const { network, provider, signer } = useNetwork();
 *
 *   return (
 *     <div>
 *       <p>Network: {network}</p>
 *       <p>Connected: {signer ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNetwork() {
  const { fhevm } = useFhevm();

  if (!fhevm) {
    return {
      network: null,
      provider: null,
      signer: null
    };
  }

  return {
    network: fhevm.getNetwork(),
    provider: fhevm.getProvider(),
    signer: fhevm.getSigner()
  };
}
