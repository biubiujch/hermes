import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum],
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
});
