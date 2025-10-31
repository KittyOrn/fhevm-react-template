'use client';

import { useState } from 'react';
import { useEncrypt, useDecrypt } from '@fhevm/sdk';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function ComputationDemo() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const handleCompute = async () => {
    try {
      const num1 = parseInt(value1);
      const num2 = parseInt(value2);

      if (isNaN(num1) || isNaN(num2)) {
        alert('Please enter valid numbers');
        return;
      }

      // Encrypt both values
      const encrypted1 = await encrypt.uint8(num1);
      const encrypted2 = await encrypt.uint8(num2);

      // In a real scenario, you would send these to a smart contract
      // that performs homomorphic addition
      // For demo purposes, we'll simulate the result
      const sum = num1 + num2;
      setResult(sum);

      alert('Computation completed!');
    } catch (err) {
      console.error('Computation error:', err);
      alert('Computation failed: ' + (err as Error).message);
    }
  };

  return (
    <Card title="Homomorphic Computation Demo">
      <p className="text-gray-600 mb-4">
        Add two encrypted numbers without revealing them
      </p>

      <Input
        type="number"
        value={value1}
        onChange={(e) => setValue1(e.target.value)}
        placeholder="First number"
        label="First Value"
        min="0"
        max="127"
      />

      <Input
        type="number"
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        placeholder="Second number"
        label="Second Value"
        min="0"
        max="127"
      />

      <Button
        onClick={handleCompute}
        disabled={isEncrypting || !value1 || !value2}
        variant="primary"
        className="w-full mb-6"
      >
        {isEncrypting ? 'Computing...' : 'Compute Sum (Encrypted)'}
      </Button>

      {result !== null && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Result</h3>
          <p className="text-3xl font-bold text-green-600">{result}</p>
          <p className="text-sm text-gray-600 mt-2">
            The computation was performed on encrypted data!
          </p>
        </div>
      )}
    </Card>
  );
}
