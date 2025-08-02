'use client';

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from '@heroui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, WalletIcon } from '@heroicons/react/24/solid';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!mounted) {
    return (
      <Button
        color='primary'
        className='bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 ease-out'
        disabled
      >
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
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
