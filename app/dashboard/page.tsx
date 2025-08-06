'use client';

import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import { ChartBarIcon, CurrencyDollarIcon, PresentationChartLineIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  return (
    <div className='container mx-auto px-6 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>Overview of your trading performance and strategies</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <Card>
          <CardBody className='p-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4'>
                <CurrencyDollarIcon className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Value</p>
                <p className='text-2xl font-bold text-gray-900'>$12,450</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className='p-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4'>
                <PresentationChartLineIcon className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>24h P&L</p>
                <p className='text-2xl font-bold text-green-600'>+$245</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className='p-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4'>
                <ChartBarIcon className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Active Strategies</p>
                <p className='text-2xl font-bold text-gray-900'>5</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className='p-6'>
            <div className='flex items-center'>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4'>
                <ClockIcon className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Uptime</p>
                <p className='text-2xl font-bold text-gray-900'>99.8%</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <Card>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Recent Activity</h2>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-medium'>Strategy executed</p>
                  <p className='text-sm text-gray-600'>ETH/USDT - Long position</p>
                </div>
                <Chip color='success' size='sm'>+$45</Chip>
              </div>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-medium'>Strategy executed</p>
                  <p className='text-sm text-gray-600'>BTC/USDT - Short position</p>
                </div>
                <Chip color='danger' size='sm'>-$12</Chip>
              </div>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div>
                  <p className='font-medium'>Funds deposited</p>
                  <p className='text-sm text-gray-600'>USDT deposit</p>
                </div>
                <Chip color='primary' size='sm'>+$1000</Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              <Button color='primary' variant='flat' className='w-full' size='lg'>
                Create New Strategy
              </Button>
              <Button color='secondary' variant='bordered' className='w-full' size='lg'>
                Deposit Funds
              </Button>
              <Button color='secondary' variant='bordered' className='w-full' size='lg'>
                View Analytics
              </Button>
              <Button color='secondary' variant='bordered' className='w-full' size='lg'>
                Manage Positions
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
