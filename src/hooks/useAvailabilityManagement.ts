'use client'

import { useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'
import { dateToTimestamp } from '@/config/wagmi'

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

    const nightTimestamp = dateToTimestamp(nightDate)

    console.log('🗓️ Setting night availability:', {
      vaultId,
      date: nightDate.toDateString(),
      timestamp: nightTimestamp,
      isAvailable,
    })

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'setNightAvailability',
      args: [vaultId, nightTimestamp, isAvailable],
    })
  }

  /**
   * Set availability for a range of nights (bulk operation)
   * @param startNight Start date of the range
   * @param endNight End date of the range
   * @param isAvailable Whether all nights in the range should be available
   */
  const setAvailabilityWindow = async (
    startNight: Date,
    endNight: Date,
    isAvailable: boolean
  ) => {
    if (!contractAddress) {
      throw new Error('Contract address not found for current chain')
    }

    const startTimestamp = dateToTimestamp(startNight)
    const endTimestamp = dateToTimestamp(endNight)

    // Calculate number of nights
    const nightCount = Math.floor((endTimestamp - startTimestamp) / (24 * 60 * 60)) + 1

    console.log('📅 Setting availability window:', {
      vaultId,
      startDate: startNight.toDateString(),
      endDate: endNight.toDateString(),
      nightCount,
      isAvailable,
    })

    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'setAvailabilityWindow',
      args: [vaultId, startTimestamp, endTimestamp, nightCount, isAvailable],
    })
  }

  /**
   * Convenience method: Block specific nights
   */
  const blockNights = async (nights: Date[]) => {
    console.log('🚫 Blocking nights:', nights.map(d => d.toDateString()))
    
    // For multiple nights, we could batch them
    // For now, setting first night as example
    if (nights.length === 1) {
      return setNightAvailability(nights[0], false)
    } else if (nights.length > 1) {
      // Use window for multiple consecutive nights
      const sortedNights = nights.sort((a, b) => a.getTime() - b.getTime())
      return setAvailabilityWindow(sortedNights[0], sortedNights[sortedNights.length - 1], false)
    }
  }

  /**
   * Convenience method: Open specific nights for booking
   */
  const openNights = async (nights: Date[]) => {
    console.log('✅ Opening nights:', nights.map(d => d.toDateString()))
    
    if (nights.length === 1) {
      return setNightAvailability(nights[0], true)
    } else if (nights.length > 1) {
      const sortedNights = nights.sort((a, b) => a.getTime() - b.getTime())
      return setAvailabilityWindow(sortedNights[0], sortedNights[sortedNights.length - 1], true)
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

