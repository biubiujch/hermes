'use client';

import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input, 
  Chip, 
  Spinner, 
  addToast,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { useAccount, useSignTypedData, useChainId } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useVault } from '../../hooks/useVault';
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

import { parseEther, zeroAddress } from 'viem';

interface Pool {
  id: number;
  owner: string;
  totalBalance: string;
  isActive: boolean;
  createdAt: number;
  lastActivityAt: number;
}

interface VaultConfig {
  maxPoolsPerUser: number;
  minPoolBalance: string;
  feeRate: number;
  feeCollector: string;
  supportedTokens: {
    [key: string]: string | boolean;
    isSupported: boolean;
  };
}

type ActionType = 'create' | 'deposit' | 'withdraw' | 'delete';

export default function Vault() {
  const { address, isConnected } = useAccount();
  const { balance } = useWalletBalance();
  const chainId = useChainId();

  // Vault API hooks
  const {
    getVaultConfig,
    getUserPools,
    createPool,
    deletePool,
    depositFunds,
    withdrawFunds,
    getTokenApprovalStatus,
    getUserNonce,
    getDomainSeparator,
    verifySignature
  } = useVault();

  // App config for contract addresses
  const [appConfig, setAppConfig] = useState<any>(null);

  // State management
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [pools, setPools] = useState<Pool[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<any>(null);
  
  // Form states
  const [createAmount, setCreateAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);
  
  // Loading states for different actions
  const [loadingStates, setLoadingStates] = useState({
    config: false,
    pools: false,
    approval: false,
    create: false,
    deposit: false,
    withdraw: false,
    delete: false
  });

  // Modal states
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [signatureData, setSignatureData] = useState<any>(null);
  const [currentAction, setCurrentAction] = useState<ActionType>('create');

  // Wagmi sign typed data hook
  const { signTypedDataAsync, isPending: isSigning } = useSignTypedData();

  const showToast = (title: string, description: string, type: 'success' | 'error' = 'success') => {
    addToast({
      hideIcon: false,
      title: title,
      description: description,
      color: type === 'success' ? 'success' : 'danger',
      classNames: {
        closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2'
      }
    });
  };

  // Helper function to update loading state
  const setLoading = useCallback((key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  // Load vault configuration
  const loadVaultConfig = useCallback(async () => {
    if (!address) return;
    
    setLoading('config', true);
    try {
      const config = await getVaultConfig();
      if (config) {
        setVaultConfig(config);
      }
    } catch (error) {
      console.error('Failed to load vault config:', error);
      showToast('Error', 'Failed to load vault configuration', 'error');
    } finally {
      setLoading('config', false);
    }
  }, [address, getVaultConfig, setLoading]);

  // Load user pools
  const loadUserPools = useCallback(async () => {
    if (!address) return;
    
    setLoading('pools', true);
    try {
      const userPools = await getUserPools(address);
      if (userPools) {
        setPools(userPools.pools);
      }
    } catch (error) {
      console.error('Failed to load user pools:', error);
      showToast('Error', 'Failed to load user pools', 'error');
    } finally {
      setLoading('pools', false);
    }
  }, [address, getUserPools, setLoading]);

  // Load approval status
  const loadApprovalStatus = useCallback(async () => {
    if (!address) return;
    
    setLoading('approval', true);
    try {
      const status = await getTokenApprovalStatus(address, zeroAddress);
      if (status) {
        setApprovalStatus(status);
      }
    } catch (error) {
      console.error('Failed to load approval status:', error);
    } finally {
      setLoading('approval', false);
    }
  }, [address, getTokenApprovalStatus, setLoading]);

  // Load app config
  const loadAppConfig = useCallback(async () => {
    setLoading('config', true);
    try {
      const response = await fetch('/api/wallet/config');
      const data = await response.json();
      if (data.success) {
        setAppConfig(data.data.config);
      }
    } catch (error) {
      console.error('Failed to load app config:', error);
    } finally {
      setLoading('config', false);
    }
  }, [setLoading]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadVaultConfig(),
      loadUserPools(),
      loadApprovalStatus(),
      loadAppConfig()
    ]);
  }, [loadVaultConfig, loadUserPools, loadApprovalStatus, loadAppConfig]);

  // Load data on mount and when address changes
  useEffect(() => {
    if (isConnected && address) {
      refreshAll();
    }
  }, [isConnected, address, refreshAll]);

  // Prepare signature data for different actions
  const prepareSignatureData = useCallback(async (action: ActionType, amount: string, poolId?: number) => {
    console.log('prepareSignatureData called with:', { action, amount, poolId });
    
    if (!address) {
      console.log('No address available');
      return null;
    }

    try {
      console.log('Getting nonce for address:', address);
      // Get nonce
      const nonceResponse = await getUserNonce(address);
      console.log('Nonce response:', nonceResponse);
      
      if (!nonceResponse) throw new Error('Failed to get nonce');

      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const nonce = nonceResponse.nonce;

      // EIP-712 域名
      const domain = {
        name: "Hermora Vault",
        version: "1",
        chainId: chainId, // 本地网络
        verifyingContract: appConfig?.contracts?.vault || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" // Vault 合约地址
      };

      let types: any;
      let primaryType: string;
      let message: any;

      switch (action) {
        case 'create':
          // 消息类型 - 按照后端标准格式
          types = {
            CreatePool: [
              { name: 'walletAddress', type: 'address' },
              { name: 'initialAmount', type: 'uint256' },
              { name: 'tokenAddress', type: 'address' },
              { name: 'nonce', type: 'uint256' },
              { name: 'deadline', type: 'uint256' }
            ]
          };
          primaryType = 'CreatePool';
          // 消息数据
          message = {
            walletAddress: address,
            initialAmount: parseEther(amount), // 转换为 wei
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH 地址
            nonce: nonce, // 从 API 获取
            deadline: deadline // 当前时间 + 1小时
          };
          break;

        case 'deposit':
          // 消息类型 - 按照后端标准格式
          types = {
            Deposit: [
              { name: 'walletAddress', type: 'address' },
              { name: 'poolId', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              { name: 'tokenAddress', type: 'address' },
              { name: 'nonce', type: 'uint256' },
              { name: 'deadline', type: 'uint256' }
            ]
          };
          primaryType = 'Deposit';
          // 消息数据
          message = {
            walletAddress: address,
            poolId: poolId, // 资金池 ID - 不需要 BigInt 转换
            amount: parseEther(amount), // 转换为 wei
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH 地址
            nonce: nonce, // 从 API 获取
            deadline: deadline // 当前时间 + 1小时
          };
          break;

        case 'withdraw':
          // 消息类型 - 按照后端标准格式
          types = {
            Withdraw: [
              { name: 'walletAddress', type: 'address' },
              { name: 'poolId', type: 'uint256' },
              { name: 'amount', type: 'uint256' },
              { name: 'tokenAddress', type: 'address' },
              { name: 'nonce', type: 'uint256' },
              { name: 'deadline', type: 'uint256' }
            ]
          };
          primaryType = 'Withdraw';
          // 消息数据
          message = {
            walletAddress: address,
            poolId: poolId, // 资金池 ID - 不需要 BigInt 转换
            amount: parseEther(amount), // 转换为 wei
            tokenAddress: "0x0000000000000000000000000000000000000000", // ETH 地址
            nonce: nonce, // 从 API 获取
            deadline: deadline // 当前时间 + 1小时
          };
          break;

        case 'delete':
          // 消息类型 - 按照后端标准格式
          types = {
            DeletePool: [
              { name: 'walletAddress', type: 'address' },
              { name: 'poolId', type: 'uint256' },
              { name: 'nonce', type: 'uint256' },
              { name: 'deadline', type: 'uint256' }
            ]
          };
          primaryType = 'DeletePool';
          // 消息数据
          message = {
            walletAddress: address,
            poolId: poolId, // 资金池 ID - 不需要 BigInt 转换
            nonce: nonce, // 从 API 获取
            deadline: deadline // 当前时间 + 1小时
          };
          break;

        default:
          throw new Error('Invalid action type');
      }

      return {
        domain,
        types,
        primaryType,
        message,
        action,
        amount,
        poolId
      };
    } catch (error) {
      console.error('Failed to prepare signature data:', error);
      showToast('Error', 'Failed to prepare signature data', 'error');
      return null;
    }
  }, [address, chainId, getUserNonce, appConfig]);

  // Handle signature confirmation
  const handleSignatureConfirm = useCallback(async () => {
    if (!signatureData) return;

    try {
      // 生成签名 - 使用正确的 EIP-712 格式
      const signature = await signTypedDataAsync({
        domain: signatureData.domain,
        types: signatureData.types,
        primaryType: signatureData.primaryType,
        message: signatureData.message,
        account: address
      });

      // Submit the transaction based on action type
      let success = false;
      
      switch (signatureData.action) {
        case 'create':
          success = await createPool({
            walletAddress: address!,
            initialAmount: signatureData.amount,
            tokenAddress: zeroAddress,
            nonce: signatureData.message.nonce,
            deadline: signatureData.message.deadline,
            signature
          });
          if (success) {
            showToast('Success', 'Pool created successfully!', 'success');
            setCreateAmount('');
            await loadUserPools();
          }
          break;

        case 'deposit':
          success = await depositFunds(signatureData.poolId, {
            walletAddress: address!,
            amount: signatureData.amount,
            tokenAddress: zeroAddress,
            nonce: signatureData.message.nonce,
            deadline: signatureData.message.deadline,
            signature
          });
          if (success) {
            showToast('Success', 'Deposit successful!', 'success');
            setDepositAmount('');
            await loadUserPools();
          }
          break;

        case 'withdraw':
          success = await withdrawFunds(signatureData.poolId, {
            walletAddress: address!,
            amount: signatureData.amount,
            tokenAddress: zeroAddress,
            nonce: signatureData.message.nonce,
            deadline: signatureData.message.deadline,
            signature
          });
          if (success) {
            showToast('Success', 'Withdrawal successful!', 'success');
            setWithdrawAmount('');
            await loadUserPools();
          }
          break;

        case 'delete':
          success = await deletePool(signatureData.poolId, {
            walletAddress: address!,
            nonce: signatureData.message.nonce,
            deadline: signatureData.message.deadline,
            signature
          });
          if (success) {
            showToast('Success', 'Pool deleted successfully!', 'success');
            await loadUserPools();
          }
          break;
      }

      if (!success) {
        showToast('Error', 'Transaction failed', 'error');
      }

      onOpenChange();
      setSignatureData(null);
    } catch (error) {
      console.error('Signature failed:', error);
      showToast('Error', 'Signature was rejected or failed', 'error');
      onOpenChange();
      setSignatureData(null);
    }
  }, [signatureData, signTypedDataAsync, address, createPool, depositFunds, withdrawFunds, deletePool, loadUserPools, onOpenChange]);

  // Action handlers
  const handleCreatePool = async () => {
    console.log('Create Pool button clicked');
    console.log('createAmount:', createAmount);
    console.log('address:', address);
    console.log('isConnected:', isConnected);
    
    if (!createAmount || parseFloat(createAmount) <= 0) {
      console.log('Invalid amount or no amount');
      return;
    }
    
    if (!address) {
      console.log('No wallet address');
      return;
    }
    
    setLoading('create', true);
    try {
      console.log('Preparing signature data...');
      const data = await prepareSignatureData('create', createAmount);
      console.log('Signature data prepared:', data);
      
      if (data) {
        setSignatureData(data);
        setCurrentAction('create');
        onOpen();
      } else {
        console.log('No signature data returned');
      }
    } catch (error) {
      console.error('Failed to create pool:', error);
      showToast('Error', 'Failed to create pool', 'error');
    } finally {
      setLoading('create', false);
    }
  };

  const handleDeletePool = async (poolId: number) => {
    setLoading('delete', true);
    try {
      const data = await prepareSignatureData('delete', '0', poolId);
      if (data) {
        setSignatureData(data);
        setCurrentAction('delete');
        onOpen();
      }
    } catch (error) {
      console.error('Failed to delete pool:', error);
      showToast('Error', 'Failed to delete pool', 'error');
    } finally {
      setLoading('delete', false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !selectedPoolId) return;
    
    setLoading('deposit', true);
    try {
      const data = await prepareSignatureData('deposit', depositAmount, selectedPoolId);
      if (data) {
        setSignatureData(data);
        setCurrentAction('deposit');
        onOpen();
      }
    } catch (error) {
      console.error('Failed to deposit:', error);
      showToast('Error', 'Failed to deposit funds', 'error');
    } finally {
      setLoading('deposit', false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || !selectedPoolId) return;
    
    setLoading('withdraw', true);
    try {
      const data = await prepareSignatureData('withdraw', withdrawAmount, selectedPoolId);
      if (data) {
        setSignatureData(data);
        setCurrentAction('withdraw');
        onOpen();
      }
    } catch (error) {
      console.error('Failed to withdraw:', error);
      showToast('Error', 'Failed to withdraw funds', 'error');
    } finally {
      setLoading('withdraw', false);
    }
  };

  // Use a mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until client-side mounting is complete
  if (!mounted) {
    return <Spinner>Loading...</Spinner>;
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

  const isLoading = Object.values(loadingStates).some(Boolean);

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
            <Button color='primary' variant='flat' onClick={refreshAll} isLoading={isLoading}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
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
                    <span className='font-medium'>{pools?.length || 0}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-green-600'>Active Pools</span>
                    <span className='font-medium'>{pools?.filter((p) => p.isActive).length || 0}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-green-600'>Total Balance</span>
                    <span className='font-medium'>
                      {formatCurrency(pools?.reduce((sum, pool) => sum + parseFloat(pool.totalBalance), 0) || 0)}
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
                    <span className='font-medium'>{balance ? formatCurrency(balance.usdt) : 'Loading...'}</span>
                  </div>
                  {approvalStatus && (
                    <div className='flex justify-between'>
                      <span className='text-purple-600'>Approval Status</span>
                      <Chip color={approvalStatus.needsApproval ? 'warning' : 'success'} variant='flat' size='sm'>
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
              startContent={<CurrencyDollarIcon className='w-4 h-4 text-gray-400' />}
            />

            <Button
              color='success'
              variant='flat'
              startContent={<PlusIcon className='w-4 h-4' />}
              onPress={handleCreatePool}
              isLoading={loadingStates.create}
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
      {pools && pools.length > 0 && (
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
                      <p className='text-sm text-gray-600'>Created: {formatTime(new Date(pool.createdAt * 1000))}</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Chip color={pool.isActive ? 'success' : 'default'} variant='flat' size='sm'>
                        {pool.isActive ? 'Active' : 'Inactive'}
                      </Chip>
                      <Button
                        color='danger'
                        variant='flat'
                        size='sm'
                        startContent={<TrashIcon className='w-3 h-3' />}
                        onClick={() => handleDeletePool(pool.id)}
                        isLoading={loadingStates.delete}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div className='p-3 bg-white rounded border'>
                      <p className='text-sm text-gray-600'>Total Balance</p>
                      <p className='text-lg font-semibold text-green-600'>{formatCurrency(pool.totalBalance)}</p>
                    </div>
                    <div className='p-3 bg-white rounded border'>
                      <p className='text-sm text-gray-600'>Last Activity</p>
                      <p className='text-sm font-medium'>{formatTime(new Date(pool.lastActivityAt * 1000))}</p>
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
                        isLoading={loadingStates.deposit && selectedPoolId === pool.id}
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
                        isLoading={loadingStates.withdraw && selectedPoolId === pool.id}
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
      {(!pools || pools.length === 0) && (
        <Card>
          <CardBody className='text-center py-12'>
            <BanknotesIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-600 mb-2'>No Pools Yet</h3>
            <p className='text-gray-500 mb-4'>Create your first pool to start earning yields</p>
            <Button
              color='primary'
              variant='flat'
              onClick={() => document.getElementById('create-pool')?.scrollIntoView()}
            >
              Create Pool
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Signature Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm {currentAction === 'create' ? 'Pool Creation' : 
                         currentAction === 'deposit' ? 'Deposit' :
                         currentAction === 'withdraw' ? 'Withdrawal' : 'Pool Deletion'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Transaction Details</h4>
                    <div className="space-y-2 text-sm">
                      {currentAction === 'create' && (
                        <>
                          <div className="flex justify-between">
                            <span>Initial Amount:</span>
                            <span className="font-medium">{signatureData?.amount} USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Token:</span>
                            <span className="font-medium">USDT</span>
                          </div>
                        </>
                      )}
                      {currentAction === 'deposit' && (
                        <>
                          <div className="flex justify-between">
                            <span>Pool ID:</span>
                            <span className="font-medium">#{signatureData?.poolId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deposit Amount:</span>
                            <span className="font-medium">{signatureData?.amount} USDT</span>
                          </div>
                        </>
                      )}
                      {currentAction === 'withdraw' && (
                        <>
                          <div className="flex justify-between">
                            <span>Pool ID:</span>
                            <span className="font-medium">#{signatureData?.poolId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Withdraw Amount:</span>
                            <span className="font-medium">{signatureData?.amount} USDT</span>
                          </div>
                        </>
                      )}
                      {currentAction === 'delete' && (
                        <>
                          <div className="flex justify-between">
                            <span>Pool ID:</span>
                            <span className="font-medium">#{signatureData?.poolId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Action:</span>
                            <span className="font-medium text-red-600">Delete Pool</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">Signature Required</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Please review the transaction details above and sign the message in your wallet to proceed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSignatureConfirm}
                  isLoading={isSigning}
                >
                  {isSigning ? 'Signing...' : 'Sign & Confirm'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
