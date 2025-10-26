'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/abis/DigitalHouseFactory.json'
import DigitalHouseVaultABI from '@/contracts/abis/DigitalHouseVault.json'
import { dateToNightNumber } from '@/lib/nightUtils'
import { Address } from 'viem'

/**
 * Hook for creating night bookings with proper reservation staking
 * 
 * CORRECT FLOW:
 * 1. getOrCreateNightVault() - Creates/gets sub-vault address
 * 2. (Frontend approves PYUSD to sub-vault)
 * 3. createReservation() - Stakes PYUSD on sub-vault
 */
export function useDailyVaultActions(parentVaultId: string) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  const [currentBookingIndex, setCurrentBookingIndex] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [bookingDates, setBookingDates] = useState<Date[]>([])
  const [bookingMasterCode, setBookingMasterCode] = useState('')
  const [bookingStakeAmount, setBookingStakeAmount] = useState<bigint>(BigInt(0))
  const [bookingCheckInDate, setBookingCheckInDate] = useState<bigint>(BigInt(0))
  const [bookingCheckOutDate, setBookingCheckOutDate] = useState<bigint>(BigInt(0))
  const [currentSubVault, setCurrentSubVault] = useState<Address | null>(null)
  const [multiBookingError, setMultiBookingError] = useState<string>('')
  const [bookingPhase, setBookingPhase] = useState<'create-vault' | 'create-reservation'>('create-vault')

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
  /**
   * Hook to get sub-vault address for current booking night
   */
  const currentNightNumber = bookingDates[currentBookingIndex] 
    ? dateToNightNumber(bookingDates[currentBookingIndex])
    : 0

  const { data: fetchedSubVaultAddress } = useReadContract({
    address: contractAddress,
    abi: DigitalHouseFactoryABI,
    functionName: 'getNightSubVault',
    args: [parentVaultId, BigInt(currentNightNumber)],
    query: {
      enabled: !!(contractAddress && parentVaultId && currentNightNumber > 0 && bookingPhase === 'create-reservation'),
    },
  })

  // Update current sub-vault when fetched
  const subVaultAddress = (fetchedSubVaultAddress as Address) || currentSubVault

  /**
   * Step 1: Create sub-vault structure
   * Returns the night number for the created vault
   */
  const createNightVault = async (dates: Date[], masterCode: string) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    if (dates.length === 0) {
      throw new Error('No dates selected')
    }

    if (!masterCode || masterCode.trim().length === 0) {
      throw new Error('Master access code is required')
    }

    // Save booking params
    setCurrentBookingIndex(0)
    setTotalBookings(dates.length)
    setBookingDates(dates.sort((a, b) => a.getTime() - b.getTime()))
    setBookingMasterCode(masterCode)
    setBookingPhase('create-vault')
    setMultiBookingError('')
    reset()

    const firstDate = dates[0]
    const nightNumber = dateToNightNumber(firstDate)

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateNightVault',
      args: [parentVaultId, BigInt(nightNumber), masterCode],
    })
  }

  /**
   * Step 2: Create reservation on the sub-vault
   * Must be called AFTER sub-vault is created and PYUSD is approved to it
   */
  const createReservationOnSubVault = async (
    subVaultAddress: Address,
    stakeAmount: bigint,
    checkInDate: bigint,
    checkOutDate: bigint
  ) => {
    setBookingPhase('create-reservation')
    
    return writeContract({
      address: subVaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'createReservation',
      args: [stakeAmount, checkInDate, checkOutDate],
    })
  }

  /**
   * Legacy function - DEPRECATED
   * Use createNightVault + createReservationOnSubVault instead
   */
  const createMultiDayBooking = async (dates: Date[], masterCode: string) => {
    return createNightVault(dates, masterCode)
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
   * Set booking parameters for reservation creation
   */
  const setBookingParams = (stakeAmount: bigint, checkInDate: bigint, checkOutDate: bigint) => {
    setBookingStakeAmount(stakeAmount)
    setBookingCheckInDate(checkInDate)
    setBookingCheckOutDate(checkOutDate)
  }

  /**
   * Reset the multi-booking state
   */
  const resetMultiBooking = () => {
    setCurrentBookingIndex(0)
    setTotalBookings(0)
    setBookingDates([])
    setBookingMasterCode('')
    setBookingStakeAmount(BigInt(0))
    setBookingCheckInDate(BigInt(0))
    setBookingCheckOutDate(BigInt(0))
    setCurrentSubVault(null)
    setBookingPhase('create-vault')
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
    // New two-step booking functions
    createNightVault,
    createReservationOnSubVault,
    setBookingParams,
    subVaultAddress,
    bookingPhase,
    currentNightNumber,
    bookingStakeAmount,
    bookingCheckInDate,
    bookingCheckOutDate,
    // Legacy functions
    createSingleDayBooking,
    createMultiDayBooking,
    continueMultiDayBooking,
    resetMultiBooking,
    setBookingError,
    // Transaction state
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

