import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

export interface VaultPool {
  id: number;
  owner: string;
  totalBalance: string;
  isActive: boolean;
  createdAt: number;
  lastActivityAt: number;
}

export interface VaultConfig {
  maxPoolsPerUser: number;
  minPoolBalance: string;
  feeRate: number;
  feeCollector: string;
  supportedTokens: {
    mockToken: string;
    isSupported: boolean;
  };
}

export interface VaultTransaction {
  poolId: number;
  walletAddress: string;
  amount: string;
  tokenAddress: string;
  transactionHash: string;
  message: string;
}

export interface ApprovalStatus {
  walletAddress: string;
  tokenAddress: string;
  balance: string;
  allowance: string;
  needsApproval: boolean;
}

export interface TransactionData {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  chainId: number;
  nonce: number;
  type: number;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  functionName: string;
  args: any[];
  network: {
    id: number;
    name: string;
    rpcUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
}

// Utility function to execute transaction with wagmi v2
export async function executeVaultTransaction(
  walletClient: any,
  transactionData: TransactionData
): Promise<string> {
  if (!walletClient) {
    throw new Error('No wallet client available');
  }

  // Build transaction object for wagmi v2
  const transaction = {
    to: transactionData.to as `0x${string}`,
    data: transactionData.data as `0x${string}`,
    value: BigInt(transactionData.value),
    gas: BigInt(transactionData.gasLimit),
    chainId: transactionData.chainId,
    type: 'eip1559' as const,
    maxFeePerGas: BigInt(transactionData.maxFeePerGas),
    maxPriorityFeePerGas: BigInt(transactionData.maxPriorityFeePerGas)
  };

  // Send transaction with wallet signature
  const hash = await walletClient.sendTransaction(transaction);
  
  return hash;
}

export class VaultApiService {
  static async getVaultConfig(): Promise<VaultConfig | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/config`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch vault config');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  static async getUserPools(walletAddress: string, networkId: number = 31337): Promise<VaultPool[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/pools?walletAddress=${encodeURIComponent(walletAddress)}&networkId=${networkId}`);

      if (response.data.success) {
        return response.data.data.pools;
      } else {
        throw new Error(response.data.error || 'Failed to fetch user pools');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  static async getPoolDetails(poolId: number, networkId: number = 31337): Promise<VaultPool | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/pools/${poolId}?networkId=${networkId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch pool details');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Transaction preparation methods
  static async prepareCreatePool(walletAddress: string, initialAmount: string, tokenAddress?: string, networkId: number = 31337): Promise<TransactionData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/prepare-create`, {
        walletAddress,
        initialAmount,
        tokenAddress: tokenAddress,
        networkId
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to prepare create pool transaction');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async prepareDeletePool(poolId: number, walletAddress: string, networkId: number = 31337): Promise<TransactionData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/prepare-delete`, {
        walletAddress,
        networkId
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to prepare delete pool transaction');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async prepareDepositTransaction(poolId: number, walletAddress: string, amount: string, tokenAddress?: string, networkId: number = 31337): Promise<TransactionData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/prepare-deposit`, {
        walletAddress,
        amount,
        tokenAddress: tokenAddress,
        networkId
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to prepare deposit transaction');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async prepareWithdrawTransaction(poolId: number, walletAddress: string, amount: string, tokenAddress?: string, networkId: number = 31337): Promise<TransactionData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/prepare-withdraw`, {
        walletAddress,
        amount,
        tokenAddress: tokenAddress,
        networkId
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to prepare withdraw transaction');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async prepareMergePools(walletAddress: string, targetPoolId: number, sourcePoolId: number, networkId: number = 31337): Promise<TransactionData> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/prepare-merge`, {
        walletAddress,
        targetPoolId,
        sourcePoolId,
        networkId
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to prepare merge pools transaction');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Legacy methods (for backward compatibility)
  static async createPool(walletAddress: string, initialAmount: string, tokenAddress?: string): Promise<{ poolId: number; transactionHash: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools`, {
        walletAddress,
        initialAmount,
        tokenAddress: tokenAddress
      });

      if (response.data.success) {
        return {
          poolId: response.data.data.poolId,
          transactionHash: response.data.data.transactionHash
        };
      } else {
        throw new Error(response.data.error || 'Failed to create pool');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async deletePool(poolId: number, walletAddress: string): Promise<{ transactionHash: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/vault/pools/${poolId}`, {
        data: { walletAddress }
      });

      if (response.data.success) {
        return {
          transactionHash: response.data.data.transactionHash
        };
      } else {
        throw new Error(response.data.error || 'Failed to delete pool');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async mergePools(walletAddress: string, targetPoolId: number, sourcePoolId: number): Promise<{ transactionHash: string }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/vault/pools/merge`, {
        walletAddress,
        targetPoolId,
        sourcePoolId
      });

      if (response.data.success) {
        return {
          transactionHash: response.data.data.transactionHash
        };
      } else {
        throw new Error(response.data.error || 'Failed to merge pools');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async depositFunds(poolId: number, walletAddress: string, amount: string, tokenAddress?: string): Promise<{ transactionHash: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/deposit`, {
        walletAddress,
        amount,
        tokenAddress: tokenAddress
      });

      if (response.data.success) {
        return {
          transactionHash: response.data.data.transactionHash
        };
      } else {
        throw new Error(response.data.error || 'Failed to deposit funds');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async withdrawFunds(poolId: number, walletAddress: string, amount: string, tokenAddress?: string): Promise<{ transactionHash: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/withdraw`, {
        walletAddress,
        amount,
        tokenAddress: tokenAddress
      });

      if (response.data.success) {
        return {
          transactionHash: response.data.data.transactionHash
        };
      } else {
        throw new Error(response.data.error || 'Failed to withdraw funds');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async getApprovalStatus(walletAddress: string, tokenAddress?: string, networkId: number = 31337): Promise<ApprovalStatus | null> {
    try {
      const url = tokenAddress
        ? `${API_BASE_URL}/vault/approval-status?walletAddress=${encodeURIComponent(walletAddress)}&tokenAddress=${encodeURIComponent(tokenAddress)}&networkId=${networkId}`
        : `${API_BASE_URL}/vault/approval-status?walletAddress=${encodeURIComponent(walletAddress)}&networkId=${networkId}`;

      const response = await axios.get(url);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch approval status');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }
}
