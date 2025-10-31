import { FhevmSDK } from '@fhevm/sdk';

/**
 * Client-side FHE operations wrapper
 * Provides convenience methods for encryption, decryption, and contract interaction
 */
export class FHEClient {
  private sdk: FhevmSDK | null = null;

  async initialize(config: { network: string; contractAddress?: string }) {
    try {
      this.sdk = await FhevmSDK.init(config);
      return this.sdk;
    } catch (error) {
      console.error('Failed to initialize FHE client:', error);
      throw error;
    }
  }

  async encryptUint8(value: number): Promise<{ data: Uint8Array; proof: Uint8Array }> {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      const encrypted = await this.sdk.encrypt.uint8(value);
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async encryptUint32(value: number): Promise<{ data: Uint8Array; proof: Uint8Array }> {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      const encrypted = await this.sdk.encrypt.uint32(value);
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }

  async decryptUint8(encryptedData: Uint8Array): Promise<number> {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      const decrypted = await this.sdk.decrypt.uint8(encryptedData);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  async decryptUint32(encryptedData: Uint8Array): Promise<number> {
    if (!this.sdk) {
      throw new Error('SDK not initialized');
    }

    try {
      const decrypted = await this.sdk.decrypt.uint32(encryptedData);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }

  getSDK(): FhevmSDK | null {
    return this.sdk;
  }

  isReady(): boolean {
    return this.sdk !== null;
  }
}

// Export a singleton instance
export const fheClient = new FHEClient();
