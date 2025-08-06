'use client';

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge, Spinner } from '@heroui/react';
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, WalletIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { useNetworks } from '../../hooks/useNetworks';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { networks, loading: networksLoading, mounted: networksMounted } = useNetworks();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = (connector: any) => {
    connect({ connector });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getCurrentNetwork = () => {
    return networks.find(network => network.id === chainId);
  };

  const currentNetwork = getCurrentNetwork();

  if (!mounted || !networksMounted) {
    return (
      <Button
        color='primary'
        className='bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 ease-out'
        disabled
      >
        Loading...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className='flex items-center space-x-2'>
        {/* Network Switcher */}
        {networks.length > 0 ? (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant='bordered'
                size='sm'
                startContent={<GlobeAltIcon className='w-4 h-4' />}
                endContent={<ChevronDownIcon className='w-4 h-4' />}
                isLoading={networksLoading}
              >
                {currentNetwork ? currentNetwork.name : `Chain ${chainId}`}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='Network selection'>
              {networks.map((network) => (
                <DropdownItem 
                  key={network.id} 
                  onClick={() => handleSwitchNetwork(network.id)}
                  className={network.id === chainId ? 'bg-blue-50' : ''}
                >
                  <div className='flex items-center justify-between w-full'>
                    <span>{network.name}</span>
                    {network.id === chainId && (
                      <Badge color='primary' size='sm'>Current</Badge>
                    )}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            variant='bordered'
            size='sm'
            startContent={<GlobeAltIcon className='w-4 h-4' />}
            isLoading={networksLoading}
            disabled
          >
            {networksLoading ? 'Loading...' : 'No Networks'}
          </Button>
        )}

        {/* Wallet Info */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant='bordered'
              startContent={<WalletIcon className='w-4 h-4' />}
              endContent={<ChevronDownIcon className='w-4 h-4' />}
            >
              {formatAddress(address)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label='Wallet actions'>
            <DropdownItem key='copy' onClick={() => navigator.clipboard.writeText(address)}>
              Copy Address
            </DropdownItem>
            <DropdownItem key='disconnect' color='danger' onClick={handleDisconnect}>
              Disconnect
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color='primary'
          className='bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 ease-out'
          isLoading={isPending}
        >
          Connect Wallet
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Wallet connectors'>
        {connectors.map((connector) => (
          <DropdownItem key={connector.uid} onClick={() => handleConnect(connector)}>
            {connector.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
