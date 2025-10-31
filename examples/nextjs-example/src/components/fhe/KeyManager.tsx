'use client';

import { useState, useEffect } from 'react';
import { useFhevm } from '@fhevm/sdk';
import { Card } from '../ui/Card';

export function KeyManager() {
  const { fhevm, initState } = useFhevm();
  const [keyInfo, setKeyInfo] = useState<{
    publicKey: string;
    hasKeys: boolean;
  } | null>(null);

  useEffect(() => {
    const loadKeyInfo = async () => {
      if (fhevm) {
        try {
          // In a real implementation, you would fetch actual key information
          setKeyInfo({
            publicKey: 'Public Key Available',
            hasKeys: true,
          });
        } catch (err) {
          console.error('Failed to load key info:', err);
        }
      }
    };

    loadKeyInfo();
  }, [fhevm]);

  return (
    <Card title="Key Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Public Key Status</p>
            <p className="text-sm text-gray-600">FHE public key for encryption</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            keyInfo?.hasKeys ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {keyInfo?.hasKeys ? 'Loaded' : 'Not Available'}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Key Information</h4>
          <p className="text-sm text-gray-600">
            The SDK automatically manages encryption keys for you.
            Keys are loaded during initialization and used for all encryption operations.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Security Note</h4>
          <p className="text-sm text-blue-700">
            Private keys never leave your device. All encryption happens client-side.
          </p>
        </div>
      </div>
    </Card>
  );
}
