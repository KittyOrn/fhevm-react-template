import { ethers } from 'ethers';

/**
 * Configuration options for FHEVM SDK initialization
 */
export interface FhevmConfig {
  /** Network to connect to (e.g., 'sepolia', 'mainnet', 'localhost') */
  network: string;
  /** Optional custom RPC URL */
  rpcUrl?: string;
  /** Optional provider (ethers.js provider) */
  provider?: ethers.Provider;
  /** Optional signer (ethers.js signer) */
  signer?: ethers.Signer;
}

/**
 * Encrypted data structure returned after encryption
 */
export interface EncryptedData {
  /** Encrypted data bytes */
  data: Uint8Array;
  /** Zero-knowledge proof for verification */
  proof: Uint8Array;
  /** Type of encrypted value */
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'address' | 'bool';
}

/**
 * Main FHEVM SDK class for interacting with encrypted smart contracts
 */
export class FhevmSDK {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private network: string;
  private publicKey?: Uint8Array;

  private constructor(config: FhevmConfig, provider: ethers.Provider, signer?: ethers.Signer) {
    this.network = config.network;
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Initialize the FHEVM SDK
   * @param config - Configuration options
   * @returns Initialized FhevmSDK instance
   */
  static async init(config: FhevmConfig): Promise<FhevmSDK> {
    let provider: ethers.Provider;
    let signer: ethers.Signer | undefined;

    if (config.provider) {
      provider = config.provider;
      signer = config.signer;
    } else {
      const rpcUrl = config.rpcUrl || FhevmSDK.getDefaultRpcUrl(config.network);
      provider = new ethers.JsonRpcProvider(rpcUrl);

      // Try to get signer from browser wallet if available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        signer = await browserProvider.getSigner();
      }
    }

    const sdk = new FhevmSDK(config, provider, signer);
    await sdk.fetchPublicKey();
    return sdk;
  }

  /**
   * Get default RPC URL for known networks
   */
  private static getDefaultRpcUrl(network: string): string {
    const urls: { [key: string]: string } = {
      'sepolia': 'https://rpc.sepolia.org',
      'mainnet': 'https://eth.llamarpc.com',
      'localhost': 'http://127.0.0.1:8545',
      'hardhat': 'http://127.0.0.1:8545'
    };
    return urls[network] || urls['localhost'];
  }

  /**
   * Fetch the network's FHE public key
   */
  private async fetchPublicKey(): Promise<void> {
    try {
      // In a real implementation, this would fetch from the ACL contract
      // For now, we generate a mock public key
      this.publicKey = new Uint8Array(32).fill(1);
    } catch (error) {
      console.warn('Could not fetch FHE public key:', error);
    }
  }

  /**
   * Get the current provider
   */
  getProvider(): ethers.Provider {
    return this.provider;
  }

  /**
   * Get the current signer
   */
  getSigner(): ethers.Signer | undefined {
    return this.signer;
  }

  /**
   * Get the network name
   */
  getNetwork(): string {
    return this.network;
  }

  /**
   * Encrypt a uint8 value
   * @param value - Value to encrypt (0-255)
   * @returns Encrypted data with proof
   */
  async encryptUint8(value: number): Promise<EncryptedData> {
    if (value < 0 || value > 255) {
      throw new Error('Value must be between 0 and 255 for uint8');
    }
    return this.encrypt(value, 'uint8');
  }

  /**
   * Encrypt a uint16 value
   * @param value - Value to encrypt (0-65535)
   * @returns Encrypted data with proof
   */
  async encryptUint16(value: number): Promise<EncryptedData> {
    if (value < 0 || value > 65535) {
      throw new Error('Value must be between 0 and 65535 for uint16');
    }
    return this.encrypt(value, 'uint16');
  }

  /**
   * Encrypt a uint32 value
   * @param value - Value to encrypt
   * @returns Encrypted data with proof
   */
  async encryptUint32(value: number): Promise<EncryptedData> {
    if (value < 0 || value > 0xFFFFFFFF) {
      throw new Error('Value must be between 0 and 2^32-1 for uint32');
    }
    return this.encrypt(value, 'uint32');
  }

  /**
   * Encrypt a boolean value
   * @param value - Boolean to encrypt
   * @returns Encrypted data with proof
   */
  async encryptBool(value: boolean): Promise<EncryptedData> {
    return this.encrypt(value ? 1 : 0, 'bool');
  }

  /**
   * Encrypt an address
   * @param address - Ethereum address to encrypt
   * @returns Encrypted data with proof
   */
  async encryptAddress(address: string): Promise<EncryptedData> {
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }
    const normalized = ethers.getAddress(address);
    return this.encrypt(normalized, 'address');
  }

  /**
   * Internal encryption method
   */
  private async encrypt(value: number | string, type: EncryptedData['type']): Promise<EncryptedData> {
    if (!this.publicKey) {
      throw new Error('Public key not available. SDK may not be initialized properly.');
    }

    // Mock encryption - in real implementation, this would use TFHE library
    const valueBytes = this.valueToBytes(value, type);
    const encrypted = new Uint8Array(valueBytes.length + 32);
    encrypted.set(this.publicKey.slice(0, 32), 0);
    encrypted.set(valueBytes, 32);

    // Mock proof generation
    const proof = new Uint8Array(64).fill(2);

    return {
      data: encrypted,
      proof: proof,
      type: type
    };
  }

  /**
   * Convert value to bytes based on type
   */
  private valueToBytes(value: number | string, type: EncryptedData['type']): Uint8Array {
    switch (type) {
      case 'uint8':
        return new Uint8Array([value as number]);
      case 'uint16':
        return new Uint8Array(new Uint16Array([value as number]).buffer);
      case 'uint32':
        return new Uint8Array(new Uint32Array([value as number]).buffer);
      case 'bool':
        return new Uint8Array([value as number]);
      case 'address':
        return ethers.getBytes(value as string);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Decrypt a uint8 value
   * @param encryptedData - Encrypted data to decrypt
   * @returns Decrypted value
   */
  async decryptUint8(encryptedData: Uint8Array | string): Promise<number> {
    return this.decrypt(encryptedData, 'uint8') as Promise<number>;
  }

  /**
   * Decrypt a uint16 value
   * @param encryptedData - Encrypted data to decrypt
   * @returns Decrypted value
   */
  async decryptUint16(encryptedData: Uint8Array | string): Promise<number> {
    return this.decrypt(encryptedData, 'uint16') as Promise<number>;
  }

  /**
   * Decrypt a uint32 value
   * @param encryptedData - Encrypted data to decrypt
   * @returns Decrypted value
   */
  async decryptUint32(encryptedData: Uint8Array | string): Promise<number> {
    return this.decrypt(encryptedData, 'uint32') as Promise<number>;
  }

  /**
   * Decrypt a boolean value
   * @param encryptedData - Encrypted data to decrypt
   * @returns Decrypted boolean
   */
  async decryptBool(encryptedData: Uint8Array | string): Promise<boolean> {
    const value = await this.decrypt(encryptedData, 'bool') as number;
    return value !== 0;
  }

  /**
   * Decrypt an address
   * @param encryptedData - Encrypted data to decrypt
   * @returns Decrypted Ethereum address
   */
  async decryptAddress(encryptedData: Uint8Array | string): Promise<string> {
    return this.decrypt(encryptedData, 'address') as Promise<string>;
  }

  /**
   * Internal decryption method
   */
  private async decrypt(
    encryptedData: Uint8Array | string,
    type: EncryptedData['type']
  ): Promise<number | string> {
    if (!this.signer) {
      throw new Error('Signer required for decryption');
    }

    // Convert string to Uint8Array if needed
    const data = typeof encryptedData === 'string'
      ? ethers.getBytes(encryptedData)
      : encryptedData;

    // Mock decryption - in real implementation, this would use TFHE library
    // and require proper authorization
    const valueBytes = data.slice(32);
    return this.bytesToValue(valueBytes, type);
  }

  /**
   * Convert bytes to value based on type
   */
  private bytesToValue(bytes: Uint8Array, type: EncryptedData['type']): number | string {
    switch (type) {
      case 'uint8':
        return bytes[0];
      case 'uint16':
        return new Uint16Array(bytes.buffer)[0];
      case 'uint32':
        return new Uint32Array(bytes.buffer)[0];
      case 'bool':
        return bytes[0];
      case 'address':
        return ethers.hexlify(bytes);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  /**
   * Connect to a smart contract with FHE support
   * @param address - Contract address
   * @param abi - Contract ABI
   * @returns ethers.js Contract instance
   */
  getContract(address: string, abi: any[]): ethers.Contract {
    if (this.signer) {
      return new ethers.Contract(address, abi, this.signer);
    }
    return new ethers.Contract(address, abi, this.provider);
  }

  /**
   * Re-encrypt encrypted data for the caller
   * Used to allow users to decrypt their own encrypted data
   * @param encryptedData - Encrypted data handle
   * @param contractAddress - Contract address that holds the encrypted data
   * @returns Re-encrypted data that can be decrypted client-side
   */
  async reencrypt(encryptedData: Uint8Array | string, contractAddress: string): Promise<Uint8Array> {
    if (!this.signer) {
      throw new Error('Signer required for reencryption');
    }

    // In real implementation, this would:
    // 1. Generate reencryption request
    // 2. Sign the request
    // 3. Submit to ACL contract
    // 4. Get reencrypted data back

    // Mock implementation
    const data = typeof encryptedData === 'string'
      ? ethers.getBytes(encryptedData)
      : encryptedData;

    return data;
  }
}
