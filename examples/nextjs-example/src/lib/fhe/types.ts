/**
 * TypeScript type definitions for FHE operations
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedData {
  data: Uint8Array;
  proof: Uint8Array;
  type: FHEDataType;
}

export interface EncryptionResult {
  encrypted: EncryptedData;
  handle?: string;
  timestamp: number;
}

export interface DecryptionResult {
  value: number | boolean | string;
  type: FHEDataType;
  timestamp: number;
}

export interface FHEOperation {
  type: 'encrypt' | 'decrypt' | 'compute';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: EncryptionResult | DecryptionResult;
  error?: string;
}

export interface ComputationParams {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq';
  operands: EncryptedData[];
}

export interface FHEConfig {
  network: string;
  contractAddress?: string;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface FHEContract {
  address: string;
  abi: any[];
  network: string;
}

export interface ReencryptionRequest {
  handle: string;
  contractAddress: string;
  userAddress: string;
  signature?: string;
}
