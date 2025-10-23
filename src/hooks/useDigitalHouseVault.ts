'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'

export function useDigitalHouseVault(vaultAddress: `0x${string}`) {
  // Read functions
  
  // Get all auction bids
  const { data: auctionBids, refetch: refetchBids } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getAuctionBids',
  })

  // Get base price
  const { data: basePrice } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'basePrice',
  })

  // Get vault info
  const { data: vaultInfo } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getVaultInfo',
  })

  // Get current state
  const { data: currentState } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'currentState',
  })

  // Get current reservation
  const { data: currentReservation } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getCurrentReservation',
  })

  // Write functions
  const { 
    data: hash,
    isPending,
    writeContract,
    error: writeError
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Place a bid
  const placeBid = async (bidAmount: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'placeBid',
      args: [bidAmount],
    })
  }

  // Withdraw a bid
  const withdrawBid = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'withdrawBid',
      args: [bidIndex],
    })
  }

  // Cede reservation
  const cedeReservation = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'cedeReservation',
      args: [bidIndex],
    })
  }

  // Create reservation
  const createReservation = async (
    stakeAmount: bigint,
    checkInDate: bigint,
    checkOutDate: bigint
  ) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'createReservation',
      args: [stakeAmount, checkInDate, checkOutDate],
    })
  }

  // Cancel reservation
  const cancelReservation = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'cancelReservation',
    })
  }

  // Check in
  const checkIn = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'checkIn',
    })
  }

  // Check out
  const checkOut = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'checkOut',
    })
  }

  return {
    // Read data
    auctionBids,
    basePrice,
    vaultInfo,
    currentState,
    currentReservation,
    refetchBids,
    
    // Write functions
    placeBid,
    withdrawBid,
    cedeReservation,
    createReservation,
    cancelReservation,
    checkIn,
    checkOut,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    writeError,
  }
}

