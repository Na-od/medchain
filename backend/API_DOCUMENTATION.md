# MedChain Ethiopia - API Documentation

Complete API reference for the Blockchain-Based Prescription Verification System.

---

## Base URL

```
Development: http://localhost:5000
Production: https://api.medchain.et
```

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": [ ... ]  // Optional validation errors
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "Dr. Abebe Kebede",
  "email": "abebe@hospital.et",
  "password": "SecurePass123",
  "role": "doctor",
  "license": "ETH-MED-12345",
  "walletAddress": "0x1234..."  // Optional
}
```

**Roles:** `doctor`, `patient`, `pharmacist`

**Response (201):**

```json
{
  "message": "Registration successful. Pending admin approval.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Abebe Kebede",
    "email": "abebe@hospital.et",
    "role": "doctor",
    "approved": false
  }
}
```

**Notes:**
- Doctors and pharmacists require admin approval
- Patients are auto-approved
- License required for doctors/pharmacists

---

### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "abebe@hospital.et",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Abebe Kebede",
    "email": "abebe@hospital.et",
    "role": "doctor",
    "approved": true,
    "walletAddress": "0x1234..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Codes:**
- `401` - Invalid credentials
- `403` - Account pending approval
- `429` - Too many login attempts

---

### GET /auth/profile

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Abebe Kebede",
    "email": "abebe@hospital.et",
    "role": "doctor",
    "license": "ETH-MED-12345",
    "approved": true,
    "walletAddress": "0x1234...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### POST /auth/link-wallet

Link Ethereum wallet to user account.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response (200):**

```json
{
  "message": "Wallet linked successfully",
  "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb"
}
```

---

## Prescription Endpoints

### POST /prescriptions

Create a new prescription (Doctor only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "patientId": "507f1f77bcf86cd799439022",
  "drugs": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "duration": "7 days"
    },
    {
      "name": "Paracetamol",
      "dosage": "1g",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    }
  ],
  "expiryDate": "2024-02-15T00:00:00Z",
  "notes": "Take after meals. Complete full course."
}
```

**Response (201):**

```json
{
  "message": "Prescription created successfully",
  "prescription": {
    "id": "507f1f77bcf86cd799439033",
    "hash": "0x8f7d...a3b2",
    "cid": "QmX4z...k9m2",
    "txHash": "0x9a2b...c4d5",
    "expiryDate": "2024-02-15T00:00:00Z",
    "status": "active",
    "qrCode": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

**Process:**
1. Validates patient exists
2. Encrypts and uploads to IPFS
3. Generates hash
4. Stores hash on Base blockchain
5. Generates QR code
6. Saves to database

---

### GET /prescriptions

Get prescriptions (filtered by role).

**Headers:** `Authorization: Bearer <token>`

**Response (200) - Doctor:**

```json
{
  "prescriptions": [
    {
      "id": "507f1f77bcf86cd799439033",
      "hash": "0x8f7d...a3b2",
      "cid": "QmX4z...k9m2",
      "status": "active",
      "expiryDate": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "patient": {
        "name": "Kebede Alemu",
        "email": "kebede@gmail.com"
      }
    }
  ]
}
```

**Access Rules:**
- **Doctor:** See own prescriptions
- **Patient:** See prescriptions for self
- **Pharmacist/Admin:** See all prescriptions

---

### GET /prescriptions/:id

Get single prescription details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "prescription": {
    "id": "507f1f77bcf86cd799439033",
    "hash": "0x8f7d9a2b...c4d5e6f7",
    "cid": "QmX4zY7w...k9m2n3p4",
    "txHash": "0x9a2b3c4d...e5f6a7b8",
    "status": "active",
    "expiryDate": "2024-02-15T00:00:00Z",
    "drugs": [
      {
        "name": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days"
      }
    ],
    "notes": "Take after meals",
    "doctor": {
      "name": "Dr. Abebe Kebede",
      "email": "abebe@hospital.et",
      "license": "ETH-MED-12345"
    },
    "patient": {
      "name": "Kebede Alemu",
      "email": "kebede@gmail.com"
    },
    "dispensedAt": null,
    "dispensedBy": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "qrCode": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

---

### POST /prescriptions/:id/cancel

Cancel a prescription (Doctor only, own prescriptions).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "message": "Prescription cancelled successfully",
  "prescription": {
    "id": "507f1f77bcf86cd799439033",
    "status": "cancelled"
  }
}
```

---

### POST /prescriptions/verify

Verify prescription authenticity (Pharmacist/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "hash": "0x8f7d9a2b...c4d5e6f7",
  "cid": "QmX4zY7w...k9m2n3p4"
}
```

**Response (200) - Valid:**

```json
{
  "valid": true,
  "reason": "VALID",
  "message": "Prescription is valid and ready for dispensing",
  "prescription": {
    "hash": "0x8f7d9a2b...c4d5e6f7",
    "cid": "QmX4zY7w...k9m2n3p4",
    "drugs": [
      {
        "name": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "3 times daily",
        "duration": "7 days"
      }
    ],
    "notes": "Take after meals",
    "expiryDate": "2024-02-15T00:00:00Z",
    "doctor": {
      "name": "Dr. Abebe Kebede",
      "license": "ETH-MED-12345"
    },
    "blockchain": {
      "status": 1,
      "timestamp": 1705317000,
      "creator": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    }
  }
}
```

**Response (200) - Invalid:**

```json
{
  "valid": false,
  "reason": "USED",
  "message": "Prescription has already been dispensed"
}
```

**Reasons:**
- `VALID` - Ready to dispense
- `USED` - Already dispensed
- `EXPIRED` - Past expiry date
- `INVALID` - Hash mismatch or not found

---

### POST /prescriptions/dispense

Dispense a prescription (Pharmacist only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "prescriptionId": "507f1f77bcf86cd799439033",
  "hash": "0x8f7d9a2b...c4d5e6f7"
}
```

**Response (200):**

```json
{
  "message": "Prescription dispensed successfully",
  "dispensed": {
    "prescriptionId": "507f1f77bcf86cd799439033",
    "hash": "0x8f7d9a2b...c4d5e6f7",
    "dispensedAt": "2024-01-16T14:22:00Z",
    "dispensedBy": "507f1f77bcf86cd799439044",
    "blockchainTx": "0x3e4f5a6b...c7d8e9f0"
  }
}
```

**Process:**
1. Verifies prescription exists
2. Checks not already dispensed
3. Checks not expired
4. Marks as used on blockchain
5. Updates database

---

## Admin Endpoints

### GET /admin/users/pending

Get pending doctor/pharmacist approvals.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response (200):**

```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Dr. Abebe Kebede",
      "email": "abebe@hospital.et",
      "role": "doctor",
      "license": "ETH-MED-12345",
      "walletAddress": "0x742d35...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /admin/users/approve

Approve or reject a pending user.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "approved": true
}
```

**Response (200):**

```json
{
  "message": "User approved successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Abebe Kebede",
    "email": "abebe@hospital.et",
    "role": "doctor",
    "approved": true
  }
}
```

---

### GET /admin/users

List all users with filtering and pagination.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `role` - Filter by role (doctor, patient, pharmacist, admin)
- `approved` - Filter by approval status (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response (200):**

```json
{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

---

### POST /admin/users/:id/revoke

Revoke user access.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response (200):**

```json
{
  "message": "User access revoked successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Abebe Kebede",
    "approved": false
  }
}
```

---

### GET /admin/stats

Get system statistics.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response (200):**

```json
{
  "users": {
    "byRole": [
      { "_id": "doctor", "count": 25, "approved": 20, "pending": 5 },
      { "_id": "patient", "count": 150, "approved": 150, "pending": 0 },
      { "_id": "pharmacist", "count": 10, "approved": 8, "pending": 2 }
    ],
    "total": 185
  },
  "prescriptions": {
    "byStatus": [
      { "_id": "active", "count": 45 },
      { "_id": "used", "count": 120 },
      { "_id": "expired", "count": 15 }
    ],
    "total": 180,
    "active": 45,
    "used": 120,
    "expired": 15
  },
  "blockchain": {
    "connected": true,
    "totalPrescriptions": 180,
    "walletBalance": "0.5",
    "walletAddress": "0x1234..."
  }
}
```

---

## Health Check

### GET /health

Check API health status.

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "medchain-ethiopia-backend",
  "version": "1.0.0"
}
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate or already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Blockchain/IPFS issue |

---

## Rate Limits

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 | 15 minutes |
| Authentication | 10 | 15 minutes |
| Prescription Creation | 20 | 1 minute |
| Verification | 60 | 1 minute |
| Admin Actions | 30 | 1 minute |

---

## QR Code Format

QR codes contain a verification URL:

```
https://api.medchain.et/prescriptions/verify?hash=0x8f7d...&cid=QmX4z...
```

**Scanning:**
1. Pharmacist scans QR code
2. System extracts hash and CID
3. Calls verify endpoint
4. Displays result

---

## Blockchain Integration

### Contract Address

- **Base Sepolia:** `0x...` (from deployment)
- **Base Mainnet:** `0x...` (from deployment)

### Functions

| Function | Description |
|----------|-------------|
| `createPrescription(hash)` | Store prescription hash |
| `verifyPrescription(hash)` | Check status |
| `markAsUsed(hash)` | Mark dispensed |

### Events

| Event | Description |
|-------|-------------|
| `PrescriptionCreated` | New prescription stored |
| `PrescriptionUsed` | Prescription dispensed |

---

## Support

For API support, contact: support@medchain.et
