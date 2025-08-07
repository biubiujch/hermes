import { useChainId } from 'wagmi';
import { useState, useEffect } from 'react';

export const useChainIdSafe = () => {
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    chainId,
    mounted
  };
}; 