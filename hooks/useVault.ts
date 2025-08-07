'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { VaultPool, VaultConfig, ApprovalStatus, TransactionData, executeVaultTransaction } from '../lib/account/vault';

export function useVault() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [pools, setPools] = useState<VaultPool[]>([]);
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [networkId, setNetworkId] = useState(31337);

  // 防重复请求的ref
  const requestRefs = useRef<{
    fetchUserPools: boolean;
    fetchVaultConfig: boolean;
    fetchApprovalStatus: boolean;
    createPool: boolean;
    deletePool: boolean;
    mergePools: boolean;
    depositFunds: boolean;
    withdrawFunds: boolean;
  }>({
    fetchUserPools: false,
    fetchVaultConfig: false,
    fetchApprovalStatus: false,
    createPool: false,
    deletePool: false,
    mergePools: false,
    depositFunds: false,
    withdrawFunds: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to execute transaction with wagmi
  const executeTransaction = async (transactionData: TransactionData) => {
    return await executeVaultTransaction(walletClient, transactionData);
  };

  const fetchUserPools = async () => {
    if (!address || requestRefs.current.fetchUserPools) return;

    requestRefs.current.fetchUserPools = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools?walletAddress=${address}&networkId=${networkId}`);
      const result = await response.json();

      if (result.success) {
        setPools(result.data.pools);
      } else {
        throw new Error(result.error || 'Failed to fetch user pools');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch user pools:', err);
    } finally {
      setLoading(false);
      requestRefs.current.fetchUserPools = false;
    }
  };

  const fetchVaultConfig = async () => {
    if (requestRefs.current.fetchVaultConfig) return;

    requestRefs.current.fetchVaultConfig = true;
    try {
      const response = await fetch('/api/vault/config');
      const result = await response.json();

      if (result.success) {
        setVaultConfig(result.data);
      } else {
        console.error('Failed to fetch vault config:', result.error);
      }
    } catch (err: any) {
      console.error('Failed to fetch vault config:', err);
    } finally {
      requestRefs.current.fetchVaultConfig = false;
    }
  };

  const fetchApprovalStatus = async (tokenAddress?: string) => {
    if (!address || requestRefs.current.fetchApprovalStatus) return;

    requestRefs.current.fetchApprovalStatus = true;
    try {
      const url = `/api/vault/approval-status?walletAddress=${address}&networkId=${networkId}${tokenAddress ? `&tokenAddress=${tokenAddress}` : ''}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setApprovalStatus(result.data);
      } else {
        console.error('Failed to fetch approval status:', result.error);
      }
    } catch (err: any) {
      console.error('Failed to fetch approval status:', err);
    } finally {
      requestRefs.current.fetchApprovalStatus = false;
    }
  };

  // New transaction preparation methods
  const prepareCreatePool = async (initialAmount: string, tokenAddress?: string) => {
    if (!address || requestRefs.current.createPool) throw new Error('Request in progress');

    requestRefs.current.createPool = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          initialAmount,
          tokenAddress,
          networkId
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.data as TransactionData;
      } else {
        throw new Error(result.error || 'Failed to prepare create pool transaction');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      requestRefs.current.createPool = false;
    }
  };

  const createPool = async (initialAmount: string, tokenAddress?: string) => {
    const transactionData = await prepareCreatePool(initialAmount, tokenAddress);
    const transactionHash = await executeTransaction(transactionData);

    // Refresh pools after successful creation
    await fetchUserPools();
    return { transactionHash };
  };

  const prepareDeletePool = async (poolId: number) => {
    if (!address || requestRefs.current.deletePool) throw new Error('Request in progress');

    requestRefs.current.deletePool = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          networkId
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.data as TransactionData;
      } else {
        throw new Error(result.error || 'Failed to prepare delete pool transaction');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      requestRefs.current.deletePool = false;
    }
  };

  const deletePool = async (poolId: number) => {
    const transactionData = await prepareDeletePool(poolId);
    const transactionHash = await executeTransaction(transactionData);

    // Refresh pools after successful deletion
    await fetchUserPools();
    return { transactionHash };
  };

  const prepareMergePools = async (targetPoolId: number, sourcePoolId: number) => {
    if (!address || requestRefs.current.mergePools) throw new Error('Request in progress');

    requestRefs.current.mergePools = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/pools/merge', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          targetPoolId,
          sourcePoolId,
          networkId
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.data as TransactionData;
      } else {
        throw new Error(result.error || 'Failed to prepare merge pools transaction');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      requestRefs.current.mergePools = false;
    }
  };

  const mergePools = async (targetPoolId: number, sourcePoolId: number) => {
    const transactionData = await prepareMergePools(targetPoolId, sourcePoolId);
    const transactionHash = await executeTransaction(transactionData);

    // Refresh pools after successful merge
    await fetchUserPools();
    return { transactionHash };
  };

  const prepareDepositFunds = async (poolId: number, amount: string, tokenAddress?: string) => {
    if (!address || requestRefs.current.depositFunds) throw new Error('Request in progress');

    requestRefs.current.depositFunds = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          amount,
          tokenAddress,
          networkId
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.data as TransactionData;
      } else {
        throw new Error(result.error || 'Failed to prepare deposit transaction');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      requestRefs.current.depositFunds = false;
    }
  };

  const depositFunds = async (poolId: number, amount: string, tokenAddress?: string) => {
    const transactionData = await prepareDepositFunds(poolId, amount, tokenAddress);
    const transactionHash = await executeTransaction(transactionData);

    // Refresh pools after successful deposit
    await fetchUserPools();
    return { transactionHash };
  };

  const prepareWithdrawFunds = async (poolId: number, amount: string, tokenAddress?: string) => {
    if (!address || requestRefs.current.withdrawFunds) throw new Error('Request in progress');

    requestRefs.current.withdrawFunds = true;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          amount,
          tokenAddress,
          networkId
        })
      });

      const result = await response.json();

      if (result.success) {
        return result.data as TransactionData;
      } else {
        throw new Error(result.error || 'Failed to prepare withdraw transaction');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      requestRefs.current.withdrawFunds = false;
    }
  };

  const withdrawFunds = async (poolId: number, amount: string, tokenAddress?: string) => {
    const transactionData = await prepareWithdrawFunds(poolId, amount, tokenAddress);
    const transactionHash = await executeTransaction(transactionData);

    // Refresh pools after successful withdrawal
    await fetchUserPools();
    return { transactionHash };
  };

  const refreshAll = async () => {
    // 并行执行，但每个函数内部都有防重复逻辑
    await Promise.all([fetchUserPools(), fetchVaultConfig(), fetchApprovalStatus()]);
  };

  useEffect(() => {
    if (mounted && isConnected && address) {
      refreshAll();
    }
  }, [mounted, isConnected, address, networkId]);

  return {
    pools,
    vaultConfig,
    approvalStatus,
    loading,
    error,
    mounted,
    networkId,
    setNetworkId,
    // Transaction execution methods (with signing)
    createPool,
    deletePool,
    mergePools,
    depositFunds,
    withdrawFunds,
    // Transaction preparation methods (without signing)
    prepareCreatePool,
    prepareDeletePool,
    prepareMergePools,
    prepareDepositFunds,
    prepareWithdrawFunds,
    // Utility methods
    fetchUserPools,
    fetchVaultConfig,
    fetchApprovalStatus,
    refreshAll
  };
}
