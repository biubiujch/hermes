'use client';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { WalletConnect } from '@/components/wallet/WalletConnect';

export const TopNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const menuItem = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Trade', href: '/trade' },
    { label: 'Strategy', href: '/strategy' },
    { label: 'Settings', href: '/settings' }
  ];

  return (
    <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='container mx-auto px-6'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-8'>
            {/* Logo/Brand */}
            <div
              className='text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-200 ease-out'
              onClick={() => router.push('/')}
            >
              Hermes
            </div>

            {/* Navigation Menu */}
            <div className='hidden md:flex items-center gap-6'>
              {menuItem.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className={`
                    px-4 py-2 text-sm font-medium transition-all duration-200 ease-out
                    ${
                      pathname === item.href
                        ? 'text-blue-600 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        : 'text-gray-600 hover:text-blue-600 hover:scale-105'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-4'>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};
