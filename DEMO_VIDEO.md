# Demo Video Guide

This document provides information about the `demo.mp4` video demonstration file.

## Video Content

The demo video (`demo.mp4`) showcases the complete workflow of the Universal FHEVM SDK:

### 1. SDK Installation (0:00 - 0:30)
- Installing the `@fhevm/sdk` package
- Setting up dependencies
- Project initialization

### 2. Next.js Integration (0:30 - 1:30)
- Creating a new Next.js 14 application
- Configuring the `FhevmProvider`
- Setting up the App Router structure
- Importing SDK hooks

### 3. Encryption Demo (1:30 - 2:30)
- Initializing the SDK with Sepolia network
- Encrypting a uint8 value (score 1-10)
- Displaying encrypted data and proof
- Explaining the encryption process

### 4. Smart Contract Interaction (2:30 - 3:30)
- Connecting to the CulturalVoting contract
- Submitting encrypted votes
- Viewing transaction confirmation
- Checking vote status

### 5. Decryption Demo (3:30 - 4:00)
- Requesting decryption authorization
- Decrypting encrypted results
- Displaying decrypted values
- Verifying correctness

### 6. Privacy Voting Example (4:00 - 5:00)
- Complete voting workflow
- Multiple voters submitting encrypted scores
- Admin ending voting round
- Revealing aggregated results while maintaining privacy

### 7. Developer Experience (5:00 - 6:00)
- Showing TypeScript autocomplete
- Demonstrating React hooks
- Error handling examples
- Loading states

## Recording the Demo

### Prerequisites

- Screen recording software (OBS Studio, Loom, or similar)
- Running Next.js application on localhost:3000
- Wallet with Sepolia testnet ETH
- Deployed CulturalVoting contract

### Recording Steps

1. **Setup**
   ```bash
   cd examples/nextjs-example
   npm install
   npm run dev
   ```

2. **Open Browser**
   - Navigate to http://localhost:3000
   - Connect MetaMask wallet
   - Ensure you're on Sepolia testnet

3. **Demo Script**
   - Show SDK initialization
   - Enter a value (e.g., 7) in the input field
   - Click "Encrypt Value" button
   - Show encrypted data output
   - Click "Decrypt Value" button
   - Verify decrypted result matches original

4. **Smart Contract Demo**
   - Navigate to voting interface
   - Submit an encrypted vote
   - Show transaction in MetaMask
   - Confirm transaction
   - Display success message

5. **Code Walkthrough**
   - Open VS Code
   - Show `providers.tsx` configuration
   - Demonstrate `useFhevm()` hook usage
   - Show `useEncrypt()` implementation
   - Display TypeScript types

### Recording Settings

- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30 FPS minimum
- **Format**: MP4 (H.264 codec)
- **Audio**: Clear voiceover explaining each step
- **Duration**: 5-6 minutes
- **File Size**: Target < 100MB

### Editing Checklist

- [ ] Trim unnecessary pauses
- [ ] Add intro slide (SDK name + logo)
- [ ] Add text overlays for key points
- [ ] Highlight important code sections
- [ ] Add transition effects between sections
- [ ] Include background music (optional, subtle)
- [ ] Add outro slide with links

## Video File Location

```
fhevm-react-template/
└── demo.mp4          # Main demonstration video
```

## Fallback: Video Placeholder

If the actual video file is too large for the repository, provide a YouTube/Vimeo link:

### Option 1: YouTube Upload

1. Upload `demo.mp4` to YouTube
2. Set video to "Unlisted" or "Public"
3. Update README with link:
   ```markdown
   ## Video Demo

   Watch the live demonstration: [FHEVM SDK Demo Video](https://youtu.be/YOUR_VIDEO_ID)
   ```

### Option 2: GitHub Release Asset

1. Create a GitHub release
2. Attach `demo.mp4` as release asset
3. Link in README:
   ```markdown
   ## Video Demo

   Download: [demo.mp4](https://github.com/USER/REPO/releases/download/v1.0.0/demo.mp4)
   ```

### Option 3: Cloud Storage

1. Upload to Google Drive, Dropbox, or similar
2. Generate shareable link
3. Update README:
   ```markdown
   ## Video Demo

   View online: [FHEVM SDK Demo](https://drive.google.com/file/d/FILE_ID/view)
   ```

## Video Script

### Opening (0:00 - 0:15)
> "Welcome to the Universal FHEVM SDK demonstration. In this video, I'll show you how to build privacy-protected applications using Zama's Fully Homomorphic Encryption technology."

### Installation (0:15 - 0:45)
> "First, let's install the SDK. Simply run npm install @fhevm/sdk. The SDK is framework-agnostic and works with React, Next.js, Vue, and Node.js."

### Next.js Setup (0:45 - 1:15)
> "We'll use Next.js 14 for this demo. Wrap your app with FhevmProvider, configure the Sepolia network, and you're ready to go."

### Encryption Demo (1:15 - 2:00)
> "Let's encrypt a value. I'll enter 42, click Encrypt, and you can see the encrypted data and zero-knowledge proof. The original value is now protected by FHE."

### Smart Contract (2:00 - 3:00)
> "Now I'll submit this encrypted vote to our smart contract. Notice the vote is submitted without revealing the actual score. The contract stores the encrypted value on-chain."

### Decryption (3:00 - 3:30)
> "Only authorized parties can decrypt. When I request decryption, the SDK verifies my permission and reveals the original value: 42."

### Privacy Model (3:30 - 4:30)
> "Here's the power of FHE: multiple users can submit encrypted votes, the contract aggregates them homomorphically, and only the final result is decrypted. Individual votes remain private."

### Developer Experience (4:30 - 5:30)
> "The SDK provides React hooks like useFhevm, useEncrypt, and useDecrypt. TypeScript support gives you full autocomplete and type safety. Error handling is built-in."

### Closing (5:30 - 6:00)
> "That's the Universal FHEVM SDK. Build privacy-protected dApps with just a few lines of code. Check out the documentation for more examples. Thanks for watching!"

## Technical Requirements

### Software
- OBS Studio (free, open-source)
- Video editing: DaVinci Resolve (free) or Adobe Premiere
- Screen annotation: ScreenBrush or Epic Pen

### Hardware
- Microphone for clear audio
- Sufficient storage for raw footage
- GPU for smooth recording

### Checklist Before Recording
- [ ] Clear browser cache
- [ ] Close unnecessary applications
- [ ] Disable notifications
- [ ] Prepare test data in advance
- [ ] Practice run-through 2-3 times
- [ ] Check audio levels
- [ ] Ensure good lighting (if showing webcam)

## Post-Production

### Editing Steps
1. Import raw footage
2. Cut out mistakes and pauses
3. Add title screen
4. Insert text annotations
5. Color correction (if needed)
6. Add background music (royalty-free)
7. Export to MP4

### Export Settings (DaVinci Resolve)
- Format: MP4
- Codec: H.264
- Resolution: 1920x1080
- Frame Rate: 30 FPS
- Bitrate: 8-10 Mbps
- Audio: AAC, 128-192 kbps

### Quality Check
- [ ] Audio is clear and balanced
- [ ] Video is sharp and smooth
- [ ] Text is readable at 1080p
- [ ] No awkward cuts
- [ ] File size is reasonable
- [ ] Plays correctly on all devices

## Alternative: Animated Demo

If live recording is not feasible, create an animated demo:

1. Use **Remotion** (React-based video generation)
2. Code the demo as React components
3. Render to MP4 programmatically

Example:
```tsx
import { useCurrentFrame } from 'remotion';

export const AnimatedDemo = () => {
  const frame = useCurrentFrame();
  return (
    <div>
      <h1>Frame: {frame}</h1>
      {/* Animated content */}
    </div>
  );
};
```

## Placeholder File

A placeholder `demo.mp4` file will be created with:
- Title screen: "FHEVM SDK Demo Video"
- Instructions: "Full demo coming soon"
- Link to documentation

## Contact

For questions about the demo video:
- GitHub Issues: [Create Issue](https://github.com/zama-ai/fhevm-react-template/issues)
- Discord: [Zama Community](https://discord.fhe.org)

---

**Note**: Replace this placeholder content with the actual `demo.mp4` file before final submission.
