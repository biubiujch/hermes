'use client';

import { useState, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Spinner, addToast, Form } from '@heroui/react';
import { useStrategy } from '@/hooks/useStrategy';
import type { StrategyParams, RegisterStrategyRequest } from '@/lib/account/strategy';
import { useAccount, useSignTypedData, useChainId } from 'wagmi';


interface CreateStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export default function CreateStrategyModal({ isOpen, onClose, walletAddress }: CreateStrategyModalProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync, isPending: isSigning } = useSignTypedData();

  const { loading, error, registerStrategy, getUserNonce } = useStrategy();

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

  const prepareSignatureData = useCallback(async (formData: StrategyParams) => {
    if (!address || !formData.symbol) return null;

    try {
      const nonceResponse = await getUserNonce(address);
      if (!nonceResponse) throw new Error('Failed to get nonce');

      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const nonce = nonceResponse.nonce;

      console.log('[CreateStrategy] Nonce fetched:', { walletAddress: address, nonce });

      // 调用后端计算哈希和获取签名数据
      const computeHashResponse = await fetch('/api/strategy/compute-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          params: formData,
          symbol: formData.symbol,
          nonce: nonce,
          deadline: deadline
        })
      });

      if (!computeHashResponse.ok) {
        throw new Error('Failed to compute hash');
      }

      const computeHashResult = await computeHashResponse.json();
      if (!computeHashResult.success) {
        throw new Error(computeHashResult.error || 'Failed to compute hash');
      }

      const { signatureData } = computeHashResult.data;

      console.log('[CreateStrategy] Compute-hash response:', {
        paramsHash: computeHashResult.data.paramsHash,
        symbolBytes32: computeHashResult.data.symbolBytes32,
        messageNonce: signatureData?.message?.nonce,
        deadlineUsed: signatureData?.message?.deadline
      });

      if (signatureData?.message?.nonce !== nonce) {
        console.warn('[CreateStrategy] Nonce mismatch!', { fetchedNonce: nonce, messageNonce: signatureData?.message?.nonce });
      }

      return {
        domain: signatureData.domain,
        types: signatureData.types,
        primaryType: signatureData.primaryType,
        message: signatureData.message,
        paramsHash: computeHashResult.data.paramsHash,
        symbolBytes32: computeHashResult.data.symbolBytes32
      };
    } catch (error) {
      console.error('Failed to prepare signature data:', error);
      showToast('Error', 'Failed to prepare signature data', 'error');
      return null;
    }
  }, [address, getUserNonce]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!address) {
      showToast('Error', 'Please connect wallet', 'error');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const strategyData: StrategyParams = {
      symbol: formData.get('symbol') as string,
      leverage: parseFloat(formData.get('leverage') as string),
      takeProfit: parseFloat(formData.get('takeProfit') as string),
      stopLoss: parseFloat(formData.get('stopLoss') as string),
      amountLimit: formData.get('amountLimit') as string,
      maxDrawdown: parseFloat(formData.get('maxDrawdown') as string),
      freq: formData.get('freq') as string,
      riskLevel: formData.get('riskLevel') as string
    };

    if (!strategyData.symbol) {
      showToast('Error', 'Please enter a symbol', 'error');
      return;
    }

    try {
      const signatureData = await prepareSignatureData(strategyData);
      if (!signatureData) return;

      const signature = await signTypedDataAsync({
        domain: signatureData.domain,
        types: signatureData.types,
        primaryType: signatureData.primaryType,
        message: signatureData.message,
        account: address
      });

      // 使用后端计算的哈希值和符号字节
      const request: RegisterStrategyRequest = {
        walletAddress: address,
        params: strategyData,
        symbol: strategyData.symbol,
        nonce: signatureData.message.nonce,
        deadline: signatureData.message.deadline,
        signature,
        paramsHash: signatureData.paramsHash,
        symbolBytes32: signatureData.symbolBytes32
      };

      console.log('Sending strategy registration request:', request);

      const success = await registerStrategy(request);
      if (success) {
        showToast('Success', 'Strategy created successfully!', 'success');
        onClose();
      } else {
        showToast('Error', 'Failed to create strategy', 'error');
      }
    } catch (err: any) {
      console.error('Failed to create strategy:', err);
      showToast('Error', 'Failed to create strategy', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Create New Strategy</ModalHeader>
        <ModalBody>
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Symbol"
              placeholder="ETH"
              name="symbol"
              isRequired
              errorMessage="Please enter a symbol"
            />

            <Input
              label="Leverage"
              type="number"
              name="leverage"
              min="1"
              max="10"
              step="0.1"
              defaultValue="1"
              isRequired
              errorMessage="Please enter a valid leverage"
            />

            <Input
              label="Take Profit (%)"
              type="number"
              name="takeProfit"
              min="0.01"
              max="1"
              step="0.01"
              defaultValue="0.05"
              isRequired
              errorMessage="Please enter a valid take profit percentage"
            />

            <Input
              label="Stop Loss (%)"
              type="number"
              name="stopLoss"
              min="0.01"
              max="1"
              step="0.01"
              defaultValue="0.02"
              isRequired
              errorMessage="Please enter a valid stop loss percentage"
            />

            <Input
              label="Amount Limit"
              placeholder="1000 USDT"
              name="amountLimit"
              defaultValue="1000 USDT"
              isRequired
              errorMessage="Please enter an amount limit"
            />

            <Input
              label="Max Drawdown (%)"
              type="number"
              name="maxDrawdown"
              min="0.01"
              max="1"
              step="0.01"
              defaultValue="0.1"
              isRequired
              errorMessage="Please enter a valid max drawdown percentage"
            />

            <Select
              label="Frequency"
              name="freq"
              defaultSelectedKeys={["1h"]}
              isRequired
              errorMessage="Please select a frequency"
            >
              <SelectItem key="1h">1 Hour</SelectItem>
              <SelectItem key="4h">4 Hours</SelectItem>
              <SelectItem key="1d">1 Day</SelectItem>
            </Select>

            <Select
              label="Risk Level"
              name="riskLevel"
              defaultSelectedKeys={["medium"]}
              isRequired
              errorMessage="Please select a risk level"
            >
              <SelectItem key="low">Low</SelectItem>
              <SelectItem key="medium">Medium</SelectItem>
              <SelectItem key="high">High</SelectItem>
            </Select>

            {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            <ModalFooter>
              <Button variant="bordered" onPress={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={loading || isSigning}
              >
                Create Strategy
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
