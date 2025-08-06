'use client';

import { Card, CardBody, CardHeader, Button, Chip, Badge } from '@heroui/react';
import { PlusIcon, PlayIcon, PauseIcon, TrashIcon } from '@heroicons/react/24/outline';

const mockStrategies = [
  {
    id: 1,
    name: 'ETH Momentum Strategy',
    status: 'active',
    pair: 'ETH/USDT',
    type: 'Long',
    pnl: '+$245.50',
    pnlColor: 'success',
    lastExecuted: '2 minutes ago'
  },
  {
    id: 2,
    name: 'BTC Mean Reversion',
    status: 'paused',
    pair: 'BTC/USDT',
    type: 'Short',
    pnl: '-$12.30',
    pnlColor: 'danger',
    lastExecuted: '1 hour ago'
  },
  {
    id: 3,
    name: 'ARB Breakout',
    status: 'active',
    pair: 'ARB/USDT',
    type: 'Long',
    pnl: '+$89.20',
    pnlColor: 'success',
    lastExecuted: '5 minutes ago'
  }
];

export default function Strategy() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Trading Strategies</h1>
            <p className='text-gray-600'>Create and manage your automated trading strategies</p>
          </div>
          <Button 
            color='primary' 
            startContent={<PlusIcon className='w-4 h-4' />}
          >
            Create Strategy
          </Button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-gray-900'>3</p>
                <p className='text-sm text-gray-600'>Total Strategies</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-green-600'>2</p>
                <p className='text-sm text-gray-600'>Active</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-orange-600'>1</p>
                <p className='text-sm text-gray-600'>Paused</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-green-600'>+$322.40</p>
                <p className='text-sm text-gray-600'>Total P&L</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Strategies List */}
        <Card>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Your Strategies</h2>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              {mockStrategies.map((strategy) => (
                <div 
                  key={strategy.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center space-x-4'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>{strategy.name}</h3>
                      <div className='flex items-center space-x-2 mt-1'>
                        <Chip size='sm' variant='flat'>{strategy.pair}</Chip>
                        <Chip 
                          size='sm' 
                          color={strategy.type === 'Long' ? 'success' : 'danger'}
                          variant='flat'
                        >
                          {strategy.type}
                        </Chip>
                        <Badge 
                          color={strategy.status === 'active' ? 'success' : 'warning'}
                          variant='flat'
                        >
                          {strategy.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <p className={`font-semibold ${strategy.pnlColor === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {strategy.pnl}
                      </p>
                      <p className='text-sm text-gray-600'>{strategy.lastExecuted}</p>
                    </div>
                    
                    <div className='flex items-center space-x-2'>
                      {strategy.status === 'active' ? (
                        <Button size='sm' variant='bordered' color='warning'>
                          <PauseIcon className='w-4 h-4' />
                        </Button>
                      ) : (
                        <Button size='sm' variant='bordered' color='success'>
                          <PlayIcon className='w-4 h-4' />
                        </Button>
                      )}
                      <Button size='sm' variant='bordered' color='danger'>
                        <TrashIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
