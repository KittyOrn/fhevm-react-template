'use client';

import { useState } from 'react';
import { useEncrypt, useDecrypt } from '@fhevm/sdk';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function BankingExample() {
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();
  const [balance, setBalance] = useState<string>('1000');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [encryptedBalance, setEncryptedBalance] = useState<Uint8Array | null>(null);

  const handleTransfer = async () => {
    try {
      const amount = parseInt(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid transfer amount');
        return;
      }

      // Encrypt the transfer amount
      const encrypted = await encrypt.uint32(amount);
      setEncryptedBalance(encrypted.data);

      alert('Transfer encrypted and ready to send!');
    } catch (err) {
      console.error('Transfer error:', err);
      alert('Transfer failed: ' + (err as Error).message);
    }
  };

  return (
    <Card title="Private Banking Example">
      <p className="text-gray-600 mb-4">
        Transfer funds privately using encrypted amounts
      </p>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="text-2xl font-bold text-blue-600">${balance}</p>
      </div>

      <Input
        type="number"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
        placeholder="Amount to transfer"
        label="Transfer Amount ($)"
        min="1"
      />

      <Button
        onClick={handleTransfer}
        disabled={isEncrypting || !transferAmount}
        variant="success"
        className="w-full mb-6"
      >
        {isEncrypting ? 'Processing...' : 'Encrypt & Transfer'}
      </Button>

      {encryptedBalance && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Transfer Encrypted</h3>
          <p className="text-sm text-gray-600 mb-2">
            Your transfer amount is now encrypted and ready to be sent to the blockchain.
          </p>
          <p className="font-mono text-xs text-gray-800 break-all">
            {Array.from(encryptedBalance.slice(0, 32))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('')}...
          </p>
        </div>
      )}

      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Why This Matters</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Transfer amounts remain private on-chain</li>
          <li>Only authorized parties can view balances</li>
          <li>Prevents front-running and MEV attacks</li>
          <li>Maintains regulatory compliance with privacy</li>
        </ul>
      </div>
    </Card>
  );
}
