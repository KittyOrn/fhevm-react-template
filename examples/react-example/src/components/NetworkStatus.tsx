import { useFhevm, useNetwork } from '@fhevm/sdk';
import { InitState } from '@fhevm/sdk';

function NetworkStatus() {
  const { initState, error } = useFhevm();
  const { network, signer } = useNetwork();

  const getStatusColor = () => {
    switch (initState) {
      case InitState.INITIALIZED:
        return '#10b981';
      case InitState.INITIALIZING:
        return '#f59e0b';
      case InitState.FAILED:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (initState) {
      case InitState.INITIALIZED:
        return 'Connected';
      case InitState.INITIALIZING:
        return 'Connecting...';
      case InitState.FAILED:
        return 'Failed';
      default:
        return 'Not Connected';
    }
  };

  return (
    <div className="card">
      <h2>Network Status</h2>

      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">Status:</span>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor() }}
          >
            {getStatusText()}
          </span>
        </div>

        {network && (
          <div className="status-item">
            <span className="status-label">Network:</span>
            <span className="status-value">{network}</span>
          </div>
        )}

        <div className="status-item">
          <span className="status-label">Wallet:</span>
          <span className="status-value">
            {signer ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-box">
          <strong>Error:</strong> {error.message}
        </div>
      )}
    </div>
  );
}

export default NetworkStatus;
