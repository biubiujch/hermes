import { useState, useCallback } from 'react';
import { 
  VaultConfig, 
  UserPools, 
  Pool, 
  CreatePoolRequest,
  DeletePoolRequest,
  MergePoolsRequest,
  DepositRequest,
  WithdrawRequest,
  TokenApprovalStatus,
  NonceResponse,
  DomainSeparatorResponse,
  SignatureVerificationRequest
} from '@/lib/account/vault';

export const useVault = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper function to handle API responses
  const handleApiResponse = async (response: Response) => {
    const data = await response.json();
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'API request failed');
    }
  };

  // Get Vault Configuration
  const getVaultConfig = useCallback(async (): Promise<VaultConfig | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/config');
      const config = await handleApiResponse(response);
      return config;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get User Pools
  const getUserPools = useCallback(async (walletAddress: string): Promise<UserPools | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/user/${encodeURIComponent(walletAddress)}`);
      const pools = await handleApiResponse(response);
      return pools;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Pool Details
  const getPoolDetails = useCallback(async (poolId: number): Promise<Pool | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}`);
      const pool = await handleApiResponse(response);
      return pool;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Pool
  const createPool = useCallback(async (request: CreatePoolRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/pools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result !== null;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Pool
  const deletePool = useCallback(async (poolId: number, request: DeletePoolRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result !== null;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Merge Pools
  const mergePools = useCallback(async (request: MergePoolsRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/pools/merge', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result !== null;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deposit Funds
  const depositFunds = useCallback(async (poolId: number, request: DepositRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result !== null;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Withdraw Funds
  const withdrawFunds = useCallback(async (poolId: number, request: WithdrawRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/pools/${poolId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result !== null;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Token Approval Status
  const getTokenApprovalStatus = useCallback(async (walletAddress: string, tokenAddress: string): Promise<TokenApprovalStatus | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/token/approval/${encodeURIComponent(walletAddress)}/${encodeURIComponent(tokenAddress)}`);
      const status = await handleApiResponse(response);
      return status;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get User Nonce
  const getUserNonce = useCallback(async (walletAddress: string): Promise<NonceResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/vault/nonce/${encodeURIComponent(walletAddress)}`);
      const nonce = await handleApiResponse(response);
      return nonce;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Domain Separator
  const getDomainSeparator = useCallback(async (): Promise<DomainSeparatorResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/domain-separator');
      const domainSeparator = await handleApiResponse(response);
      return domainSeparator;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify Signature
  const verifySignature = useCallback(async (request: SignatureVerificationRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/vault/verify-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const result = await handleApiResponse(response);
      return result?.isValid || false;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    getVaultConfig,
    getUserPools,
    getPoolDetails,
    createPool,
    deletePool,
    mergePools,
    depositFunds,
    withdrawFunds,
    getTokenApprovalStatus,
    getUserNonce,
    getDomainSeparator,
    verifySignature
  };
}; 