import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { WalletBalance } from '../lib/api/wallet';

export const useWalletBalance = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchBalance = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet/balance?walletAddress=${encodeURIComponent(address)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setBalance(data.data.balances);
        setLastUpdated(new Date());
      } else {
        setBalance(null);
        setLastUpdated(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch balance:', err.message);
      setBalance(null);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  const injectFunds = async (amount: string): Promise<boolean> => {
    if (!address) return false;
    setLoading(true);
    try {
      const response = await fetch('/api/wallet/inject-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, amount }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchBalance(); // Refresh balance after injection
        return true;
      } else {
        console.error('Failed to inject funds:', data.error);
        let errorMessage = data.error;
        if (data.errorType === 'contract_not_deployed') {
          errorMessage = 'Smart contracts are not deployed. Please ensure the local blockchain is running with all contracts deployed.';
        } else if (data.errorType === 'invalid_address') {
          errorMessage = 'Invalid contract address. Please check the network configuration.';
        } else if (data.errorType === 'environment_error') {
          errorMessage = 'Fund injection is only available in local test environment. Please connect to Hardhat Local network.';
        }
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error('Failed to inject funds:', err.message);
      if (err.message.includes('Smart contracts are not deployed') || 
          err.message.includes('Invalid contract address') || 
          err.message.includes('Fund injection is only available')) {
        throw err; // Re-throw specific errors
      }
      throw new Error('Network error occurred while injecting funds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && isConnected && address) {
      fetchBalance();
    } else if (mounted && !isConnected) {
      setBalance(null);
      setLastUpdated(null);
    }
  }, [mounted, isConnected, address]);

  return {
    balance,
    loading,
    lastUpdated,
    fetchBalance,
    injectFunds,
    mounted,
  };
}; 