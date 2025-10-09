/**
 * Universal FHEVM SDK
 *
 * Framework-agnostic SDK for building confidential dApps with Zama's
 * Fully Homomorphic Encryption (FHE) technology.
 *
 * @packageDocumentation
 */

// Core SDK
export { FhevmSDK } from './core/FhevmSDK';
export type { FhevmConfig, EncryptedData } from './core/FhevmSDK';

// React adapter (only if React is available)
export * from './adapters/react';

// Types
export * from './types';

/**
 * Quick start example:
 *
 * ```typescript
 * import { FhevmSDK } from '@fhevm/sdk';
 *
 * // Initialize SDK
 * const fhevm = await FhevmSDK.init({ network: 'sepolia' });
 *
 * // Encrypt data
 * const encrypted = await fhevm.encryptUint8(42);
 *
 * // Submit to contract
 * await contract.submitVote(encrypted.data, encrypted.proof);
 *
 * // Decrypt result
 * const result = await fhevm.decryptUint8(encryptedResult);
 * ```
 */
