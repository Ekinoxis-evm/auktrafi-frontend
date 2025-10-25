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

/**
 * Factory Contract Addresses - Daily Pricing System
 * 
 * These are the ONLY factory contracts we use.
 * All vaults are created and managed through these addresses.
 * 
 * If you deploy a new factory, UPDATE these addresses here.
 */
export const CONTRACT_ADDRESSES = {
  // TESTNETS (Active)
  [sepolia.id]: '0xBdB8AcD5c9feA0C7bC5D3ec5F99E2C198526a58F', // Daily Pricing Factory - Sepolia
  [arbitrumSepolia.id]: '0xC3f3B1192E938A22a79149bbFc6d8218B1bC0117', // Daily Pricing Factory - Arbitrum Sepolia
  
  // MAINNETS (Not deployed yet)
  [mainnet.id]: '0x0000000000000000000000000000000000000000', // TODO: Deploy to mainnet
  [arbitrum.id]: '0x0000000000000000000000000000000000000000', // TODO: Deploy to arbitrum
} as const

export const PYUSD_ADDRESSES = {
  [sepolia.id]: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9',
  [arbitrumSepolia.id]: '0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1',
  // Add mainnet and arbitrum PYUSD addresses
  [mainnet.id]: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8', // PYUSD on Ethereum Mainnet
  [arbitrum.id]: '0x0000000000000000000000000000000000000000', // TODO: Add arbitrum PYUSD address
} as const

// Date utility functions for daily sub-vault system
export const dateToTimestamp = (date: Date): number => {
  // Get start of day in UTC
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return Math.floor(d.getTime() / 1000)
}

export const timestampToDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000)
}

export const getStartOfDay = (date: Date): Date => {
  const d = new Date(date)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

