import { useChainId } from 'wagmi';
import { useState, useEffect } from 'react';

export const useChainIdSafe = () => {
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);
  const [safeChainId, setSafeChainId] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setSafeChainId(chainId);
  }, [chainId]);

  return {
    chainId: mounted ? safeChainId : undefined,
    mounted,
  };
}; 