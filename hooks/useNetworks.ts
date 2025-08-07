import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Network } from '../lib/account/wallet';

const fetchNetworksData = async (): Promise<Network[]> => {
  const response = await fetch('/api/wallet/networks');
  const data = await response.json();
  
  if (data.success) {
    return data.data.networks;
  } else {
    throw new Error(data.error || '获取网络列表失败');
  }
};

export const useNetworks = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: networks = [],
    isLoading: loading,
    error,
    refetch: fetchNetworks,
  } = useQuery({
    queryKey: ['networks'],
    queryFn: fetchNetworksData,
    staleTime: 10000, // 10秒内不重新请求
    gcTime: 30000, // 30秒后清理缓存
  });

  return {
    networks,
    loading,
    fetchNetworks,
    mounted,
    error: error?.message,
  };
}; 