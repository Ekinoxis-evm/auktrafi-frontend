'use client'

import { Address } from 'viem'
import { useDigitalHouseVault } from './useDigitalHouseVault'

/**
 * Hook to check if a user is participating in a vault
 * Returns true if user has a reservation or active bids
 */
export function useUserVaultParticipation(vaultAddress: Address, userAddress?: Address) {
  const { currentReservation, auctionBids } = useDigitalHouseVault(vaultAddress)

  if (!userAddress) return { isParticipating: false, hasReservation: false, hasBids: false }

  // Check if user is the booker
  const hasReservation = currentReservation && 
    Array.isArray(currentReservation) &&
    typeof currentReservation[0] === 'string' &&
    currentReservation[0].toLowerCase() === userAddress.toLowerCase() &&
    currentReservation[6] === true // isActive

  // Check if user has active bids
  const hasBids = auctionBids &&
    Array.isArray(auctionBids) &&
    auctionBids.some((bid: any) => {
      return Array.isArray(bid) && 
        typeof bid[0] === 'string' &&
        bid[0].toLowerCase() === userAddress.toLowerCase() &&
        bid[3] === true // isActive
    })

  const isParticipating = Boolean(hasReservation || hasBids)

  return { isParticipating, hasReservation, hasBids }
}

