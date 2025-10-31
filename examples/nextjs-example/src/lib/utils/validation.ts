/**
 * Validation utilities for FHE operations
 */

import { FHEDataType, EncryptedData } from '../fhe/types';

/**
 * Validate encrypted data structure
 */
export function isValidEncryptedData(data: any): data is EncryptedData {
  return (
    data &&
    data.data instanceof Uint8Array &&
    data.proof instanceof Uint8Array &&
    typeof data.type === 'string' &&
    isValidFHEDataType(data.type)
  );
}

/**
 * Validate FHE data type
 */
export function isValidFHEDataType(type: string): type is FHEDataType {
  return ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'].includes(type);
}

/**
 * Validate uint8 value range
 */
export function isValidUint8(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}

/**
 * Validate uint32 value range
 */
export function isValidUint32(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 4294967295;
}

/**
 * Validate boolean value
 */
export function isValidBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

/**
 * Validate contract address
 */
export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate network name
 */
export function isValidNetwork(network: string): boolean {
  const validNetworks = ['sepolia', 'mainnet', 'localhost'];
  return validNetworks.includes(network.toLowerCase());
}

/**
 * Validate encrypted proof
 */
export function isValidProof(proof: Uint8Array): boolean {
  return proof instanceof Uint8Array && proof.length > 0;
}

/**
 * Sanitize and validate user input for encryption
 */
export function validateEncryptionInput(value: any, type: FHEDataType): {
  valid: boolean;
  sanitized?: number | boolean | string;
  error?: string;
} {
  switch (type) {
    case 'uint8':
      const uint8Val = Number(value);
      if (!isValidUint8(uint8Val)) {
        return { valid: false, error: 'Value must be between 0 and 255' };
      }
      return { valid: true, sanitized: uint8Val };

    case 'uint32':
      const uint32Val = Number(value);
      if (!isValidUint32(uint32Val)) {
        return { valid: false, error: 'Value must be between 0 and 4294967295' };
      }
      return { valid: true, sanitized: uint32Val };

    case 'bool':
      if (!isValidBoolean(value)) {
        return { valid: false, error: 'Value must be a boolean' };
      }
      return { valid: true, sanitized: Boolean(value) };

    case 'address':
      if (!isValidContractAddress(String(value))) {
        return { valid: false, error: 'Invalid Ethereum address' };
      }
      return { valid: true, sanitized: String(value) };

    default:
      return { valid: false, error: 'Unsupported data type' };
  }
}
