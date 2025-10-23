'use client'

import { useReadContract } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import { Address } from 'viem'

export function useReservation(vaultAddress: Address) {
  const { data: currentReservation, isLoading, refetch } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getCurrentReservation',
  })

  // Parse reservation data safely
  // getCurrentReservation returns a tuple: [booker, stakeAmount, shares, checkInDate, checkOutDate, nonce, isActive]
  let parsedReservation = null
  let booker: Address | undefined
  let stakeAmount: bigint | undefined
  let shares: bigint | undefined
  let checkInDate: bigint | undefined
  let checkOutDate: bigint | undefined
  let nonce: bigint | undefined
  let isActive = false

  if (currentReservation) {
    // Check if it's an array or object
    if (Array.isArray(currentReservation)) {
      parsedReservation = currentReservation
      booker = currentReservation[0] as Address
      stakeAmount = currentReservation[1] as bigint
      shares = currentReservation[2] as bigint
      checkInDate = currentReservation[3] as bigint
      checkOutDate = currentReservation[4] as bigint
      nonce = currentReservation[5] as bigint
      isActive = currentReservation[6] as boolean
    } else if (typeof currentReservation === 'object') {
      // Handle object format (some wagmi versions return objects)
      const res = currentReservation as Record<string | number, unknown>
      parsedReservation = res
      booker = (res.booker || res[0]) as Address
      stakeAmount = (res.stakeAmount || res[1]) as bigint
      shares = (res.shares || res[2]) as bigint
      checkInDate = (res.checkInDate || res[3]) as bigint
      checkOutDate = (res.checkOutDate || res[4]) as bigint
      nonce = (res.nonce || res[5]) as bigint
      isActive = (res.isActive ?? res[6] ?? false) as boolean
    }
  }

  const hasActiveReservation = isActive === true

  return {
    reservation: parsedReservation,
    hasActiveReservation,
    booker,
    stakeAmount,
    shares,
    checkInDate,
    checkOutDate,
    nonce,
    isActive,
    isLoading,
    refetch,
  }
}

