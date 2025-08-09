'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Badge, Spinner, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { PlusIcon, PlayIcon, PauseIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useStrategy } from '@/hooks/useStrategy';
import type { Strategy } from '@/lib/account/strategy';
import CreateStrategyModal from '@/components/strategy/CreateStrategyModal';
import { useAccount, useSignTypedData, useChainId } from 'wagmi';

export default function Strategy() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync, isPending: isSigning } = useSignTypedData();
  
  const { 
    loading, 
    error, 
    getUserStrategies, 
    setStrategyActive, 
    deleteStrategy,
    getUserNonce
  } = useStrategy();
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmContext, setConfirmContext] = useState<{ type: 'toggle' | 'delete'; strategyId: number; nextActive?: boolean } | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadStrategies(address);
      loadAppConfig();
    }
  }, [isConnected, address]);

  const loadStrategies = async (address: string) => {
    const result = await getUserStrategies(address);
    const list = result?.strategies ?? [];
    setStrategies(Array.isArray(list) ? list : []);
  };

  const loadAppConfig = async () => {
    try {
      // 获取策略配置，包含合约地址和 EIP-712 域名信息
      const response = await fetch('/api/strategy/config');
      const data = await response.json();
      if (data.success) {
        setAppConfig(data.data);
      }
    } catch (error) {
      console.error('Failed to load strategy config:', error);
    }
  };

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

  const prepareSignatureData = useCallback(async (action: 'toggle' | 'delete', strategyId: number, active?: boolean) => {
    if (!address) return null;

    try {
      const nonceResponse = await getUserNonce(address);
      if (!nonceResponse) throw new Error('Failed to get nonce');

      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const nonce = nonceResponse.nonce;

      const domain = {
        name: appConfig?.eip712Domain?.name || "Hermora Strategy",
        version: appConfig?.eip712Domain?.version || "1",
        chainId: appConfig?.eip712Domain?.chainId || chainId,
        verifyingContract: appConfig?.eip712Domain?.verifyingContract
      };

      let types: any;
      let primaryType: string;
      let message: any;

      if (action === 'toggle') {
        types = {
          SetStrategyActive: [
            { name: 'walletAddress', type: 'address' },
            { name: 'strategyId', type: 'uint256' },
            { name: 'active', type: 'bool' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
          ]
        };
        primaryType = 'SetStrategyActive';
        message = {
          walletAddress: address,
          strategyId: BigInt(strategyId),
          active: active,
          nonce: nonce,
          deadline: deadline
        };
      } else {
        types = {
          DeleteStrategy: [
            { name: 'walletAddress', type: 'address' },
            { name: 'strategyId', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' }
          ]
        };
        primaryType = 'DeleteStrategy';
        message = {
          walletAddress: address,
          strategyId: BigInt(strategyId),
          nonce: nonce,
          deadline: deadline
        };
      }

      return {
        domain,
        types,
        primaryType,
        message,
        action,
        strategyId,
        active
      };
    } catch (error) {
      console.error('Failed to prepare signature data:', error);
      showToast('Error', 'Failed to prepare signature data', 'error');
      return null;
    }
  }, [address, chainId, getUserNonce, appConfig]);

  const handleSignatureConfirm = useCallback(async (signatureData: any) => {
    try {
      const signature = await signTypedDataAsync({
        domain: signatureData.domain,
        types: signatureData.types,
        primaryType: signatureData.primaryType,
        message: signatureData.message,
        account: address
      });

      let success = false;
      
      if (signatureData.action === 'toggle') {
        success = await setStrategyActive(signatureData.strategyId, {
          walletAddress: address!,
          active: signatureData.active,
          nonce: signatureData.message.nonce,
          deadline: signatureData.message.deadline,
          signature
        });
        if (success) {
          showToast('Success', 'Strategy status updated successfully!', 'success');
          await loadStrategies(address!);
        }
      } else if (signatureData.action === 'delete') {
        success = await deleteStrategy(signatureData.strategyId, {
          walletAddress: address!,
          nonce: signatureData.message.nonce,
          deadline: signatureData.message.deadline,
          signature
        });
        if (success) {
          showToast('Success', 'Strategy deleted successfully!', 'success');
          await loadStrategies(address!);
        }
      }

      if (!success) {
        showToast('Error', 'Transaction failed', 'error');
      }
    } catch (error) {
      console.error('Signature failed:', error);
      showToast('Error', 'Signature was rejected or failed', 'error');
    }
  }, [signTypedDataAsync, address, setStrategyActive, deleteStrategy]);

  const handleToggleActive = async (strategyId: number, currentActive: boolean) => {
    if (!address) return;

    setConfirmContext({ type: 'toggle', strategyId, nextActive: !currentActive });
    setConfirmOpen(true);
  };

  const handleDeleteStrategy = async (strategyId: number) => {
    if (!address) return;

    setConfirmContext({ type: 'delete', strategyId });
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmContext || !address) return;

    try {
      setConfirming(true);
      if (confirmContext.type === 'toggle') {
        const data = await prepareSignatureData('toggle', confirmContext.strategyId, confirmContext.nextActive);
        if (data) {
          await handleSignatureConfirm(data);
        }
      } else if (confirmContext.type === 'delete') {
        const data = await prepareSignatureData('delete', confirmContext.strategyId);
        if (data) {
          await handleSignatureConfirm(data);
        }
      }
      setConfirmOpen(false);
      setConfirmContext(null);
    } finally {
      setConfirming(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'active' : 'paused';
  };

  const handleCreateStrategy = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    // Reload strategies after creation
    if (address) {
      loadStrategies(address);
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
          <PlusIcon className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-600 mb-2'>Wallet Not Connected</h2>
          <p className='text-gray-500'>Please connect your wallet to access strategy management</p>
        </CardBody>
      </Card>
    );
  }

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
            onPress={handleCreateStrategy}
          >
            Create Strategy
          </Button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-gray-900'>{strategies.length}</p>
                <p className='text-sm text-gray-600'>Total Strategies</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-green-600'>
                  {strategies.filter(s => s.isActive).length}
                </p>
                <p className='text-sm text-gray-600'>Active</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-orange-600'>
                  {strategies.filter(s => !s.isActive).length}
                </p>
                <p className='text-sm text-gray-600'>Paused</p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className='p-6'>
              <div className='text-center'>
                <p className='text-2xl font-bold text-gray-900'>-</p>
                <p className='text-sm text-gray-600'>Total P&L</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className='mb-6'>
            <CardBody className='p-4'>
              <p className='text-red-600'>{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Strategies List */}
        <Card>
          <CardHeader>
            <h2 className='text-xl font-semibold'>Your Strategies</h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className='flex justify-center items-center py-8'>
                <Spinner size='lg' />
              </div>
            ) : strategies.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-gray-600 mb-4'>No strategies found</p>
                <Button 
                  color='primary' 
                  startContent={<PlusIcon className='w-4 h-4' />}
                  onPress={handleCreateStrategy}
                >
                  Create Your First Strategy
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {strategies.map((strategy) => (
                  <div 
                    key={strategy.id}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center space-x-4'>
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {strategy.symbol} Strategy #{strategy.id}
                        </h3>
                        <div className='flex items-center space-x-2 mt-1'>
                          <Chip size='sm' variant='flat'>{strategy.symbol}/USDT</Chip>
                          <Chip 
                            size='sm' 
                            color={strategy.params.leverage > 1 ? 'success' : 'default'}
                            variant='flat'
                          >
                            {strategy.params.leverage}x Leverage
                          </Chip>
                          <Badge 
                            color={getStatusColor(strategy.isActive)}
                            variant='flat'
                          >
                            {getStatusText(strategy.isActive)}
                          </Badge>
                        </div>
                        <div className='flex items-center space-x-2 mt-2'>
                          <span className='text-sm text-gray-600'>
                            TP: {strategy.params.takeProfit * 100}% | 
                            SL: {strategy.params.stopLoss * 100}% | 
                            Risk: {strategy.params.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <div className='text-right'>
                        <p className='text-sm text-gray-600'>
                          Created: {new Date(strategy.createdAt * 1000).toLocaleDateString()}
                        </p>
                        <p className='text-sm text-gray-600'>
                          Last Activity: {new Date(strategy.lastActivityAt * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className='flex items-center space-x-2'>
                        <Button 
                          size='sm' 
                          variant='bordered' 
                          color={strategy.isActive ? 'warning' : 'success'}
                          onClick={() => handleToggleActive(strategy.id, strategy.isActive)}
                          disabled={loading}
                        >
                          {strategy.isActive ? (
                            <PauseIcon className='w-4 h-4' />
                          ) : (
                            <PlayIcon className='w-4 h-4' />
                          )}
                        </Button>
                        <Button 
                          size='sm' 
                          variant='bordered' 
                          color='danger'
                          onClick={() => handleDeleteStrategy(strategy.id)}
                          disabled={loading}
                        >
                          <TrashIcon className='w-4 h-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Create Strategy Modal */}
      <CreateStrategyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        walletAddress={address || ''}
      />

      {/* Confirm Action Modal */}
      <Modal isOpen={confirmOpen} onClose={() => !confirming && setConfirmOpen(false)}>
        <ModalContent>
          <ModalHeader>
            {confirmContext?.type === 'delete'
              ? `Delete Strategy #${confirmContext?.strategyId}`
              : confirmContext?.nextActive
              ? `Activate Strategy #${confirmContext?.strategyId}`
              : `Pause Strategy #${confirmContext?.strategyId}`}
          </ModalHeader>
          <ModalBody>
            {confirmContext?.type === 'delete'
              ? 'This action cannot be undone. Are you sure you want to delete this strategy?'
              : confirmContext?.nextActive
              ? 'Do you want to activate this strategy?'
              : 'Do you want to pause this strategy?'}
          </ModalBody>
          <ModalFooter>
            <Button variant='flat' onPress={() => setConfirmOpen(false)} isDisabled={confirming}>
              Cancel
            </Button>
            <Button color={confirmContext?.type === 'delete' ? 'danger' : 'primary'} onPress={handleConfirmAction} isLoading={confirming}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
