/**
 * FHE-related TypeScript type definitions
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export type FHEOperation = 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq' | 'and' | 'or' | 'xor';

export interface EncryptedValue {
  data: Uint8Array;
  proof: Uint8Array;
  type: FHEDataType;
}

export interface EncryptionInput {
  value: number | boolean | string;
  type: FHEDataType;
}

export interface DecryptionInput {
  encryptedData: Uint8Array;
  type: FHEDataType;
  contractAddress?: string;
  userAddress?: string;
}

export interface FHEInitConfig {
  network: string;
  contractAddress?: string;
  gatewayUrl?: string;
  aclAddress?: string;
  provider?: any;
}

export interface FHEContractConfig {
  address: string;
  abi: any[];
  network: string;
}

export interface ReencryptionParams {
  handle: string;
  contractAddress: string;
  userAddress: string;
  signature?: string;
}

export interface FHEError {
  code: string;
  message: string;
  details?: any;
}

export interface FHETransaction {
  hash: string;
  blockNumber?: number;
  timestamp?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface EncryptedInput {
  handles: string[];
  inputProof: string;
}
