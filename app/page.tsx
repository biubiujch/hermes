'use client';
import { useCandlestick } from '@/hooks/useCandlestick';
import { Button } from '@heroui/react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  const { subscribe } = useCandlestick();

  useEffect(() => {
    subscribe({
      tokenSymbol: 'ETH',
      period: '1m',
      callback: (data) => {
        console.log(data);
      }
    });
  }, []);

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <Button color='primary'>click me</Button>
    </div>
  );
}
