'use client';

import { Card, CardBody, CardHeader, Chip, Tabs, Tab, Spinner } from '@heroui/react';
import { useAccount, useChainId } from 'wagmi';
import { WalletIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Account from './Account';
import Vault from './Vault';

export default function Settings() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isLocalChain = chainId === 31337; // Hardhat local chain

  // Don't render until client-side mounting is complete

  if (!isConnected) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-2xl mx-auto'>
          <CardBody className='text-center py-12'>
            <WalletIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-gray-600 mb-2'>Wallet Not Connected</h2>
            <p className='text-gray-500'>Please connect your wallet to view account information</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const tabs = [
    {
      id: 'account',
      label: 'Account',
      icon: WalletIcon,
      content: <Account />
    },
    {
      id: 'vault',
      label: 'Vault',
      icon: BanknotesIcon,
      content: <Vault />
    }
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Account Header */}
        <Card className='mb-6'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold'>Account Settings</h1>
                <p className='text-gray-600 mt-1'>Manage your wallet and account information</p>
              </div>
              <Chip color={isLocalChain ? 'warning' : 'success'} variant='flat' size='sm'>
                {isLocalChain ? 'Local Testnet' : 'Mainnet'}
              </Chip>
            </div>
          </CardHeader>
          <CardBody>
            <div className='flex items-center space-x-3'>
              <WalletIcon className='w-5 h-5 text-gray-500' />
              <span className='font-mono text-sm text-gray-600'>{address}</span>
            </div>
          </CardBody>
        </Card>

        {/* Settings Tabs */}
        <Tabs aria-label='Settings tabs' items={tabs} className='w-full'>
          {(item) => (
            <Tab
              key={item.id}
              title={
                <div className='flex items-center space-x-2'>
                  <item.icon className='w-4 h-4' />
                  <span>{item.label}</span>
                </div>
              }
            >
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>
    </div>
  );
}
