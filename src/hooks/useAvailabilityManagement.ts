'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/abis/DigitalHouseFactory.json'
import { dateToNightNumber } from '@/lib/nightUtils'

/**
 * Hook for owner to manage night availability
 * Allows setting individual nights or windows of nights as available/unavailable
 */
export function useAvailabilityManagement(vaultId: string) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const {
    data: hash,
    isPending,
    writeContract,
    error,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  /**
   * Set availability for a single night
   * @param nightDate The date to set availability for
   * @param isAvailable Whether the night should be available for booking
   */
  const setNightAvailability = async (nightDate: Date, isAvailable: boolean) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    const nightNumber = dateToNightNumber(nightDate)

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'setNightAvailability',
      args: [vaultId, BigInt(nightNumber), isAvailable],
    })
  }

  /**
   * Set availability for a range of nights (bulk operation)
   * NOTE: This function ONLY opens nights for booking (sets them as available)
   * To block nights, use setNightAvailability individually
   * @param startNight Start date of the range
   * @param endNight End date of the range
   */
  const setAvailabilityWindow = async (
    startNight: Date,
    endNight: Date
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    const startNightNumber = dateToNightNumber(startNight)
    const endNightNumber = dateToNightNumber(endNight)
    const nightCount = endNightNumber - startNightNumber + 1

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'setAvailabilityWindow',
      args: [vaultId, BigInt(startNightNumber), BigInt(endNightNumber), BigInt(nightCount)],
    })
  }

  /**
   * Convenience method: Block specific nights
   * NOTE: Blocking must be done individually per night
   */
  const blockNights = async (nights: Date[]) => {
    // Block each night individually
    for (const night of nights) {
      await setNightAvailability(night, false)
    }
  }

  /**
   * Convenience method: Open specific nights for booking
   * Uses bulk window operation if multiple consecutive nights
   */
  const openNights = async (nights: Date[]) => {
    if (nights.length === 1) {
      return setNightAvailability(nights[0], true)
    } else if (nights.length > 1) {
      // Use window for multiple consecutive nights (more gas efficient)
      const sortedNights = nights.sort((a, b) => a.getTime() - b.getTime())
      return setAvailabilityWindow(sortedNights[0], sortedNights[sortedNights.length - 1])
    }
  }

  return {
    setNightAvailability,
    setAvailabilityWindow,
    blockNights,
    openNights,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
}

