import { createConfig, http } from 'wagmi';
import { mainnet, polygon, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
  appName: 'ZChain MLM Platform',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '5eb033556ded1f650286f45f758c82d7',
  chains: [mainnet, polygon, sepolia],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_ETHEREUM_RPC_URL),
    [polygon.id]: http(import.meta.env.VITE_POLYGON_RPC_URL),
    [sepolia.id]: http(import.meta.env.VITE_SEPOLIA_RPC_URL),
  },
});

// Commission calculation tiers
export const COMMISSION_RATES = [
  { level: 1, rate: 10.0, name: 'Direct Referral' },
  { level: 2, rate: 5.0, name: 'Second Level' },
  { level: 3, rate: 2.0, name: 'Third Level' },
  { level: 4, rate: 1.0, name: 'Fourth Level' },
  { level: 5, rate: 0.5, name: 'Fifth Level' },
];

// Smart contract addresses (replace with actual deployed contracts)
export const CONTRACTS = {
  COMMISSION_DISTRIBUTOR: import.meta.env.VITE_COMMISSION_DISTRIBUTOR_ADDRESS || '0x...',
  TOKEN_CONTRACT: import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS || '0x...',
  MLM_REGISTRY: import.meta.env.VITE_MLM_REGISTRY_ADDRESS || '0x...',
};

// Blockchain network configuration
export const SUPPORTED_NETWORKS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/Iwad6cn9Y98vNh4SNrFc9BLl3V2A2FvR',
    explorerUrl: 'https://etherscan.io',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
    explorerUrl: 'https://polygonscan.com',
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/Iwad6cn9Y98vNh4SNrFc9BLl3V2A2FvR',
    explorerUrl: 'https://sepolia.etherscan.io',
  },
};