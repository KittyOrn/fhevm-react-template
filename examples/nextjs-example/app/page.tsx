'use client';

import { useState } from 'react';
import { useFhevm, useEncrypt, useDecrypt, useNetwork } from '@fhevm/sdk';
import { InitState } from '@fhevm/sdk';

export default function Home() {
  const { fhevm, initState, error } = useFhevm();
  const { network, signer } = useNetwork();
  const { encrypt, isEncrypting } = useEncrypt();
  const { decrypt, isDecrypting } = useDecrypt();

  const [inputValue, setInputValue] = useState<string>('');
  const [encryptedResult, setEncryptedResult] = useState<{
    data: Uint8Array;
    proof: Uint8Array;
    type: string;
  } | null>(null);
  const [decryptedValue, setDecryptedValue] = useState<number | null>(null);

  const handleEncrypt = async () => {
    try {
      const value = parseInt(inputValue);
      if (isNaN(value) || value < 0 || value > 255) {
        alert('Please enter a number between 0 and 255');
        return;
      }

      const encrypted = await encrypt.uint8(value);
      setEncryptedResult(encrypted);
      setDecryptedValue(null);
      alert('Value encrypted successfully!');
    } catch (err) {
      console.error('Encryption error:', err);
      alert('Encryption failed: ' + (err as Error).message);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedResult) {
      alert('No encrypted data to decrypt');
      return;
    }

    try {
      const decrypted = await decrypt.uint8(encryptedResult.data);
      setDecryptedValue(decrypted);
      alert('Value decrypted successfully!');
    } catch (err) {
      console.error('Decryption error:', err);
      alert('Decryption failed: ' + (err as Error).message);
    }
  };

  if (initState === InitState.INITIALIZING) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Initializing FHEVM SDK...</p>
        </div>
      </main>
    );
  }

  if (initState === InitState.FAILED) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Initialization Failed</h2>
          <p className="text-gray-700 mb-4">{error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            FHEVM SDK Demo
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Privacy-protected encryption with Zama FHEVM
          </p>
          <p className="text-sm text-gray-500">
            Next.js 14 + @fhevm/sdk Integration
          </p>
        </header>

        {/* Network Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Network Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-500">Network</p>
                <p className="font-semibold text-gray-800">{network || 'Not connected'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${signer ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div>
                <p className="text-sm text-gray-500">Wallet</p>
                <p className="font-semibold text-gray-800">{signer ? 'Connected' : 'Not connected'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Encryption/Decryption Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Encryption Demo</h2>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a number (0-255)
            </label>
            <input
              type="number"
              min="0"
              max="255"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="e.g., 42"
            />
          </div>

          {/* Encrypt Button */}
          <button
            onClick={handleEncrypt}
            disabled={isEncrypting || !inputValue}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-6"
          >
            {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
          </button>

          {/* Encrypted Result */}
          {encryptedResult && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Encrypted Data</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Type: </span>
                  <span className="font-mono text-gray-800">{encryptedResult.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Data Length: </span>
                  <span className="font-mono text-gray-800">{encryptedResult.data.length} bytes</span>
                </div>
                <div>
                  <span className="text-gray-600">Proof Length: </span>
                  <span className="font-mono text-gray-800">{encryptedResult.proof.length} bytes</span>
                </div>
                <div className="pt-2">
                  <span className="text-gray-600">Data Preview: </span>
                  <p className="font-mono text-xs text-gray-800 break-all mt-1">
                    {Array.from(encryptedResult.data.slice(0, 32))
                      .map(b => b.toString(16).padStart(2, '0'))
                      .join('')}...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decrypt Button */}
          {encryptedResult && (
            <button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition mb-6"
            >
              {isDecrypting ? 'Decrypting...' : 'Decrypt Value'}
            </button>
          )}

          {/* Decrypted Result */}
          {decryptedValue !== null && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Decrypted Value</h3>
              <p className="text-3xl font-bold text-green-600">{decryptedValue}</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Client-Side Encryption</h3>
                <p className="text-sm">Your value is encrypted locally using Zama's FHE technology before leaving your device.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Homomorphic Operations</h3>
                <p className="text-sm">The encrypted data can be processed on-chain without ever being decrypted.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Authorized Decryption</h3>
                <p className="text-sm">Only authorized parties can decrypt the results using their private keys.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Private Voting</h3>
              <p className="text-sm text-gray-600">
                Vote on proposals without revealing individual choices
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Sealed Auctions</h3>
              <p className="text-sm text-gray-600">
                Submit bids that remain confidential until reveal
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Confidential DeFi</h3>
              <p className="text-sm text-gray-600">
                Trade and transact with privacy guarantees
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with ❤️ for the Zama FHE Challenge</p>
          <p className="mt-2">
            <a href="https://docs.zama.ai/fhevm" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Learn more about FHEVM
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
