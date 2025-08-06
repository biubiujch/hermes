// app/providers.tsx
'use client';

import { HeroUIProvider } from '@heroui/react';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { ToastProvider } from '@heroui/toast';

const queryClient = new QueryClient();

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
