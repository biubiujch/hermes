'use client';

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from '@heroui/react';
import { CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function Trade() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Trade</h1>
          <p className='text-gray-600'>Execute trades and manage your positions</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Trading Form */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <h2 className='text-xl font-semibold'>New Trade</h2>
              </CardHeader>
              <CardBody>
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Select label='Trading Pair' placeholder='Select pair'>
                      <SelectItem key='eth-usdt'>ETH/USDT</SelectItem>
                      <SelectItem key='btc-usdt'>BTC/USDT</SelectItem>
                      <SelectItem key='arb-usdt'>ARB/USDT</SelectItem>
                    </Select>
                    <Select label='Order Type' placeholder='Select type'>
                      <SelectItem key='market'>Market</SelectItem>
                      <SelectItem key='limit'>Limit</SelectItem>
                      <SelectItem key='stop'>Stop Loss</SelectItem>
                    </Select>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Input
                      type='number'
                      label='Amount'
                      placeholder='0.00'
                      startContent={<CurrencyDollarIcon className='w-4 h-4 text-gray-400' />}
                    />
                    <Input
                      type='number'
                      label='Price'
                      placeholder='0.00'
                      startContent={<CurrencyDollarIcon className='w-4 h-4 text-gray-400' />}
                    />
                  </div>

                  <div className='flex gap-4'>
                    <Button 
                      color='success' 
                      variant='flat' 
                      className='flex-1'
                      startContent={<ArrowUpIcon className='w-4 h-4' />}
                    >
                      Buy
                    </Button>
                    <Button 
                      color='danger' 
                      variant='flat' 
                      className='flex-1'
                      startContent={<ArrowDownIcon className='w-4 h-4' />}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Market Info */}
          <div>
            <Card>
              <CardHeader>
                <h2 className='text-xl font-semibold'>Market Info</h2>
              </CardHeader>
              <CardBody>
                <div className='space-y-4'>
                  <div className='p-4 bg-gray-50 rounded-lg'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='font-medium'>ETH/USDT</span>
                      <span className='text-green-600 font-semibold'>$2,450.50</span>
                    </div>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>24h Change</span>
                      <span className='text-green-600'>+2.45%</span>
                    </div>
                  </div>

                  <div className='p-4 bg-gray-50 rounded-lg'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='font-medium'>BTC/USDT</span>
                      <span className='text-red-600 font-semibold'>$43,250.00</span>
                    </div>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>24h Change</span>
                      <span className='text-red-600'>-1.23%</span>
                    </div>
                  </div>

                  <div className='p-4 bg-gray-50 rounded-lg'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='font-medium'>ARB/USDT</span>
                      <span className='text-green-600 font-semibold'>$1.85</span>
                    </div>
                    <div className='flex justify-between text-sm text-gray-600'>
                      <span>24h Change</span>
                      <span className='text-green-600'>+5.67%</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
