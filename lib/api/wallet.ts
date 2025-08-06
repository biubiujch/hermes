import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

export interface WalletBalance {
  eth: string;
  usdt: string;
}

export interface Network {
  id: number;
  name: string;
  rpcUrl: string;
  chainId: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
  isTestnet: boolean;
  isLocal: boolean;
}

export interface AppConfig {
  feeCollector: {
    address: string;
    configured: boolean;
  };
  fees: {
    tradingRate: number;
    withdrawalRate: number;
  };
  network: {
    localNodeUrl: string;
  };
  contracts: {
    mockToken: string;
    vault: string;
    membership: string;
  };
}

export class WalletApiService {
  static async getWalletBalance(walletAddress: string): Promise<WalletBalance | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/balance?walletAddress=${encodeURIComponent(walletAddress)}`);
      
      if (response.data.success) {
        return response.data.data.balances;
      } else {
        throw new Error(response.data.error || 'Failed to fetch balance');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  static async injectFunds(walletAddress: string, amount: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/inject-funds`, {
        walletAddress,
        amount
      });
      
      if (response.data.success) {
        return true;
      } else {
        // Backend returned success: false, throw the error message from backend
        throw new Error(response.data.error || 'Failed to inject funds');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Network error');
    }
  }

  static async getNetworks(): Promise<Network[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/networks`);
      
      if (response.data.success) {
        return response.data.data.networks;
      } else {
        throw new Error(response.data.error || 'Failed to fetch networks');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }

  static async getAppConfig(): Promise<AppConfig | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/config`);
      
      if (response.data.success) {
        return response.data.data.config;
      } else {
        throw new Error(response.data.error || 'Failed to fetch config');
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Network error');
    }
  }
} 