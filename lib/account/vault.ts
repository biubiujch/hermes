import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

export interface VaultConfig {
  maxPoolsPerUser: number;
  minPoolBalance: string;
  feeRate: number;
  feeCollector: string;
  supportedTokens: {
    [key: string]: string | boolean;
    isSupported: boolean;
  };
}

export interface Pool {
  id: number;
  owner: string;
  totalBalance: string;
  isActive: boolean;
  createdAt: number;
  lastActivityAt: number;
}

export interface UserPools {
  walletAddress: string;
  totalPools: number;
  pools: Pool[];
}

export interface CreatePoolRequest {
  walletAddress: string;
  initialAmount: string;
  tokenAddress?: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface CreatePoolResponse {
  poolId: number;
  walletAddress: string;
  initialAmount: string;
  transactionHash: string;
  message: string;
}

export interface DeletePoolRequest {
  walletAddress: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface MergePoolsRequest {
  walletAddress: string;
  targetPoolId: number;
  sourcePoolId: number;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface DepositRequest {
  walletAddress: string;
  amount: string;
  tokenAddress?: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface WithdrawRequest {
  walletAddress: string;
  amount: string;
  tokenAddress?: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface TransactionResponse {
  poolId?: number;
  targetPoolId?: number;
  sourcePoolId?: number;
  walletAddress: string;
  amount?: string;
  tokenAddress?: string;
  transactionHash: string;
  message: string;
}

export interface TokenApprovalStatus {
  walletAddress: string;
  tokenAddress: string;
  balance: string;
  allowance: string;
  needsApproval: boolean;
}

export interface NonceResponse {
  walletAddress: string;
  nonce: number;
}

export interface DomainSeparatorResponse {
  domainSeparator: string;
}

export interface SignatureVerificationRequest {
  walletAddress: string;
  message: string;
  signature: string;
}

export interface SignatureVerificationResponse {
  walletAddress: string;
  message: string;
  signature: string;
  isValid: boolean;
  recoveredAddress: string;
}

export class VaultApiService {
  // Get Vault Configuration
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

  // Get User Pools
  static async getUserPools(walletAddress: string): Promise<UserPools | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/pools/user/${encodeURIComponent(walletAddress)}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch user pools');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Get Pool Details
  static async getPoolDetails(poolId: number): Promise<Pool | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/pools/${poolId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch pool details');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Create Pool
  static async createPool(request: CreatePoolRequest): Promise<CreatePoolResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create pool');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Delete Pool
  static async deletePool(poolId: number, request: DeletePoolRequest): Promise<TransactionResponse | null> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/vault/pools/${poolId}`, {
        data: request
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to delete pool');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Merge Pools
  static async mergePools(request: MergePoolsRequest): Promise<TransactionResponse | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/vault/pools/merge`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to merge pools');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Deposit Funds
  static async depositFunds(poolId: number, request: DepositRequest): Promise<TransactionResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/deposit`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to deposit funds');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Withdraw Funds
  static async withdrawFunds(poolId: number, request: WithdrawRequest): Promise<TransactionResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/pools/${poolId}/withdraw`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to withdraw funds');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Get Token Approval Status
  static async getTokenApprovalStatus(walletAddress: string, tokenAddress: string): Promise<TokenApprovalStatus | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/token/approval/${encodeURIComponent(walletAddress)}/${encodeURIComponent(tokenAddress)}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch token approval status');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Get User Nonce
  static async getUserNonce(walletAddress: string): Promise<NonceResponse | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/nonce/${encodeURIComponent(walletAddress)}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch user nonce');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Get Domain Separator
  static async getDomainSeparator(): Promise<DomainSeparatorResponse | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/vault/domain-separator`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch domain separator');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Verify Signature
  static async verifySignature(request: SignatureVerificationRequest): Promise<SignatureVerificationResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/vault/verify-signature`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to verify signature');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }
} 