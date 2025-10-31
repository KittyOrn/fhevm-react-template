/**
 * API-related TypeScript type definitions
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface EncryptAPIRequest {
  value: number | boolean | string;
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}

export interface EncryptAPIResponse {
  success: boolean;
  encrypted?: {
    type: string;
    dataLength: number;
    proofLength: number;
    timestamp: number;
  };
  message: string;
}

export interface DecryptAPIRequest {
  encryptedData: string;
  userAddress: string;
}

export interface DecryptAPIResponse {
  success: boolean;
  decrypted?: {
    value: number | boolean | string;
    timestamp: number;
  };
  message: string;
}

export interface ComputeAPIRequest {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq';
  operands: string[];
}

export interface ComputeAPIResponse {
  success: boolean;
  computation?: {
    operation: string;
    operandsCount: number;
    resultType: string;
    timestamp: number;
  };
  message: string;
}

export interface KeyAPIResponse {
  success: boolean;
  keys?: {
    publicKeyAvailable: boolean;
    keyVersion: string;
    timestamp: number;
  };
  message: string;
}

export interface FHEAPIRequest {
  operation: 'encrypt' | 'compute';
  data: any;
}

export interface FHEAPIResponse {
  success: boolean;
  message: string;
  data?: any;
}
