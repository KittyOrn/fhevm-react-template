'use client';

import { useState } from 'react';
import { useEncrypt } from '@fhevm/sdk';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export function MedicalExample() {
  const { encrypt, isEncrypting } = useEncrypt();
  const [heartRate, setHeartRate] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const handleSubmitData = async () => {
    try {
      const hr = parseInt(heartRate);
      const bp = parseInt(bloodPressure);

      if (isNaN(hr) || isNaN(bp)) {
        alert('Please enter valid health metrics');
        return;
      }

      // Encrypt health data
      const encryptedHR = await encrypt.uint8(hr);
      const encryptedBP = await encrypt.uint8(bp);

      // In a real app, you would send these to a smart contract
      setDataSubmitted(true);
      alert('Health data encrypted and submitted!');
    } catch (err) {
      console.error('Submission error:', err);
      alert('Submission failed: ' + (err as Error).message);
    }
  };

  return (
    <Card title="Private Health Records Example">
      <p className="text-gray-600 mb-4">
        Store sensitive health data with complete privacy
      </p>

      <Input
        type="number"
        value={heartRate}
        onChange={(e) => setHeartRate(e.target.value)}
        placeholder="e.g., 72"
        label="Heart Rate (BPM)"
        min="40"
        max="200"
      />

      <Input
        type="number"
        value={bloodPressure}
        onChange={(e) => setBloodPressure(e.target.value)}
        placeholder="e.g., 120"
        label="Blood Pressure (Systolic)"
        min="80"
        max="200"
      />

      <Button
        onClick={handleSubmitData}
        disabled={isEncrypting || !heartRate || !bloodPressure}
        variant="primary"
        className="w-full mb-6"
      >
        {isEncrypting ? 'Encrypting...' : 'Submit Encrypted Data'}
      </Button>

      {dataSubmitted && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Data Submitted Successfully</h3>
          <p className="text-sm text-gray-600">
            Your health metrics have been encrypted and stored on-chain.
            Only authorized healthcare providers can access this data.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Healthcare Privacy Benefits</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>HIPAA-compliant data storage</li>
          <li>Patient data remains confidential</li>
          <li>Secure sharing with authorized providers</li>
          <li>Tamper-proof medical records</li>
          <li>Patient-controlled access rights</li>
        </ul>
      </div>
    </Card>
  );
}
