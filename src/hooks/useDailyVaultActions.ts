'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'
import { dateToTimestamp } from '@/config/wagmi'

/**
 * Hook for creating night reservations and managing bookings
 * Uses getOrCreateNightVault for each individual night
 */
export function useDailyVaultActions(parentVaultId: string) {
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
   * Create a reservation for a single night
   * @param date The night to book
   * @param masterCode Master access code from parent vault
   */
  const createSingleDayBooking = async (date: Date, masterCode: string) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    const nightTimestamp = dateToTimestamp(date)

    console.log('🌙 Creating single night booking:', {
      vaultId: parentVaultId,
      date: date.toDateString(),
      timestamp: nightTimestamp,
    })

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateNightVault',
      args: [parentVaultId, BigInt(nightTimestamp), masterCode],
    })
  }

  /**
   * Create reservations for multiple nights
   * NOTE: Must be called sequentially for each night
   * @param dates Array of nights to book
   * @param masterCode Master access code from parent vault
   */
  const createMultiDayBooking = async (dates: Date[], masterCode: string) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    if (dates.length === 0) {
      throw new Error('No dates selected')
    }

    console.log('🌙 Creating multi-night booking:', {
      vaultId: parentVaultId,
      dates: dates.map(d => d.toDateString()),
      count: dates.length,
    })

    // Book each night sequentially
    const results = []
    for (const date of dates) {
      const nightTimestamp = dateToTimestamp(date)
      const result = await writeContract({
        address: contractAddress,
        abi: DigitalHouseFactoryABI,
        functionName: 'getOrCreateNightVault',
        args: [parentVaultId, BigInt(nightTimestamp), masterCode],
      })
      results.push(result)
    }

    return results[results.length - 1] // Return last transaction hash
  }

  return {
    createSingleDayBooking,
    createMultiDayBooking,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
}

