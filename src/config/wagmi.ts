import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, arbitrum, sepolia, arbitrumSepolia],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
})

// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x38e797F2f6b7ae1387e5eC7288Ec216Caf7e0109',
  [arbitrumSepolia.id]: '0xE30eBc03Cdf4c44b1bcD2Ca9aEf8bea27C6D082d',
  // Add mainnet and arbitrum addresses when deployed
  [mainnet.id]: '0x0000000000000000000000000000000000000000', // TODO: Add mainnet address
  [arbitrum.id]: '0x0000000000000000000000000000000000000000', // TODO: Add arbitrum address
} as const

export const PYUSD_ADDRESSES = {
  [sepolia.id]: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9',
  [arbitrumSepolia.id]: '0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1',
  // Add mainnet and arbitrum PYUSD addresses
  [mainnet.id]: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8', // PYUSD on Ethereum Mainnet
  [arbitrum.id]: '0x0000000000000000000000000000000000000000', // TODO: Add arbitrum PYUSD address
} as const

