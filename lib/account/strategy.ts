import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

export interface StrategyConfig {
  maxStrategiesPerUser: number;
  nextStrategyId: number;
  domainSeparator: string;
  strategyRegistryAddress: string;
  eip712Domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
}

export interface StrategyParams {
  symbol: string;
  leverage: number;
  takeProfit: number;
  stopLoss: number;
  amountLimit: string;
  maxDrawdown: number;
  freq: string;
  riskLevel: string;
}

export interface Strategy {
  id: number;
  walletAddress: string;
  params: StrategyParams;
  symbol: string;
  isActive: boolean;
  createdAt: number;
  lastActivityAt: number;
}

export interface UserStrategies {
  walletAddress: string;
  totalStrategies: number;
  strategies: Strategy[];
}

export interface RegisterStrategyRequest {
  walletAddress: string;
  params: StrategyParams;
  symbol: string;
  nonce: number;
  deadline: number;
  signature: string;
  paramsHash: string;
  symbolBytes32: string;
}

export interface UpdateStrategyRequest {
  walletAddress: string;
  params: StrategyParams;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface SetStrategyActiveRequest {
  walletAddress: string;
  active: boolean;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface DeleteStrategyRequest {
  walletAddress: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface StrategyResponse {
  strategyId?: number;
  walletAddress: string;
  params?: StrategyParams;
  symbol?: string;
  transactionHash: string;
  message: string;
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
  params: StrategyParams;
  symbol: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface ComputeHashRequest {
  walletAddress: string;
  params: StrategyParams;
  symbol: string;
  nonce: number;
  deadline: number;
}

export interface ComputeHashResponse {
  walletAddress: string;
  paramsHash: string;
  symbolBytes32: string;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    CreateStrategy: Array<{ name: string; type: string }>;
  };
  message: {
    walletAddress: string;
    paramsHash: string;
    symbol: string;
    nonce: number;
    deadline: number;
  };
  signatureData: {
    domain: {
      name: string;
      version: string;
      chainId: number;
      verifyingContract: string;
    };
    types: {
      CreateStrategy: Array<{ name: string; type: string }>;
    };
    primaryType: string;
    message: {
      walletAddress: string;
      paramsHash: string;
      symbol: string;
      nonce: number;
      deadline: number;
    };
  };
}

export interface SignatureVerificationResponse {
  walletAddress: string;
  params: StrategyParams;
  symbol: string;
  nonce: number;
  deadline: number;
  signature: string;
  isValid: boolean;
  recoveredAddress: string;
}

export class StrategyApiService {
  // Get Strategy Configuration
  static async getStrategyConfig(): Promise<StrategyConfig | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategy/config`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch strategy config');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Get User Strategies
  static async getUserStrategies(walletAddress: string): Promise<UserStrategies | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategy/user/${encodeURIComponent(walletAddress)}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch user strategies');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Get Strategy Details
  static async getStrategyDetails(strategyId: number): Promise<Strategy | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategy/${strategyId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch strategy details');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  // Register Strategy
  static async registerStrategy(request: RegisterStrategyRequest): Promise<StrategyResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/strategy/register`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to register strategy');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Update Strategy
  static async updateStrategy(strategyId: number, request: UpdateStrategyRequest): Promise<StrategyResponse | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/strategy/${strategyId}`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update strategy');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Set Strategy Active Status
  static async setStrategyActive(strategyId: number, request: SetStrategyActiveRequest): Promise<StrategyResponse | null> {
    try {
      const response = await axios.put(`${API_BASE_URL}/strategy/${strategyId}/active`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to set strategy active status');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Delete Strategy
  static async deleteStrategy(strategyId: number, request: DeleteStrategyRequest): Promise<StrategyResponse | null> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/strategy/${strategyId}`, {
        data: request
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to delete strategy');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Get User Nonce
  static async getUserNonce(walletAddress: string): Promise<NonceResponse | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/strategy/nonce/${encodeURIComponent(walletAddress)}`);
      
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
      const response = await axios.get(`${API_BASE_URL}/strategy/domain-separator`);
      
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
      const response = await axios.post(`${API_BASE_URL}/strategy/verify-signature`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to verify signature');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  // Compute Hash
  static async computeHash(request: ComputeHashRequest): Promise<ComputeHashResponse | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/strategy/compute-hash`, request);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to compute hash');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }
} 