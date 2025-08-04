// 配置选项
export interface AssetsPoolConfig {
  localServiceUrl: string; // 本地服务URL
}

// 网络配置接口
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
  contractAddress?: string;
}

// 资金池配置接口
export interface PoolConfig {
  feeCollector: string;
  minDeposit: string;
  maxPoolSize: string;
  feeRate: string;
  feeRatePercent: string;
  contractAddress: string;
  network: string;
}

// 余额信息接口
export interface BalanceInfo {
  token: string;
  balance: string;
  decimals: number;
}

// 用户余额信息接口
export interface UserBalanceInfo {
  user: string;
  token: string;
  balance: string;
  decimals: number;
}

// 交易信息接口
export interface TransactionInfo {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
  data: string;
}

// 网络状态接口
export interface NetworkStatus {
  networkName: string;
  chainId: string;
  blockNumber: string;
  connected: boolean;
}

// 支持的代币接口
export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
}

export class AssetsPool {
  private config: AssetsPoolConfig;

  constructor(config: Partial<AssetsPoolConfig> = {}) {
    this.config = {
      localServiceUrl: config.localServiceUrl ?? 'http://localhost:9999'
    };
  }

  // 调用本地服务
  private async callLocalService(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    try {
      const url = `${this.config.localServiceUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method === 'POST') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`调用本地服务失败 (${endpoint}):`, error);
      throw error;
    }
  }

  // 获取支持的网络列表
  async getNetworks(): Promise<NetworkConfig[]> {
    const response = await this.callLocalService('/api/asset-pool/networks');
    return response.data || [];
  }

  // 获取网络状态
  async getNetworkStatus(networkName: string): Promise<NetworkStatus> {
    const response = await this.callLocalService(`/api/asset-pool/${networkName}/status`);
    return response.data;
  }

  // 获取资金池配置
  async getPoolConfig(network: string): Promise<PoolConfig> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/config`);
    return response.data;
  }

  // 获取资金池余额
  async getPoolBalance(network: string, token: string = '0x0000000000000000000000000000000000000000'): Promise<BalanceInfo> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/balance?token=${token}`);
    return response.data;
  }

  // 获取用户余额
  async getUserBalance(network: string, userAddress: string, token: string = '0x0000000000000000000000000000000000000000'): Promise<UserBalanceInfo> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/user/${userAddress}/balance?token=${token}`);
    return response.data;
  }

  // 获取账户ETH余额
  async getAccountBalance(network: string, address: string): Promise<{ address: string; balance: string; token: string }> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/balance/${address}`);
    return response.data;
  }

  // 用户存款
  async deposit(network: string, userAddress: string, amount: string, privateKey: string, token: string = '0x0000000000000000000000000000000000000000'): Promise<{ txHash: string; network: string; user: string; token: string; amount: string }> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/deposit`, 'POST', {
      user: userAddress,
      token,
      amount,
      privateKey
    });
    return response.data;
  }

  // 用户提款
  async withdraw(network: string, userAddress: string, amount: string, privateKey: string, token: string = '0x0000000000000000000000000000000000000000'): Promise<{ txHash: string; network: string; user: string; token: string; amount: string }> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/withdraw`, 'POST', {
      user: userAddress,
      token,
      amount,
      privateKey
    });
    return response.data;
  }

  // 检查代币支持状态
  async isTokenSupported(network: string, token: string): Promise<boolean> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/token/${token}/supported`);
    return response.data.supported;
  }

  // 检查策略授权状态
  async isStrategyAuthorized(network: string, strategy: string): Promise<boolean> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/strategy/${strategy}/authorized`);
    return response.data.authorized;
  }

  // 获取交易详情
  async getTransactionInfo(network: string, txHash: string): Promise<TransactionInfo> {
    const response = await this.callLocalService(`/api/asset-pool/${network}/transaction/${txHash}`);
    return response.data;
  }

  // 获取配置
  getConfig(): AssetsPoolConfig {
    return { ...this.config };
  }

  // 更新配置
  updateConfig(newConfig: Partial<AssetsPoolConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
