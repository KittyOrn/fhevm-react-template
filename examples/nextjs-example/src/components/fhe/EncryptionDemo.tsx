'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function EncryptionDemo() {
  const { encrypt, isEncrypting } = useEncrypt();
  const [inputValue, setInputValue] = useState<string>('');
  const [encryptedData, setEncryptedData] = useState<{
    data: Uint8Array;
    proof: Uint8Array;
    type: string;
  } | null>(null);

  const handleEncrypt = async () => {
    try {
      const value = parseInt(inputValue);
      if (isNaN(value) || value < 0 || value > 255) {
        alert('Please enter a number between 0 and 255');
        return;
      }

      const encrypted = await encrypt.uint8(value);
      setEncryptedData(encrypted);
      alert('Value encrypted successfully!');
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Encryption failed: ' + (err as Error).message);
    }
  };

  return (
    <Card title="Encryption Demo">
      <Input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a number (0-255)"
        label="Value to encrypt"
        min="0"
        max="255"
      />

      <Button
        onClick={handleEncrypt}
        disabled={isEncrypting || !inputValue}
        variant="primary"
        className="w-full mb-6"
      >
        {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
      </Button>

      {encryptedData && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">Encrypted Data</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Type: </span>
              <span className="font-mono text-gray-800">{encryptedData.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Data Length: </span>
              <span className="font-mono text-gray-800">{encryptedData.data.length} bytes</span>
            </div>
            <div>
              <span className="text-gray-600">Proof Length: </span>
              <span className="font-mono text-gray-800">{encryptedData.proof.length} bytes</span>
            </div>
            <div className="pt-2">
              <span className="text-gray-600">Data Preview: </span>
              <p className="font-mono text-xs text-gray-800 break-all mt-1">
                {Array.from(encryptedData.data.slice(0, 32))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('')}...
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
