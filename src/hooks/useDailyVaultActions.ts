'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/abis/DigitalHouseFactory.json'
import { dateToNightNumber } from '@/lib/nightUtils'

/**
 * Hook for creating night reservations and managing bookings
 * Uses getOrCreateNightVault for each individual night
 */
export function useDailyVaultActions(parentVaultId: string) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  const [currentBookingIndex, setCurrentBookingIndex] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [bookingDates, setBookingDates] = useState<Date[]>([])
  const [bookingMasterCode, setBookingMasterCode] = useState('')
  const [multiBookingError, setMultiBookingError] = useState<string>('')

  const {
    data: hash,
    isPending,
    writeContract,
    error,
    reset,
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

    const nightNumber = dateToNightNumber(date)

    setCurrentBookingIndex(0)
    setTotalBookings(1)
    setBookingDates([date])
    setMultiBookingError('')

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateNightVault',
      args: [parentVaultId, BigInt(nightNumber), masterCode],
    })
  }

  /**
   * Create reservations for multiple nights
   * This function initiates the booking process and then continues with subsequent nights
   * @param dates Array of nights to book
   * @param masterCode Master access code from parent vault
   */
  const createMultiDayBooking = async (dates: Date[], masterCode: string) => {
    if (!contractAddress) {
      const error = 'Contract address not found for current chain'
      console.error('❌', error, { chainId })
      throw new Error(error)
    }

    if (dates.length === 0) {
      throw new Error('No dates selected')
    }

    if (!masterCode || masterCode.trim().length === 0) {
      throw new Error('Master access code is required')
    }

    // Reset state for new booking process
    setCurrentBookingIndex(0)
    setTotalBookings(dates.length)
    setBookingDates(dates.sort((a, b) => a.getTime() - b.getTime()))
    setBookingMasterCode(masterCode)
    setMultiBookingError('')
    reset() // Reset any previous transaction state

    // Start with the first night
    const firstDate = dates[0]
    const nightNumber = dateToNightNumber(firstDate)

    try {
      const result = await writeContract({
        address: contractAddress,
        abi: DigitalHouseFactoryABI,
        functionName: 'getOrCreateNightVault',
        args: [parentVaultId, BigInt(nightNumber), masterCode],
      })
      
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Continue booking the next night in the sequence
   * This should be called after the current transaction is confirmed
   */
  const continueMultiDayBooking = async () => {
    if (!contractAddress) {
      const error = 'Contract address not found for current chain'
      console.error('❌', error, { chainId })
      throw new Error(error)
    }

    const nextIndex = currentBookingIndex + 1
    
    if (nextIndex >= totalBookings || nextIndex >= bookingDates.length) {
      console.log('✅ All bookings completed!')
      return null // All bookings are done
    }

    const nextDate = bookingDates[nextIndex]
    const nightNumber = dateToNightNumber(nextDate)

    setCurrentBookingIndex(nextIndex)
    reset() // Reset transaction state for next booking

    try {
      const result = await writeContract({
        address: contractAddress,
        abi: DigitalHouseFactoryABI,
        functionName: 'getOrCreateNightVault',
        args: [parentVaultId, BigInt(nightNumber), bookingMasterCode],
      })
      
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Reset the multi-booking state
   */
  const resetMultiBooking = () => {
    setCurrentBookingIndex(0)
    setTotalBookings(0)
    setBookingDates([])
    setBookingMasterCode('')
    setMultiBookingError('')
    reset()
  }

  /**
   * Set an error for multi-booking process
   */
  const setBookingError = (error: string) => {
    setMultiBookingError(error)
  }

  // Check if we're in the middle of a multi-booking process
  const isMultiBookingInProgress = totalBookings > 1
  const isMultiBookingComplete = isMultiBookingInProgress && currentBookingIndex >= totalBookings - 1 && isConfirmed
  const hasMoreBookings = isMultiBookingInProgress && currentBookingIndex < totalBookings - 1

  return {
    createSingleDayBooking,
    createMultiDayBooking,
    continueMultiDayBooking,
    resetMultiBooking,
    setBookingError,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: error || (multiBookingError ? new Error(multiBookingError) : null),
    // Multi-booking state
    isMultiBookingInProgress,
    isMultiBookingComplete,
    hasMoreBookings,
    currentBookingIndex,
    totalBookings,
    bookingProgress: totalBookings > 0 ? ((currentBookingIndex + (isConfirmed ? 1 : 0)) / totalBookings) * 100 : 0,
    currentBookingDate: bookingDates[currentBookingIndex]?.toDateString(),
  }
}

