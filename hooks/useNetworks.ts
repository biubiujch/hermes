import { useState, useEffect } from 'react';
import { Network } from '../lib/api/wallet';

export const useNetworks = () => {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNetworks = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/wallet/networks');
      const data = await response.json();
      
      if (data.success) {
        setNetworks(data.data.networks);
      } else {
        // Service unavailable, set empty networks
        setNetworks([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch networks:', err.message);
      setNetworks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchNetworks();
    }
  }, [mounted]);

  return {
    networks,
    loading,
    fetchNetworks,
    mounted,
  };
}; 