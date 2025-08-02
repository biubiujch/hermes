'use client';

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = (connector: any) => {
    connect({ connector });
    setIsOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger>
          <Button
            variant='bordered'
            className='bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 ease-out'
          >
            <Avatar name={formatAddress(address)} size='sm' className='mr-2' />
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
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
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
