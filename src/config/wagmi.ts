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
 * Factory Contract Addresses - Night-by-Night Booking System
 * 
 * These are the ONLY factory contracts we use.
 * All vaults are created and managed through these addresses.
 * 
 * Deployed: October 26, 2025
 * Updated: Night number system (simple integers instead of timestamps)
 * 
 * If you deploy a new factory, UPDATE these addresses here.
 */
export const CONTRACT_ADDRESSES = {
  // TESTNETS (Active) - Night-by-Night System
  [sepolia.id]: '0xD55Ff22f805487f78120b124D72a92c727243a19', // DigitalHouseFactory - Sepolia (Oct 26, 2025)
  [arbitrumSepolia.id]: '0x9fc0bdDF5E230256C0eEa3DD9B23EA7c05369865', // DigitalHouseFactory - Arbitrum Sepolia (Oct 26, 2025)
  
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

