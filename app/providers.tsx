// app/providers.tsx
'use client';

import { HeroUIProvider } from '@heroui/react';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { ToastProvider } from '@heroui/toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 防止重复请求
      staleTime: 5000, // 5秒内数据被认为是新鲜的
      gcTime: 10000, // 10秒后清理缓存
      retry: 1, // 失败重试1次
      refetchOnWindowFocus: false, // 窗口聚焦时不重新请求
      refetchOnReconnect: false, // 网络重连时不重新请求
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <HeroUIProvider>
        <ToastProvider />
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
      </HeroUIProvider>
    </Provider>
  );
}
