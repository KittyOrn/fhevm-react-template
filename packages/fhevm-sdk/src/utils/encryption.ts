import { ethers } from 'ethers';

/**
 * Encryption utility functions for FHEVM
 *
 * These utilities provide low-level encryption operations
 * for homomorphic encryption on the blockchain.
 */

/**
 * Encrypted input type definition
 */
export type EncryptedType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';

/**
 * Result of encryption operation
 */
export interface EncryptionResult {
  /** Encrypted data as bytes */
  data: Uint8Array;
  /** Zero-knowledge proof for verification */
  proof: Uint8Array;
  /** Type of encrypted value */
  type: EncryptedType;
  /** Optional handles for multiple inputs */
  handles?: string[];
  /** Optional combined input proof */
  inputProof?: Uint8Array;
}

/**
 * Validate uint8 value range
 */
export function validateUint8(value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error('Value must be an integer between 0 and 255 for uint8');
  }
}

/**
 * Validate uint16 value range
 */
export function validateUint16(value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 65535) {
    throw new Error('Value must be an integer between 0 and 65535 for uint16');
  }
}

/**
 * Validate uint32 value range
 */
export function validateUint32(value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 0xFFFFFFFF) {
    throw new Error('Value must be an integer between 0 and 2^32-1 for uint32');
  }
}

/**
 * Validate uint64 value range
 */
export function validateUint64(value: bigint): void {
  if (value < 0n || value > 0xFFFFFFFFFFFFFFFFn) {
    throw new Error('Value must be between 0 and 2^64-1 for uint64');
  }
}

/**
 * Validate boolean value
 */
export function validateBool(value: boolean): void {
  if (typeof value !== 'boolean') {
    throw new Error('Value must be a boolean');
  }
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): void {
  if (!ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum address format');
  }
}

/**
 * Convert value to bytes based on type
 */
export function valueToBytes(value: number | bigint | boolean | string, type: EncryptedType): Uint8Array {
  switch (type) {
    case 'uint8':
      validateUint8(value as number);
      return new Uint8Array([value as number]);

    case 'uint16':
      validateUint16(value as number);
      const uint16Buffer = new ArrayBuffer(2);
      const uint16View = new DataView(uint16Buffer);
      uint16View.setUint16(0, value as number, true); // little-endian
      return new Uint8Array(uint16Buffer);

    case 'uint32':
      validateUint32(value as number);
      const uint32Buffer = new ArrayBuffer(4);
      const uint32View = new DataView(uint32Buffer);
      uint32View.setUint32(0, value as number, true); // little-endian
      return new Uint8Array(uint32Buffer);

    case 'uint64':
      validateUint64(value as bigint);
      const uint64Buffer = new ArrayBuffer(8);
      const uint64View = new DataView(uint64Buffer);
      uint64View.setBigUint64(0, value as bigint, true); // little-endian
      return new Uint8Array(uint64Buffer);

    case 'bool':
      validateBool(value as boolean);
      return new Uint8Array([value ? 1 : 0]);

    case 'address':
      validateAddress(value as string);
      const normalized = ethers.getAddress(value as string);
      return ethers.getBytes(normalized);

    default:
      throw new Error(`Unsupported encryption type: ${type}`);
  }
}

/**
 * Generate mock encryption for development/testing
 * In production, this would use actual TFHE encryption
 *
 * @param value - Value to encrypt
 * @param type - Type of value
 * @param publicKey - FHE public key
 * @returns Encrypted data with proof
 */
export function mockEncrypt(
  value: number | bigint | boolean | string,
  type: EncryptedType,
  publicKey: Uint8Array
): EncryptionResult {
  // Convert value to bytes
  const valueBytes = valueToBytes(value, type);

  // Create encrypted data (mock: publicKey + value bytes)
  const encrypted = new Uint8Array(publicKey.length + valueBytes.length);
  encrypted.set(publicKey, 0);
  encrypted.set(valueBytes, publicKey.length);

  // Generate mock proof
  const proof = generateMockProof(valueBytes, publicKey);

  return {
    data: encrypted,
    proof,
    type
  };
}

/**
 * Generate mock zero-knowledge proof
 * In production, this would generate actual ZK proofs
 */
function generateMockProof(valueBytes: Uint8Array, publicKey: Uint8Array): Uint8Array {
  // Mock proof: hash of value + public key
  const combined = new Uint8Array(valueBytes.length + publicKey.length);
  combined.set(valueBytes, 0);
  combined.set(publicKey, valueBytes.length);

  // Simple mock proof (64 bytes)
  const proof = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    proof[i] = combined[i % combined.length] ^ (i & 0xFF);
  }

  return proof;
}

/**
 * Create encrypted input builder
 * Allows chaining multiple encrypted inputs
 */
export class EncryptedInputBuilder {
  private inputs: Array<{ value: any; type: EncryptedType }> = [];
  private publicKey: Uint8Array;
  private contractAddress: string;
  private userAddress: string;

  constructor(publicKey: Uint8Array, contractAddress: string, userAddress: string) {
    this.publicKey = publicKey;
    this.contractAddress = contractAddress;
    this.userAddress = userAddress;
  }

  /**
   * Add uint8 value to inputs
   */
  add8(value: number): this {
    this.inputs.push({ value, type: 'uint8' });
    return this;
  }

  /**
   * Add uint16 value to inputs
   */
  add16(value: number): this {
    this.inputs.push({ value, type: 'uint16' });
    return this;
  }

  /**
   * Add uint32 value to inputs
   */
  add32(value: number): this {
    this.inputs.push({ value, type: 'uint32' });
    return this;
  }

  /**
   * Add uint64 value to inputs
   */
  add64(value: bigint): this {
    this.inputs.push({ value, type: 'uint64' });
    return this;
  }

  /**
   * Add boolean value to inputs
   */
  addBool(value: boolean): this {
    this.inputs.push({ value, type: 'bool' });
    return this;
  }

  /**
   * Add address value to inputs
   */
  addAddress(value: string): this {
    this.inputs.push({ value, type: 'address' });
    return this;
  }

  /**
   * Encrypt all inputs and return handles with proof
   */
  async encrypt(): Promise<EncryptionResult> {
    if (this.inputs.length === 0) {
      throw new Error('No inputs to encrypt');
    }

    const handles: string[] = [];
    const proofs: Uint8Array[] = [];

    // Encrypt each input
    for (const input of this.inputs) {
      const encrypted = mockEncrypt(input.value, input.type, this.publicKey);
      handles.push(ethers.hexlify(encrypted.data));
      proofs.push(encrypted.proof);
    }

    // Combine proofs into single input proof
    const totalProofSize = proofs.reduce((sum, p) => sum + p.length, 0);
    const inputProof = new Uint8Array(totalProofSize);
    let offset = 0;
    for (const proof of proofs) {
      inputProof.set(proof, offset);
      offset += proof.length;
    }

    return {
      data: new Uint8Array(), // Not used when using handles
      proof: inputProof,
      type: this.inputs[0].type,
      handles,
      inputProof
    };
  }
}
