# API Documentation

## Server port:5500



## Response Format

All API responses follow the following unified format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;      // Whether the request was successful
  data?: T;             // Response data
  message?: string;     // Response message
  error?: string;       // Error message
  timestamp: number;    // Timestamp
}
```

### Success Response Example

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Example Data"
  },
  "message": "Operation successful",
  "timestamp": 1703123456789
}
```

### Error Response Example

```json
{
  "success": false,
  "error": "Data not found",
  "timestamp": 1703123456789
}
```

### Pagination Response Example

```json
{
  "success": true,
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "message": "Data retrieved successfully",
  "timestamp": 1703123456789
}
```


## Wallet Related APIs

### Get Application Configuration
- **GET** `/api/wallet/config`
- **Description**: Get application configuration information, including fee collector account, rates, etc.
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "config": {
      "feeCollector": {
        "address": "0x...",
        "configured": true
      },
      "fees": {
        "tradingRate": 0.001,
        "withdrawalRate": 0.0005
      },
      "network": {
        "localNodeUrl": "http://127.0.0.1:8545"
      },
      "contracts": {
        "mockToken": "0x...",
        "vault": "0x...",
        "membership": "0x..."
      }
    },
    "note": "Configuration information for debugging and setup"
  }
}
```

### Get Available Networks
- **GET** `/api/wallet/networks`
- **Description**: Get list of supported blockchain networks
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "networks": [
      {
        "id": 31337,
        "name": "Hardhat Local",
        "rpcUrl": "http://127.0.0.1:8545",
        "chainId": "0x7A69",
        "nativeCurrency": {
          "name": "Ether",
          "symbol": "ETH",
          "decimals": 18
        },
        "blockExplorerUrls": [],
        "isTestnet": true,
        "isLocal": true
      },
      {
        "id": 42161,
        "name": "Arbitrum One",
        "rpcUrl": "https://arb1.arbitrum.io/rpc",
        "chainId": "0xA4B1",
        "nativeCurrency": {
          "name": "Ether",
          "symbol": "ETH",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://arbiscan.io"],
        "isTestnet": false,
        "isLocal": false
      },
      {
        "id": 43114,
        "name": "Avalanche C-Chain",
        "rpcUrl": "https://api.avax.network/ext/bc/C/rpc",
        "chainId": "0xA86A",
        "nativeCurrency": {
          "name": "Avalanche",
          "symbol": "AVAX",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://snowtrace.io"],
        "isTestnet": false,
        "isLocal": false
      },
      {
        "id": 3636,
        "name": "Botanix",
        "rpcUrl": "https://rpc.btxtestchain.com",
        "chainId": "0xE34",
        "nativeCurrency": {
          "name": "Bitcoin",
          "symbol": "BTC",
          "decimals": 18
        },
        "blockExplorerUrls": ["https://testnet.botanixscan.com"],
        "isTestnet": true,
        "isLocal": false
      }
    ],
    "currentNetwork": {
      "chainId": 31337,
      "name": "Hardhat"
    }
  }
}
```

### Get Wallet Balance
- **GET** `/api/wallet/balance`
- **Description**: Get ETH and USDT balance for specified wallet address
- **Query Parameters**:
  - `walletAddress` (required): Wallet address, must be a valid Ethereum address
- **Request Example**:
  ```
  GET /api/wallet/balance?walletAddress=0xe13B97DA8D53CD4456f215526635d0Db35CFB658
  ```
- **Response Example**:
```json
{
  "success": true,
  "data": {
    "walletAddress": "0xe13B97DA8D53CD4456f215526635d0Db35CFB658",
    "balances": {
      "eth": "1.5",
      "usdt": "1000.0"
    }
  }
}
```
- **Error Response Example**:
```json
{
  "success": false,
  "error": "Invalid wallet address",
  "timestamp": 1703123456789
}
```

### Inject Funds to Wallet (Local Test Only)
- **POST** `/api/wallet/inject-funds`
- **Description**: Inject USDT funds to specified wallet (only for local test environment)
- **Request Body**:
```json
{
  "walletAddress": "0x...",
  "amount": "1000"
}
```
- **Response Example**:
```json
{
  "success": false,
  "message": "Fund injection is only available in local test environment. In production, use frontend wallet connection.",
  "note": "This API should be called from frontend with user wallet signature"
}
```
- **Note**: This API is disabled in production environment, only for local testing




## Status Code Reference

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error
- `501` - Not Implemented (e.g., fund injection API in production environment)
