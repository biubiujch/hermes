'use client';

import { Card, CardBody, CardHeader, Button, Input, Chip, Spinner, addToast } from '@heroui/react';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { useVault } from '../../hooks/useVault';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { 
  BanknotesIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CogIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { formatTime } from '../../lib/utils/date';
import { formatNumber, formatCurrency } from '../../lib/utils/number';

export default function Vault() {
  const { address, isConnected } = useAccount();
  const { balance } = useWalletBalance();
  const { 
    pools, 
    vaultConfig, 
    approvalStatus, 
    loading, 
    error, 
    mounted,
    createPool, 
    deletePool, 
    mergePools,
    depositFunds, 
    withdrawFunds, 
    refreshAll 
  } = useVault();
  
  const [createAmount, setCreateAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

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

  const handleCreatePool = async () => {
    if (!address || !createAmount) return;
    
    setIsCreating(true);
    try {
      const result = await createPool(createAmount);
      setCreateAmount('');
      showToast('Success', `Pool created successfully! Pool ID: ${result.poolId}`, 'success');
    } catch (error: any) {
      console.error('Create pool error:', error);
      showToast('Error', error.message || 'Failed to create pool. Please try again.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePool = async (poolId: number) => {
    if (!address) return;
    
    try {
      const result = await deletePool(poolId);
      showToast('Success', 'Pool deleted successfully!', 'success');
    } catch (error: any) {
      console.error('Delete pool error:', error);
      showToast('Error', error.message || 'Failed to delete pool. Please try again.', 'error');
    }
  };

  const handleDeposit = async () => {
    if (!address || !selectedPoolId || !depositAmount) return;
    
    setIsDepositing(true);
    try {
      const result = await depositFunds(selectedPoolId, depositAmount);
      setDepositAmount('');
      showToast('Success', 'Deposit completed successfully!', 'success');
    } catch (error: any) {
      console.error('Deposit error:', error);
      showToast('Error', error.message || 'Failed to deposit. Please try again.', 'error');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!address || !selectedPoolId || !withdrawAmount) return;
    
    setIsWithdrawing(true);
    try {
      const result = await withdrawFunds(selectedPoolId, withdrawAmount);
      setWithdrawAmount('');
      showToast('Success', 'Withdrawal completed successfully!', 'success');
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      showToast('Error', error.message || 'Failed to withdraw. Please try again.', 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Don't render until client-side mounting is complete
  if (!mounted) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Card className='max-w-2xl mx-auto'>
        <CardBody className='text-center py-12'>
          <BanknotesIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-600 mb-2'>Wallet Not Connected</h2>
          <p className='text-gray-500'>Please connect your wallet to access vault management</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Vault Overview */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Vault Management</h1>
              <p className='text-gray-600 mt-1'>Manage your funds in the yield vault</p>
            </div>
            <Button 
              color='primary' 
              variant='flat' 
              onClick={refreshAll}
              isLoading={loading}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {error && (
            <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-center'>
                <ExclamationTriangleIcon className='w-5 h-5 text-red-500 mr-2' />
                <span className='text-red-700'>{error}</span>
              </div>
            </div>
          )}

          {vaultConfig && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-blue-800'>Vault Config</h3>
                  <CogIcon className='w-5 h-5 text-blue-600' />
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-blue-600'>Max Pools Per User</span>
                    <span className='font-medium'>{vaultConfig.maxPoolsPerUser}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-blue-600'>Min Pool Balance</span>
                    <span className='font-medium'>{vaultConfig.minPoolBalance}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-blue-600'>Fee Rate</span>
                    <span className='font-medium'>{vaultConfig.feeRate}%</span>
                  </div>
                </div>
              </div>

              <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-green-800'>Your Pools</h3>
                  <BanknotesIcon className='w-5 h-5 text-green-600' />
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-green-600'>Total Pools</span>
                    <span className='font-medium'>{pools.length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-green-600'>Active Pools</span>
                    <span className='font-medium'>{pools.filter(p => p.isActive).length}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-green-600'>Total Balance</span>
                    <span className='font-medium'>
                      {formatCurrency(pools.reduce((sum, pool) => sum + parseFloat(pool.totalBalance), 0))}
                    </span>
                  </div>
                </div>
              </div>

              <div className='p-4 bg-purple-50 rounded-lg border border-purple-200'>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='text-lg font-semibold text-purple-800'>Wallet Balance</h3>
                  <CurrencyDollarIcon className='w-5 h-5 text-purple-600' />
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-purple-600'>USDT Balance</span>
                    <span className='font-medium'>
                      {balance ? formatCurrency(balance.usdt) : 'Loading...'}
                    </span>
                  </div>
                  {approvalStatus && (
                    <div className='flex justify-between'>
                      <span className='text-purple-600'>Approval Status</span>
                      <Chip 
                        color={approvalStatus.needsApproval ? 'warning' : 'success'} 
                        variant='flat'
                        size='sm'
                      >
                        {approvalStatus.needsApproval ? 'Needs Approval' : 'Approved'}
                      </Chip>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Pool */}
      <Card>
        <CardHeader>
          <h2 className='text-lg font-semibold flex items-center'>
            <PlusIcon className='w-5 h-5 mr-2 text-green-600' />
            Create New Pool
          </h2>
        </CardHeader>
        <CardBody>
          <div className='space-y-4'>
            <Input
              type='number'
              label='Initial Amount (USDT)'
              value={createAmount}
              onChange={(e) => setCreateAmount(e.target.value)}
              placeholder='100.00'
              min='0.01'
              step='0.01'
              startContent={
                <CurrencyDollarIcon className='w-4 h-4 text-gray-400' />
              }
            />
            
            <Button
              color='success'
              variant='flat'
              startContent={<PlusIcon className='w-4 h-4' />}
              onClick={handleCreatePool}
              isLoading={isCreating}
              fullWidth
              disabled={!createAmount || parseFloat(createAmount) <= 0}
            >
              Create Pool
            </Button>
            
            <div className='text-xs text-gray-500'>
              <p>• Minimum pool balance: {vaultConfig?.minPoolBalance || '0.001'} USDT</p>
              <p>• Maximum pools per user: {vaultConfig?.maxPoolsPerUser || 10}</p>
              <p>• Fee rate: {vaultConfig?.feeRate || 5}%</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Pool Management */}
      {pools.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className='text-lg font-semibold'>Your Pools</h2>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              {pools.map((pool) => (
                <div key={pool.id} className='p-4 bg-gray-50 rounded-lg border'>
                  <div className='flex items-center justify-between mb-3'>
                    <div>
                      <h3 className='font-semibold'>Pool #{pool.id}</h3>
                      <p className='text-sm text-gray-600'>
                        Created: {formatTime(new Date(pool.createdAt * 1000))}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Chip 
                        color={pool.isActive ? 'success' : 'default'} 
                        variant='flat'
                        size='sm'
                      >
                        {pool.isActive ? 'Active' : 'Inactive'}
                      </Chip>
                      <Button
                        color='danger'
                        variant='flat'
                        size='sm'
                        startContent={<TrashIcon className='w-3 h-3' />}
                        onClick={() => handleDeletePool(pool.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='p-3 bg-white rounded border'>
                      <p className='text-sm text-gray-600'>Total Balance</p>
                      <p className='text-lg font-semibold text-green-600'>
                        {formatCurrency(pool.totalBalance)}
                      </p>
                    </div>
                    <div className='p-3 bg-white rounded border'>
                      <p className='text-sm text-gray-600'>Last Activity</p>
                      <p className='text-sm font-medium'>
                        {formatTime(new Date(pool.lastActivityAt * 1000))}
                      </p>
                    </div>
                  </div>

                  {/* Pool Actions */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-3'>
                      <Input
                        type='number'
                        label='Deposit Amount'
                        value={selectedPoolId === pool.id ? depositAmount : ''}
                        onChange={(e) => {
                          setSelectedPoolId(pool.id);
                          setDepositAmount(e.target.value);
                        }}
                        placeholder='0.00'
                        min='0.01'
                        step='0.01'
                        startContent={<CurrencyDollarIcon className='w-4 h-4 text-gray-400' />}
                      />
                      <Button
                        color='success'
                        variant='flat'
                        startContent={<ArrowUpIcon className='w-4 h-4' />}
                        onClick={handleDeposit}
                        isLoading={isDepositing && selectedPoolId === pool.id}
                        fullWidth
                        disabled={!depositAmount || parseFloat(depositAmount) <= 0 || selectedPoolId !== pool.id}
                      >
                        Deposit
                      </Button>
                    </div>

                    <div className='space-y-3'>
                      <Input
                        type='number'
                        label='Withdraw Amount'
                        value={selectedPoolId === pool.id ? withdrawAmount : ''}
                        onChange={(e) => {
                          setSelectedPoolId(pool.id);
                          setWithdrawAmount(e.target.value);
                        }}
                        placeholder='0.00'
                        min='0.01'
                        step='0.01'
                        max={pool.totalBalance}
                        startContent={<CurrencyDollarIcon className='w-4 h-4 text-gray-400' />}
                      />
                      <Button
                        color='danger'
                        variant='flat'
                        startContent={<ArrowDownIcon className='w-4 h-4' />}
                        onClick={handleWithdraw}
                        isLoading={isWithdrawing && selectedPoolId === pool.id}
                        fullWidth
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || selectedPoolId !== pool.id}
                      >
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Empty State */}
      {pools.length === 0 && !loading && (
        <Card>
          <CardBody className='text-center py-12'>
            <BanknotesIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>No Pools Yet</h3>
            <p className='text-gray-500 mb-4'>Create your first pool to start earning yields</p>
            <Button color='primary' variant='flat' onClick={() => document.getElementById('create-pool')?.scrollIntoView()}>
              Create Pool
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
