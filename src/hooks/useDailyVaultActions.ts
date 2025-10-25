'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'
import { dateToTimestamp } from '@/config/wagmi'

/**
 * Hook for creating daily reservations and managing bookings
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
   * Create a reservation for a single day
   * @param date The date to book
   * @param masterCode Master access code from parent vault
   */
  const createSingleDayBooking = async (date: Date, masterCode: string) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    const dayTimestamp = dateToTimestamp(date)

    console.log('📅 Creating single day booking:', {
      vaultId: parentVaultId,
      date: date.toDateString(),
      timestamp: dayTimestamp,
    })

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getOrCreateDailyVault',
      args: [parentVaultId, dayTimestamp, masterCode],
    })
  }

  /**
   * Create reservations for multiple days at once
   * @param dates Array of dates to book
   * @param masterCode Master access code from parent vault
   */
  const createMultiDayBooking = async (dates: Date[], masterCode: string) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    if (dates.length === 0) {
      throw new Error('No dates selected')
    }

    // Convert dates to timestamps
    const dayTimestamps = dates.map(date => dateToTimestamp(date))

    console.log('📅 Creating multi-day booking:', {
      vaultId: parentVaultId,
      dates: dates.map(d => d.toDateString()),
      timestamps: dayTimestamps,
      count: dates.length,
    })

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'createMultiDayReservation',
      args: [parentVaultId, dayTimestamps, masterCode],
    })
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

