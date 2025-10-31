import { FhevmProvider } from '@fhevm/sdk';
import EncryptionDemo from './components/EncryptionDemo';
import NetworkStatus from './components/NetworkStatus';
import './App.css';

function App() {
  return (
    <FhevmProvider config={{ network: 'sepolia' }}>
      <div className="app">
        <header className="app-header">
          <h1>🔐 React FHEVM SDK Example</h1>
          <p>Demonstrating Fully Homomorphic Encryption in React</p>
        </header>

        <main className="app-main">
          <NetworkStatus />
          <EncryptionDemo />
        </main>

        <footer className="app-footer">
          <p>Built with @fhevm/sdk for Zama FHE Challenge</p>
        </footer>
      </div>
    </FhevmProvider>
  );
}

export default App;
