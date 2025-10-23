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

  const reservation = currentReservation as any

  const hasActiveReservation = reservation && reservation[6] === true

  return {
    reservation,
    hasActiveReservation,
    booker: reservation?.[0] as Address,
    stakeAmount: reservation?.[1] as bigint,
    shares: reservation?.[2] as bigint,
    checkInDate: reservation?.[3] as bigint,
    checkOutDate: reservation?.[4] as bigint,
    nonce: reservation?.[5] as bigint,
    isActive: reservation?.[6] as boolean,
    isLoading,
    refetch,
  }
}

