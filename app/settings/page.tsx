'use client';

import { Card, CardBody, CardHeader, Button, Input, Chip, Spinner, Divider, addToast } from '@heroui/react';
import { useAccount, useChainId } from 'wagmi';
import { useState } from 'react';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { WalletIcon, CurrencyDollarIcon, ArrowDownTrayIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatTime } from '../../lib/utils/date';
import { formatNumber, formatCurrency, formatETH } from '../../lib/utils/number';

export default function Settings() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { balance, loading, lastUpdated, fetchBalance, injectFunds, mounted } = useWalletBalance();
  
  const [injectAmount, setInjectAmount] = useState('1000');
  const [injecting, setInjecting] = useState(false);

  const isLocalChain = chainId === 31337; // Hardhat local chain
  const totalBalance = balance ? parseFloat(balance.usdt) : 0;
  const showInjectFunds = isLocalChain && totalBalance < 1000;

  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    addToast({
      hideIcon: false,
      title: title,
      description: description,
      color: type === 'success' ? 'success' : 'danger',
      classNames: {
        closeButton: "opacity-100 absolute right-4 top-1/2 -translate-y-1/2",
      },
    });
  };

  const handleInjectFunds = async () => {
    if (!address || !injectAmount) return;
    
    setInjecting(true);
    try {
      const success = await injectFunds(injectAmount);
      if (success) {
        setInjectAmount('1000');
        showToast('Success', 'Funds injected successfully!', 'success');
      }
    } catch (error: any) {
      console.error('Fund injection error:', error);
      showToast('Error', error.message || 'Failed to inject funds. Please try again.', 'error');
    } finally {
      setInjecting(false);
    }
  };

  // Don't render until client-side mounting is complete
  if (!mounted) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center py-12'>
          <Spinner size='lg' />
        </div>
      </div>
    );
  }

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

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Account Header */}
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold'>Account Settings</h1>
                <p className='text-gray-600 mt-1'>Manage your wallet and account information</p>
              </div>
              <Chip 
                color={isLocalChain ? 'warning' : 'success'} 
                variant='flat'
                size='sm'
              >
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

        {/* Balance Information */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold flex items-center'>
              <CurrencyDollarIcon className='w-5 h-5 mr-2' />
              Wallet Balance
            </h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <Spinner size='lg' />
              </div>
            ) : balance ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
                    <div>
                      <p className='text-sm text-gray-600'>ETH Balance</p>
                      <p className='text-xl font-semibold'>{formatETH(balance.eth)} ETH</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-gray-500'>Native Token</p>
                    </div>
                  </div>
                  
                  <div className='flex justify-between items-center p-4 bg-blue-50 rounded-lg'>
                    <div>
                      <p className='text-sm text-gray-600'>USDT Balance</p>
                      <p className='text-xl font-semibold text-blue-600'>
                        {formatNumber(balance.usdt)} USDT
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-gray-500'>Trading Token</p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='p-4 bg-green-50 rounded-lg'>
                    <p className='text-sm text-gray-600 mb-1'>Total Value</p>
                    <p className='text-2xl font-bold text-green-600'>
                      {formatCurrency(balance.usdt)}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      Last updated: {formatTime(lastUpdated)}
                    </p>
                  </div>

                  {showInjectFunds && (
                    <div className='p-4 bg-yellow-50 rounded-lg border border-yellow-200'>
                      <h3 className='font-semibold text-yellow-800 mb-2'>Test Fund Injection</h3>
                      <p className='text-sm text-yellow-700 mb-3'>
                        Add test funds to your wallet (only available on local testnet)
                      </p>
                      <div className='space-y-3'>
                        <Input
                          type='number'
                          label='Amount (USDT)'
                          value={injectAmount}
                          onChange={(e) => setInjectAmount(e.target.value)}
                          placeholder='1000'
                          min='1'
                        />
                        <Button
                          color='warning'
                          variant='flat'
                          startContent={<ArrowDownTrayIcon className='w-4 h-4' />}
                          onClick={handleInjectFunds}
                          isLoading={injecting}
                          fullWidth
                        >
                          Inject Funds
                        </Button>
                      </div>
                      <div className='mt-3 p-3 bg-blue-50 rounded border border-blue-200'>
                        <p className='text-xs text-blue-700'>
                          <strong>Note:</strong> This feature requires:
                        </p>
                        <ul className='text-xs text-blue-700 mt-1 space-y-1'>
                          <li>• Local Hardhat node running on port 8545</li>
                          <li>• Connected to Hardhat Local network (Chain ID: 31337)</li>
                          <li>• Backend service running on port 5500</li>
                          <li>• Smart contracts deployed (MockToken, Vault, Membership)</li>
                        </ul>
                        <p className='text-xs text-blue-700 mt-2'>
                          <strong>Current Status:</strong> 
                          {balance ? ' Balance API working' : ' Balance API not responding'}
                        </p>
                      </div>
                    </div>
                  )}

                  {!showInjectFunds && isLocalChain && (
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm text-gray-600'>
                        Fund injection is hidden when balance exceeds 1000 USDT
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-center py-8'>
                <ExclamationTriangleIcon className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500 mb-2'>Balance information unavailable</p>
                <p className='text-sm text-gray-400 mb-4'>The backend service may be offline</p>
                <Button color='primary' variant='flat' onClick={fetchBalance}>
                  Try Again
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Network Information */}
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Network Information</h2>
          </CardHeader>
          <CardBody>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Current Network</p>
                <p className='font-semibold'>
                  {isLocalChain ? 'Hardhat Local' : `Chain ID: ${chainId}`}
                </p>
              </div>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm text-gray-600'>Environment</p>
                <Chip 
                  color={isLocalChain ? 'warning' : 'success'} 
                  variant='flat'
                  size='sm'
                >
                  {isLocalChain ? 'Test Environment' : 'Production'}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
