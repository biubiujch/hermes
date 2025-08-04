import { useState, useEffect, useCallback } from 'react';

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl?: string;
}

interface NetworkStatus {
  networkName: string;
  chainId: string;
  blockNumber: string;
  connected: boolean;
}

interface PoolConfig {
  feeCollector: string;
  minDeposit: string;
  maxPoolSize: string;
  feeRate: string;
  feeRatePercent: string;
  contractAddress: string;
  network: string;
}

interface BalanceInfo {
  token: string;
  balance: string;
  decimals: number;
}

interface UserBalanceInfo {
  user: string;
  token: string;
  balance: string;
  decimals: number;
}

interface TransactionResult {
  txHash: string;
  network: string;
  user: string;
  token: string;
  amount: string;
}

export const useAssetPool = () => {
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('arbitrumTestnet');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [poolConfig, setPoolConfig] = useState<PoolConfig | null>(null);
  const [poolBalance, setPoolBalance] = useState<BalanceInfo | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [userBalance, setUserBalance] = useState<UserBalanceInfo | null>(null);
  const [accountBalance, setAccountBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取网络列表
  const fetchNetworks = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/asset-pool/networks');
      const data = await response.json();
      if (data.success) {
        setNetworks(data.data);
      } else {
        setError(data.error || '获取网络列表失败');
      }
    } catch (err) {
      setError('获取网络列表失败');
      console.error('获取网络列表错误:', err);
    }
  }, []);

  // 获取网络状态
  const fetchNetworkStatus = useCallback(async (network: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/asset-pool/${network}/status`);
      const data = await response.json();
      if (data.success) {
        setNetworkStatus(data.data);
      } else {
        setError(data.error || '获取网络状态失败');
      }
    } catch (err) {
      setError('获取网络状态失败');
      console.error('获取网络状态错误:', err);
    }
  }, []);

  // 获取资金池配置
  const fetchPoolConfig = useCallback(async (network: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/asset-pool/${network}/config`);
      const data = await response.json();
      if (data.success) {
        setPoolConfig(data.data);
      } else {
        setError(data.error || '获取资金池配置失败');
      }
    } catch (err) {
      setError('获取资金池配置失败');
      console.error('获取资金池配置错误:', err);
    }
  }, []);

  // 获取资金池余额
  const fetchPoolBalance = useCallback(async (network: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/asset-pool/${network}/balance`);
      const data = await response.json();
      if (data.success) {
        setPoolBalance(data.data);
      } else {
        setError(data.error || '获取资金池余额失败');
      }
    } catch (err) {
      setError('获取资金池余额失败');
      console.error('获取资金池余额错误:', err);
    }
  }, []);

  // 获取用户余额
  const fetchUserBalance = useCallback(async (network: string, address: string) => {
    if (!address) return;
    try {
      setError(null);
      const response = await fetch(`/api/asset-pool/${network}/user/${address}/balance`);
      const data = await response.json();
      if (data.success) {
        setUserBalance(data.data);
      } else {
        setError(data.error || '获取用户余额失败');
      }
    } catch (err) {
      setError('获取用户余额失败');
      console.error('获取用户余额错误:', err);
    }
  }, []);

  // 获取账户ETH余额
  const fetchAccountBalance = useCallback(async (network: string, address: string) => {
    if (!address) return;
    try {
      setError(null);
      const response = await fetch(`/api/asset-pool/${network}/balance/${address}`);
      const data = await response.json();
      if (data.success) {
        setAccountBalance(data.data.balance);
      } else {
        setError(data.error || '获取账户余额失败');
      }
    } catch (err) {
      setError('获取账户余额失败');
      console.error('获取账户余额错误:', err);
    }
  }, []);

  // 存款操作
  const deposit = useCallback(async (
    network: string,
    userAddress: string,
    amount: string,
    privateKey: string,
    token: string = '0x0000000000000000000000000000000000000000'
  ): Promise<TransactionResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/asset-pool/${network}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userAddress,
          token,
          amount,
          privateKey
        }),
      });

      const data = await response.json();
      if (data.success) {
        // 刷新相关数据
        await Promise.all([
          fetchPoolBalance(network),
          fetchUserBalance(network, userAddress)
        ]);
        return data.data;
      } else {
        setError(data.error || '存款失败');
        return null;
      }
    } catch (err) {
      setError('存款操作失败');
      console.error('存款操作错误:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPoolBalance, fetchUserBalance]);

  // 提款操作
  const withdraw = useCallback(async (
    network: string,
    userAddress: string,
    amount: string,
    privateKey: string,
    token: string = '0x0000000000000000000000000000000000000000'
  ): Promise<TransactionResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/asset-pool/${network}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userAddress,
          token,
          amount,
          privateKey
        }),
      });

      const data = await response.json();
      if (data.success) {
        // 刷新相关数据
        await Promise.all([
          fetchPoolBalance(network),
          fetchUserBalance(network, userAddress)
        ]);
        return data.data;
      } else {
        setError(data.error || '提款失败');
        return null;
      }
    } catch (err) {
      setError('提款操作失败');
      console.error('提款操作错误:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchPoolBalance, fetchUserBalance]);

  // 刷新所有数据
  const refreshAllData = useCallback(async () => {
    if (selectedNetwork) {
      await Promise.all([
        fetchNetworkStatus(selectedNetwork),
        fetchPoolConfig(selectedNetwork),
        fetchPoolBalance(selectedNetwork)
      ]);
    }
  }, [selectedNetwork, fetchNetworkStatus, fetchPoolConfig, fetchPoolBalance]);

  // 刷新用户相关数据
  const refreshUserData = useCallback(async () => {
    if (userAddress && selectedNetwork) {
      await Promise.all([
        fetchUserBalance(selectedNetwork, userAddress),
        fetchAccountBalance(selectedNetwork, userAddress)
      ]);
    }
  }, [userAddress, selectedNetwork, fetchUserBalance, fetchAccountBalance]);

  // 网络切换时刷新数据
  useEffect(() => {
    if (selectedNetwork) {
      refreshAllData();
    }
  }, [selectedNetwork, refreshAllData]);

  // 用户地址变化时刷新用户相关数据
  useEffect(() => {
    if (userAddress && selectedNetwork) {
      refreshUserData();
    }
  }, [userAddress, selectedNetwork, refreshUserData]);

  // 初始化
  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  return {
    // 状态
    networks,
    selectedNetwork,
    networkStatus,
    poolConfig,
    poolBalance,
    userAddress,
    userBalance,
    accountBalance,
    loading,
    error,
    
    // 设置器
    setSelectedNetwork,
    setUserAddress,
    
    // 操作
    fetchNetworks,
    fetchNetworkStatus,
    fetchPoolConfig,
    fetchPoolBalance,
    fetchUserBalance,
    fetchAccountBalance,
    deposit,
    withdraw,
    refreshAllData,
    refreshUserData,
    
    // 清除错误
    clearError: () => setError(null)
  };
}; 