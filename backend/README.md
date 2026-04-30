# MedChain Ethiopia - Backend

**Blockchain-Based Prescription Verification System**

A production-ready backend for secure digital prescriptions using Base blockchain, IPFS storage, and QR code verification.

---

## Architecture Overview

```
┌─────────────────┐
│   Frontend App  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Backend                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  Auth API   │ │Prescription │ │    Admin API        │   │
│  │  (JWT)      │ │    API      │ │                     │   │
│  └──────┬──────┘ └──────┬──────┘ └──────────┬──────────┘   │
│         └─────────────────┴─────────────────────┘             │
│                         │                                   │
│    ┌────────────────────┼────────────────────┐               │
│    │              Services                   │               │
│    │  ┌──────────┐ ┌──────────┐ ┌─────────┐ │               │
│    │  │Blockchain│ │  IPFS    │ │  QR Code│ │               │
│    │  │ Ethers.js│ │ Pinata  │ │Generator│ │               │
│    │  └────┬─────┘ └────┬─────┘ └────┬────┘ │               │
│    └───────┼────────────┼────────────┼──────┘               │
│            │            │            │                       │
└────────────┼────────────┼────────────┼───────────────────────┘
             │            │            │
             ▼            ▼            │
     ┌───────────────┐  ┌─────────┐    │
     │ Base Blockchain│  │  IPFS   │◄───┘
     │  (Sepolia/Main)│  │ Gateway │
     └───────────────┘  └─────────┘
```

---

## Project Structure

```
backend/
├── contracts/                  # Hardhat smart contracts
│   ├── PrescriptionRegistry.sol
│   ├── hardhat.config.ts
│   ├── package.json
│   ├── scripts/
│   │   └── deploy.ts
│   └── test/
│       └── PrescriptionRegistry.test.ts
├── src/
│   ├── config/
│   │   └── index.ts            # Environment configuration
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── prescriptionController.ts
│   │   └── adminController.ts
│   ├── middleware/
│   │   ├── auth.ts            # JWT & RBAC
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validation.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Prescription.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── prescriptions.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── blockchain.ts      # Ethers.js integration
│   │   └── ipfs.ts            # Pinata IPFS service
│   ├── utils/
│   │   ├── logger.ts          # Winston logger
│   │   └── qrCode.ts          # QR generation
│   └── index.ts               # Entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0
- **Base Wallet** with ETH (Sepolia for testing)
- **Pinata Account** (for IPFS)

---

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Deploy Smart Contract

```bash
# Deploy to Base Sepolia
cd contracts
npx hardhat run scripts/deploy.ts --network baseSepolia

# Or deploy to Base Mainnet
npx hardhat run scripts/deploy.ts --network baseMainnet
```

### 4. Start Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/profile` | Get current user | JWT |
| POST | `/auth/link-wallet` | Link wallet address | JWT |

### Prescriptions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/prescriptions` | Create prescription | Doctor |
| GET | `/prescriptions` | List prescriptions | JWT |
| GET | `/prescriptions/:id` | Get prescription | JWT |
| POST | `/prescriptions/:id/cancel` | Cancel prescription | Doctor |
| POST | `/prescriptions/verify` | Verify prescription | Pharmacist |
| POST | `/prescriptions/dispense` | Dispense prescription | Pharmacist |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/users/pending` | Pending approvals | Admin |
| POST | `/admin/users/approve` | Approve/reject user | Admin |
| GET | `/admin/users` | List all users | Admin |
| POST | `/admin/users/:id/revoke` | Revoke access | Admin |
| GET | `/admin/stats` | System statistics | Admin |

---

## Smart Contract

### PrescriptionRegistry (Solidity)

```solidity
// Gas-optimized contract for Base blockchain

struct Prescription {
    bytes32 hash;        // Prescription hash
    uint256 timestamp;   // Creation time
    bool isUsed;         // Dispensing status
    address creator;     // Doctor address
}

// Key Functions
- createPrescription(bytes32 hash)      // Store hash
- verifyPrescription(bytes32 hash)      // Check status
- markAsUsed(bytes32 hash)              // Mark dispensed
- batchCreatePrescriptions(bytes32[])    // Bulk create (gas efficient)

// Events
- PrescriptionCreated(hash, creator, timestamp)
- PrescriptionUsed(hash, dispenser, timestamp)
```

**Gas Optimizations:**
- Stores only hashes (not full data)
- Batch operations for multiple prescriptions
- Optimized for Base's low gas costs
- Events for off-chain indexing

---

## Prescription Flow

```
1. Doctor creates prescription
   ↓
2. Data encrypted → IPFS (Pinata)
   ↓
3. CID received
   ↓
4. Hash generated: keccak256(CID + doctorId + timestamp)
   ↓
5. Hash stored on Base blockchain
   ↓
6. QR code generated (hash + CID + txHash)
   ↓
7. Prescription saved to MongoDB
```

## Verification Flow

```
1. Pharmacist scans QR code
   ↓
2. Extract hash & CID
   ↓
3. Verify on Base blockchain
   ↓
4. Fetch encrypted data from IPFS
   ↓
5. Recompute hash & compare
   ↓
6. Check expiry date
   ↓
7. Return: VALID / EXPIRED / USED / INVALID
```

---

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/medchain_ethiopia

# JWT
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=24h

# Base Blockchain
BASE_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=0x...

# IPFS (Pinata)
PINATA_API_KEY=your_key
PINATA_API_SECRET=your_secret
PINATA_JWT=your_jwt

# Encryption
ENCRYPTION_KEY=your_32_char_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Security Features

- ✅ **JWT Authentication** with role-based access
- ✅ **bcrypt** password hashing (12 rounds)
- ✅ **Rate limiting** per endpoint type
- ✅ **Helmet** security headers
- ✅ **Input validation** with express-validator
- ✅ **IPFS encryption** before upload
- ✅ **Hash verification** on blockchain
- ✅ **Double-dispensing prevention**

---

## Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Compile TypeScript
npm start                # Start compiled app

# Contracts
npm run compile:contracts # Compile Solidity
npm run deploy:sepolia    # Deploy to Base Sepolia
npm run deploy:mainnet    # Deploy to Base Mainnet
npm run test:contracts    # Run contract tests
```

---

## Deployment Checklist

- [ ] Set strong JWT_SECRET (min 32 chars)
- [ ] Configure production MongoDB
- [ ] Deploy contract to Base Mainnet
- [ ] Update CONTRACT_ADDRESS in .env
- [ ] Fund wallet with ETH on Base
- [ ] Configure Pinata API keys
- [ ] Set up logging (CloudWatch/etc)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring/alerts

---

## License

MIT - MedChain Ethiopia Project
