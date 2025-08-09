import { useState, useCallback } from 'react';
import { 
  StrategyConfig, 
  UserStrategies, 
  Strategy, 
  RegisterStrategyRequest,
  UpdateStrategyRequest,
  SetStrategyActiveRequest,
  DeleteStrategyRequest,
  NonceResponse,
  DomainSeparatorResponse,
  SignatureVerificationRequest
} from '@/lib/account/strategy';

export const useStrategy = () => {
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

  // Get Strategy Configuration
  const getStrategyConfig = useCallback(async (): Promise<StrategyConfig | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/strategy/config');
      const config = await handleApiResponse(response);
      return config;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get User Strategies
  const getUserStrategies = useCallback(async (walletAddress: string): Promise<UserStrategies | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/user/${encodeURIComponent(walletAddress)}`);
      const strategies = await handleApiResponse(response);
      return strategies;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get Strategy Details
  const getStrategyDetails = useCallback(async (strategyId: number): Promise<Strategy | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/${strategyId}`);
      const strategy = await handleApiResponse(response);
      return strategy;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register Strategy
  const registerStrategy = useCallback(async (request: RegisterStrategyRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/strategy/register', {
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

  // Update Strategy
  const updateStrategy = useCallback(async (strategyId: number, request: UpdateStrategyRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/${strategyId}`, {
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

  // Set Strategy Active Status
  const setStrategyActive = useCallback(async (strategyId: number, request: SetStrategyActiveRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/${strategyId}/active`, {
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

  // Delete Strategy
  const deleteStrategy = useCallback(async (strategyId: number, request: DeleteStrategyRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/${strategyId}`, {
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

  // Get User Nonce
  const getUserNonce = useCallback(async (walletAddress: string): Promise<NonceResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/strategy/nonce/${encodeURIComponent(walletAddress)}`);
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
      const response = await fetch('/api/strategy/domain-separator');
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
      const response = await fetch('/api/strategy/verify-signature', {
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
    getStrategyConfig,
    getUserStrategies,
    getStrategyDetails,
    registerStrategy,
    updateStrategy,
    setStrategyActive,
    deleteStrategy,
    getUserNonce,
    getDomainSeparator,
    verifySignature
  };
}; 