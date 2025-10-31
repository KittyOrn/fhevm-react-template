import { ethers } from 'ethers';

/**
 * Decryption utility functions for FHEVM
 *
 * These utilities provide low-level decryption operations
 * for homomorphic encryption on the blockchain.
 */

/**
 * Decryption result metadata
 */
export interface DecryptionMetadata {
  /** Type of decrypted value */
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';
  /** Timestamp of decryption */
  timestamp: number;
  /** Contract address data came from */
  contractAddress?: string;
}

/**
 * Decryption request structure
 */
export interface DecryptionRequest {
  /** Encrypted data handle or bytes */
  handle: Uint8Array | string;
  /** Contract address */
  contractAddress: string;
  /** User address requesting decryption */
  userAddress: string;
  /** Signature for authorization */
  signature?: string;
}

/**
 * Convert bytes to uint8 value
 */
export function bytesToUint8(bytes: Uint8Array): number {
  if (bytes.length < 1) {
    throw new Error('Insufficient bytes for uint8');
  }
  return bytes[0];
}

/**
 * Convert bytes to uint16 value
 */
export function bytesToUint16(bytes: Uint8Array): number {
  if (bytes.length < 2) {
    throw new Error('Insufficient bytes for uint16');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint16(0, true); // little-endian
}

/**
 * Convert bytes to uint32 value
 */
export function bytesToUint32(bytes: Uint8Array): number {
  if (bytes.length < 4) {
    throw new Error('Insufficient bytes for uint32');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, true); // little-endian
}

/**
 * Convert bytes to uint64 value
 */
export function bytesToUint64(bytes: Uint8Array): bigint {
  if (bytes.length < 8) {
    throw new Error('Insufficient bytes for uint64');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getBigUint64(0, true); // little-endian
}

/**
 * Convert bytes to boolean value
 */
export function bytesToBool(bytes: Uint8Array): boolean {
  if (bytes.length < 1) {
    throw new Error('Insufficient bytes for bool');
  }
  return bytes[0] !== 0;
}

/**
 * Convert bytes to Ethereum address
 */
export function bytesToAddress(bytes: Uint8Array): string {
  if (bytes.length < 20) {
    throw new Error('Insufficient bytes for address');
  }
  const addressBytes = bytes.slice(0, 20);
  return ethers.getAddress(ethers.hexlify(addressBytes));
}

/**
 * Extract value bytes from encrypted data
 * In mock implementation, removes the public key prefix
 */
export function extractValueBytes(encryptedData: Uint8Array, publicKeyLength: number = 32): Uint8Array {
  if (encryptedData.length <= publicKeyLength) {
    throw new Error('Encrypted data too short');
  }
  return encryptedData.slice(publicKeyLength);
}

/**
 * Mock decryption function for development/testing
 * In production, this would use actual TFHE decryption
 *
 * @param encryptedData - Encrypted data bytes or hex string
 * @param type - Expected type of decrypted value
 * @param publicKeyLength - Length of public key prefix (default: 32)
 * @returns Decrypted value
 */
export function mockDecrypt(
  encryptedData: Uint8Array | string,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool',
  publicKeyLength: number = 32
): number | bigint | boolean | string {
  // Convert hex string to Uint8Array if needed
  const data = typeof encryptedData === 'string'
    ? ethers.getBytes(encryptedData)
    : encryptedData;

  // Extract value bytes
  const valueBytes = extractValueBytes(data, publicKeyLength);

  // Convert to appropriate type
  switch (type) {
    case 'uint8':
      return bytesToUint8(valueBytes);
    case 'uint16':
      return bytesToUint16(valueBytes);
    case 'uint32':
      return bytesToUint32(valueBytes);
    case 'uint64':
      return bytesToUint64(valueBytes);
    case 'bool':
      return bytesToBool(valueBytes);
    case 'address':
      return bytesToAddress(valueBytes);
    default:
      throw new Error(`Unsupported decryption type: ${type}`);
  }
}

/**
 * Create EIP-712 signature for decryption authorization
 *
 * @param request - Decryption request parameters
 * @param signer - Ethers signer to create signature
 * @returns Signature string
 */
export async function createDecryptionSignature(
  request: DecryptionRequest,
  signer: ethers.Signer
): Promise<string> {
  // EIP-712 domain
  const domain = {
    name: 'FHEVM Decryption',
    version: '1',
    chainId: (await signer.provider?.getNetwork())?.chainId || 1,
    verifyingContract: request.contractAddress
  };

  // EIP-712 types
  const types = {
    DecryptionAuth: [
      { name: 'handle', type: 'bytes' },
      { name: 'contractAddress', type: 'address' },
      { name: 'userAddress', type: 'address' }
    ]
  };

  // Convert handle to bytes
  const handleBytes = typeof request.handle === 'string'
    ? request.handle
    : ethers.hexlify(request.handle);

  // Message to sign
  const message = {
    handle: handleBytes,
    contractAddress: request.contractAddress,
    userAddress: request.userAddress
  };

  // Sign using EIP-712
  const signature = await signer.signTypedData(domain, types, message);
  return signature;
}

/**
 * Verify decryption authorization
 *
 * @param request - Decryption request with signature
 * @param expectedSigner - Expected signer address
 * @returns True if signature is valid
 */
export function verifyDecryptionSignature(
  request: DecryptionRequest,
  expectedSigner: string
): boolean {
  if (!request.signature) {
    return false;
  }

  try {
    // EIP-712 domain
    const domain = {
      name: 'FHEVM Decryption',
      version: '1',
      chainId: 1, // Would be dynamic in production
      verifyingContract: request.contractAddress
    };

    // EIP-712 types
    const types = {
      DecryptionAuth: [
        { name: 'handle', type: 'bytes' },
        { name: 'contractAddress', type: 'address' },
        { name: 'userAddress', type: 'address' }
      ]
    };

    // Convert handle to bytes
    const handleBytes = typeof request.handle === 'string'
      ? request.handle
      : ethers.hexlify(request.handle);

    // Message
    const message = {
      handle: handleBytes,
      contractAddress: request.contractAddress,
      userAddress: request.userAddress
    };

    // Recover signer
    const recovered = ethers.verifyTypedData(domain, types, message, request.signature);

    // Compare addresses (case-insensitive)
    return recovered.toLowerCase() === expectedSigner.toLowerCase();
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Request reencryption from gateway
 * Allows user to decrypt their authorized encrypted data
 *
 * @param request - Decryption request with authorization
 * @param gatewayUrl - Gateway service URL
 * @returns Reencrypted data that can be decrypted client-side
 */
export async function requestReencryption(
  request: DecryptionRequest,
  gatewayUrl: string = 'https://gateway.zama.ai'
): Promise<Uint8Array> {
  if (!request.signature) {
    throw new Error('Signature required for reencryption request');
  }

  // In production, this would make actual API call to gateway
  // Mock implementation returns the encrypted data as-is
  const handleBytes = typeof request.handle === 'string'
    ? ethers.getBytes(request.handle)
    : request.handle;

  return handleBytes;
}

/**
 * Batch decrypt multiple handles
 *
 * @param handles - Array of encrypted handles
 * @param types - Array of types corresponding to handles
 * @param publicKeyLength - Length of public key prefix
 * @returns Array of decrypted values
 */
export function batchDecrypt(
  handles: (Uint8Array | string)[],
  types: Array<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool'>,
  publicKeyLength: number = 32
): Array<number | bigint | boolean | string> {
  if (handles.length !== types.length) {
    throw new Error('Handles and types arrays must have same length');
  }

  return handles.map((handle, index) => mockDecrypt(handle, types[index], publicKeyLength));
}
