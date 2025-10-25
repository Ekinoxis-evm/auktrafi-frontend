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

// Contract addresses per network (Sub-Vault System v2.0)
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0xBdB8AcD5c9feA0C7bC5D3ec5F99E2C198526a58F', // Updated with Sub-Vault System
  [arbitrumSepolia.id]: '0xC3f3B1192E938A22a79149bbFc6d8218B1bC0117', // Updated with Sub-Vault System
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

