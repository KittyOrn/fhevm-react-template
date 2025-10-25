import { useState } from 'react';
import { useEncrypt, useDecrypt, InitState } from '@fhevm/sdk';
import { useFhevm } from '@fhevm/sdk';

function EncryptionDemo() {
  const { initState } = useFhevm();
  const { encrypt, isEncrypting, error: encryptError } = useEncrypt();
  const { decrypt, isDecrypting, error: decryptError } = useDecrypt();

  const [inputValue, setInputValue] = useState<number>(42);
  const [encryptedData, setEncryptedData] = useState<Uint8Array | null>(null);
  const [decryptedValue, setDecryptedValue] = useState<number | null>(null);

  const handleEncrypt = async () => {
    try {
      setDecryptedValue(null);
      const encrypted = await encrypt.uint8(inputValue);
      setEncryptedData(encrypted.data);
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedData) return;

    try {
      const result = await decrypt.uint8(encryptedData);
      setDecryptedValue(result);
    } catch (err) {
      console.error('Decryption failed:', err);
    }
  };

  const handleReset = () => {
    setEncryptedData(null);
    setDecryptedValue(null);
    setInputValue(42);
  };

  const isReady = initState === InitState.INITIALIZED;

  return (
    <div className="card">
      <h2>Encryption Demo</h2>
      <p className="card-description">
        Encrypt and decrypt values using Fully Homomorphic Encryption
      </p>

      {!isReady && (
        <div className="warning-box">
          SDK is initializing... Please wait.
        </div>
      )}

      <div className="demo-section">
        <div className="input-group">
          <label htmlFor="value-input">
            Value to Encrypt (0-255):
          </label>
          <input
            id="value-input"
            type="number"
            min="0"
            max="255"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            disabled={!isReady || isEncrypting}
            className="number-input"
          />
        </div>

        <button
          onClick={handleEncrypt}
          disabled={!isReady || isEncrypting || inputValue < 0 || inputValue > 255}
          className="btn btn-primary"
        >
          {isEncrypting ? '🔄 Encrypting...' : '🔐 Encrypt Value'}
        </button>

        {encryptError && (
          <div className="error-box">
            <strong>Encryption Error:</strong> {encryptError.message}
          </div>
        )}
      </div>

      {encryptedData && (
        <div className="demo-section">
          <div className="result-box">
            <h3>Encrypted Data</h3>
            <div className="encrypted-display">
              {Array.from(encryptedData.slice(0, 32))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join(' ')}
              {encryptedData.length > 32 && '...'}
            </div>
            <p className="result-info">
              Length: {encryptedData.length} bytes
            </p>
          </div>

          <button
            onClick={handleDecrypt}
            disabled={isDecrypting || !isReady}
            className="btn btn-secondary"
          >
            {isDecrypting ? '🔄 Decrypting...' : '🔓 Decrypt Value'}
          </button>

          {decryptError && (
            <div className="error-box">
              <strong>Decryption Error:</strong> {decryptError.message}
            </div>
          )}
        </div>
      )}

      {decryptedValue !== null && (
        <div className="demo-section">
          <div className="success-box">
            <h3>Decrypted Value</h3>
            <div className="decrypted-value">{decryptedValue}</div>
            {decryptedValue === inputValue && (
              <p className="success-message">
                ✅ Successfully decrypted! Value matches original.
              </p>
            )}
          </div>

          <button onClick={handleReset} className="btn btn-outline">
            🔄 Reset
          </button>
        </div>
      )}

      <div className="info-section">
        <h3>How it works</h3>
        <ol className="info-list">
          <li>Enter a value between 0-255</li>
          <li>Click "Encrypt Value" to encrypt using FHE</li>
          <li>The encrypted data is displayed in hexadecimal</li>
          <li>Click "Decrypt Value" to decrypt and verify</li>
          <li>The original value is recovered!</li>
        </ol>
      </div>
    </div>
  );
}

export default EncryptionDemo;
