'use client';
import { Button } from '@heroui/react';
import { label } from 'framer-motion/client';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import {} from 'framer-motion';

export const TopNavBar = () => {
  const pathname = usePathname();
  const menuItem = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Trade', href: '/trade' },
    { label: 'Strategy', href: '/strategy' },
    { label: 'Settings', href: '/settings' }
  ];
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className='container mx-auto px-6'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-8'>
            {/* Logo/Brand */}
            <div 
              className='text-xl font-semibold text-gray-900 cursor-pointer' 
              onClick={() => redirect('/dashboard')}
            >
              Trade Bot
            </div>
            
            {/* Navigation Menu */}
            <div className='hidden md:flex items-center gap-6'>
              {menuItem.map((item) => (
                <Link 
                  href={item.href} 
                  key={item.label}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${pathname === item.href 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            <Button 
              color='primary' 
              className="bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
