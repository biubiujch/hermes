import { useEffect, useRef, useCallback, useState } from 'react';
import { CandlestickData, Network, Period } from '@/lib/market';

// 订阅配置接口
export interface SubscribeConfig {
  tokenSymbol: string;
  period: Period;
  network?: Network;
  interval?: number; // 轮询间隔，单位毫秒，默认5秒
  callback?: (data: CandlestickData[]) => void;
}

// Hook返回值接口
export interface UseCandlestickReturn {
  data: CandlestickData[] | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  subscribe: (config: SubscribeConfig) => void;
  unsubscribe: () => void;
  refetch: () => Promise<void>;
}

// API响应接口
interface CandlestickApiResponse {
  success: boolean;
  data: {
    tokenSymbol: string;
    period: string;
    network: string;
    candlesticks: CandlestickData[];
    count: number;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

export const useCandlestick = (): UseCandlestickReturn => {
  // 状态管理
  const [data, setData] = useState<CandlestickData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // refs用于管理定时器、回调和配置
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef<((data: CandlestickData[]) => void) | null>(null);
  const configRef = useRef<SubscribeConfig | null>(null);
  const isSubscribedRef = useRef<boolean>(false);

  // 获取K线数据的函数
  const fetchCandlestickData = useCallback(async (): Promise<CandlestickData[]> => {
    const config = configRef.current;
    if (!config) {
      throw new Error('未配置订阅参数');
    }

    const params = new URLSearchParams({
      tokenSymbol: config.tokenSymbol.toUpperCase(),
      period: config.period,
      network: config.network || 'arbitrum'
    });

    const response = await fetch(`/api/candlestick?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: CandlestickApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || result.message || '获取K线数据失败');
    }

    return result.data.candlesticks;
  }, []);

  // 手动刷新数据
  const refetch = useCallback(async () => {
    if (!configRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const candlestickData = await fetchCandlestickData();
      setData(candlestickData);
      setLastUpdated(new Date());
      
      // 调用回调函数
      if (callbackRef.current) {
        callbackRef.current(candlestickData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取K线数据失败';
      setError(errorMessage);
      console.error('获取K线数据错误:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCandlestickData]);

  // 开始轮询
  const startPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const config = configRef.current;
    if (!config) return;

    // 立即获取一次数据
    refetch();

    // 设置定时轮询
    const interval = config.interval || 5000;
    timerRef.current = setInterval(() => {
      if (isSubscribedRef.current) {
        refetch();
      }
    }, interval);
  }, [refetch]);

  // 停止轮询
  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 订阅方法
  const subscribe = useCallback(
    (config: SubscribeConfig) => {
      // 保存配置和回调
      configRef.current = config;
      callbackRef.current = config.callback || null;
      isSubscribedRef.current = true;
      
      // 开始轮询
      startPolling();
    },
    [startPolling]
  );

  // 取消订阅方法
  const unsubscribe = useCallback(() => {
    isSubscribedRef.current = false;
    callbackRef.current = null;
    configRef.current = null;
    stopPolling();
    
    // 清空状态
    setData(null);
    setError(null);
    setLastUpdated(null);
  }, [stopPolling]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopPolling();
      isSubscribedRef.current = false;
      callbackRef.current = null;
      configRef.current = null;
    };
  }, [stopPolling]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    subscribe,
    unsubscribe,
    refetch
  };
};
