/**
 * Digital House Contracts Configuration
 * Centralized exports for ABIs and contract addresses
 */

// ABIs
import DigitalHouseFactoryABI from './abis/DigitalHouseFactory.json';
import DigitalHouseVaultABI from './abis/DigitalHouseVault.json';

// Addresses
import sepoliaAddresses from './addresses/sepolia.json';
import arbitrumSepoliaAddresses from './addresses/arbitrumSepolia.json';

// Types
export type SupportedChainId = 11155111 | 421614; // Sepolia | Arbitrum Sepolia

export const CHAIN_INFO = {
  11155111: {
    name: 'Sepolia',
    explorer: 'https://sepolia.etherscan.io',
  },
  421614: {
    name: 'Arbitrum Sepolia',
    explorer: 'https://sepolia.arbiscan.io',
  },
} as const;

export const CONTRACTS = {
  DigitalHouseFactory: {
    abi: DigitalHouseFactoryABI,
    addresses: {
      [sepoliaAddresses.chainId]: sepoliaAddresses.contracts.DigitalHouseFactory.address as `0x${string}`,
      [arbitrumSepoliaAddresses.chainId]: arbitrumSepoliaAddresses.contracts.DigitalHouseFactory.address as `0x${string}`,
    },
  },
  DigitalHouseVault: {
    abi: DigitalHouseVaultABI,
    // Vault addresses are obtained dynamically from the factory
  },
  PYUSD: {
    addresses: {
      [sepoliaAddresses.chainId]: sepoliaAddresses.contracts.PYUSD.address as `0x${string}`,
      [arbitrumSepoliaAddresses.chainId]: arbitrumSepoliaAddresses.contracts.PYUSD.address as `0x${string}`,
    },
  },
} as const;

export const SUPPORTED_CHAINS = [
  sepoliaAddresses.chainId,
  arbitrumSepoliaAddresses.chainId,
] as const;

// Helper functions
export function getFactoryAddress(chainId: SupportedChainId): `0x${string}` {
  return CONTRACTS.DigitalHouseFactory.addresses[chainId];
}

export function getPYUSDAddress(chainId: SupportedChainId): `0x${string}` {
  return CONTRACTS.PYUSD.addresses[chainId];
}

export function getChainInfo(chainId: SupportedChainId) {
  return CHAIN_INFO[chainId];
}

export function isSupportedChain(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAINS.includes(chainId as SupportedChainId);
}

// Export ABIs directly for convenience
export { DigitalHouseFactoryABI, DigitalHouseVaultABI };

