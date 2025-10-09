/**
 * Common types used throughout the SDK
 */

/**
 * Supported FHE data types
 */
export type FheType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';

/**
 * Transaction options for encrypted operations
 */
export interface TransactionOptions {
  /** Gas limit */
  gasLimit?: number;
  /** Gas price in wei */
  gasPrice?: bigint;
  /** Max fee per gas (EIP-1559) */
  maxFeePerGas?: bigint;
  /** Max priority fee per gas (EIP-1559) */
  maxPriorityFeePerGas?: bigint;
  /** Transaction value in wei */
  value?: bigint;
}

/**
 * Contract call result with encrypted data
 */
export interface EncryptedResult<T = any> {
  /** Encrypted data handle */
  handle: Uint8Array;
  /** Transaction hash */
  transactionHash: string;
  /** Block number */
  blockNumber: number;
  /** Decrypted value (if available) */
  value?: T;
}

/**
 * Permission for accessing encrypted data
 */
export interface Permission {
  /** Contract address */
  contractAddress: string;
  /** User address */
  userAddress: string;
  /** Expiration timestamp */
  expiration: number;
  /** Signature */
  signature: string;
}

/**
 * Network configuration
 */
export interface NetworkConfig {
  /** Chain ID */
  chainId: number;
  /** Network name */
  name: string;
  /** RPC URL */
  rpcUrl: string;
  /** Block explorer URL */
  explorerUrl?: string;
  /** ACL contract address */
  aclAddress?: string;
  /** Gateway contract address */
  gatewayAddress?: string;
}

/**
 * SDK initialization state
 */
export enum InitState {
  /** Not initialized */
  UNINITIALIZED = 'UNINITIALIZED',
  /** Initializing */
  INITIALIZING = 'INITIALIZING',
  /** Successfully initialized */
  INITIALIZED = 'INITIALIZED',
  /** Initialization failed */
  FAILED = 'FAILED'
}

/**
 * Error types for better error handling
 */
export enum ErrorType {
  /** Network connection error */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Encryption error */
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  /** Decryption error */
  DECRYPTION_ERROR = 'DECRYPTION_ERROR',
  /** Permission denied */
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  /** Invalid input */
  INVALID_INPUT = 'INVALID_INPUT',
  /** Not initialized */
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  /** Unknown error */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * SDK Error class with type information
 */
export class FhevmError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'FhevmError';
  }
}
