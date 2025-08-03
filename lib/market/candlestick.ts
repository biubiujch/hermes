import axios from 'axios';

// 支持的网络类型
export type Network = 'arbitrum' | 'avalanche' | 'botanix';

// 支持的时间周期
export type Period = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

// K线数据接口
export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// API响应接口
export interface CandlestickResponse {
  prices: CandlestickData[];
}

// 网络配置
const NETWORK_URLS: Record<Network, string> = {
  arbitrum: 'https://arbitrum-api.gmxinfra.io',
  avalanche: 'https://avalanche-api.gmxinfra.io',
  botanix: 'https://botanix-api.gmxinfra.io'
};

// 备用网络配置
const FALLBACK_NETWORK_URLS: Record<Network, string> = {
  arbitrum: 'https://arbitrum-api.gmxinfra2.io',
  avalanche: 'https://avalanche-api.gmxinfra2.io',
  botanix: 'https://botanix-api.gmxinfra2.io'
};

/**
 * 获取K线图数据
 * @param tokenSymbol 代币符号 (如: ETH, AVAX, BTC)
 * @param period 时间周期 (1m, 5m, 15m, 1h, 4h, 1d)
 * @param network 网络类型，默认为 arbitrum
 * @param useFallback 是否使用备用URL
 * @returns K线数据数组
 */
export async function getCandlestickData(
  tokenSymbol: string,
  period: Period,
  network: Network = 'arbitrum',
  useFallback = false
): Promise<CandlestickData[]> {
  const baseUrl = useFallback ? FALLBACK_NETWORK_URLS[network] : NETWORK_URLS[network];
  const url = `${baseUrl}/prices/candles`;

  try {
    const response = await axios.get<CandlestickData[]>(url, {
      params: {
        tokenSymbol: tokenSymbol.toUpperCase(),
        period
      },
      timeout: 10000 // 10秒超时
    });

    return response.data;
  } catch (error) {
    if (!useFallback) {
      // 如果主URL失败，尝试备用URL
      console.warn(`主URL失败，尝试备用URL: ${network}`);
      return getCandlestickData(tokenSymbol, period, network, true);
    }
    throw new Error(`获取K线数据失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
