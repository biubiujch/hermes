'use client';

import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { WalletIcon, CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function AssetPool() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Asset Pool</h1>
          <p className='text-gray-600'>Manage your trading assets and liquidity</p>
        </div>

        {/* Coming Soon */}
        <Card className='max-w-2xl mx-auto'>
          <CardBody className='text-center py-12'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <WalletIcon className='w-8 h-8 text-blue-600' />
            </div>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>Asset Pool Coming Soon</h2>
            <p className='text-gray-600 mb-6'>
              This feature is currently under development. You'll be able to manage your trading assets, 
              view liquidity pools, and optimize your portfolio allocation.
            </p>
            <Button color='primary' variant='flat'>
              Get Notified
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 