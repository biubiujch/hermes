import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { WalletBalance } from '../lib/account/wallet';

const fetchBalanceData = async (address: string): Promise<WalletBalance> => {
  const response = await fetch(`/api/wallet/balance?walletAddress=${encodeURIComponent(address)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (data.success) {
    return data.data.balances;
  } else {
    throw new Error(data.error || '获取钱包余额失败');
  }
};

export const useWalletBalance = () => {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: balance = null,
    isLoading: loading,
    error,
    refetch: fetchBalance,
  } = useQuery({
    queryKey: ['walletBalance', address],
    queryFn: () => fetchBalanceData(address!),
    enabled: !!address && isConnected,
    staleTime: 5000, // 5秒内不重新请求
    gcTime: 15000, // 15秒后清理缓存
  });

  const injectFundsMutation = useMutation({
    mutationFn: async (amount: string) => {
      if (!address) throw new Error('No wallet address');
      
      const response = await fetch('/api/wallet/inject-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, amount }),
      });
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        let errorMessage = data.error;
        if (data.errorType === 'contract_not_deployed') {
          errorMessage = 'Smart contracts are not deployed. Please ensure the local blockchain is running with all contracts deployed.';
        } else if (data.errorType === 'invalid_address') {
          errorMessage = 'Invalid contract address. Please check the network configuration.';
        } else if (data.errorType === 'environment_error') {
          errorMessage = 'Fund injection is only available in local test environment. Please connect to Hardhat Local network.';
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      // 成功后刷新余额
      queryClient.invalidateQueries({ queryKey: ['walletBalance', address] });
    },
  });

  const injectFunds = async (amount: string): Promise<boolean> => {
    try {
      await injectFundsMutation.mutateAsync(amount);
      return true;
    } catch (err: any) {
      console.error('Failed to inject funds:', err.message);
      if (err.message.includes('Smart contracts are not deployed') || 
          err.message.includes('Invalid contract address') || 
          err.message.includes('Fund injection is only available')) {
        throw err; // Re-throw specific errors
      }
      throw new Error('Network error occurred while injecting funds');
    }
  };

  return {
    balance,
    loading: loading || injectFundsMutation.isPending,
    lastUpdated: new Date(), // React Query会自动管理更新时间
    fetchBalance,
    injectFunds,
    mounted,
    error: error?.message,
  };
}; 