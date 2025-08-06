import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, arbitrum, hardhat } from 'wagmi/chains';

export const config = createConfig({
  chains: [hardhat, mainnet, sepolia, arbitrum],
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545')
  }
});
