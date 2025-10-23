'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import { Address } from 'viem'

export function useDigitalHouseVault(vaultAddress: Address) {
  // Read functions
  const { data: vaultInfo } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getVaultInfo',
  })

  const { data: currentReservation, refetch: refetchReservation } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getCurrentReservation',
  })

  const { data: auctionBids, refetch: refetchBids } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getAuctionBids',
  })

  const { data: currentState } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'currentState',
  })

  const { data: basePrice } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'basePrice',
  })

  const { data: vaultId } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'vaultId',
  })

  const { data: propertyDetails } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'propertyDetails',
  })

  // Write functions
  const { 
    data: hash,
    isPending,
    writeContract 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

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

  // Place bid
  const placeBid = async (bidAmount: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'placeBid',
      args: [bidAmount],
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

  // Withdraw bid
  const withdrawBid = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'withdrawBid',
      args: [bidIndex],
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

  // Cancel reservation
  const cancelReservation = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'cancelReservation',
    })
  }

  return {
    // Read data
    vaultInfo,
    currentReservation,
    auctionBids,
    currentState,
    basePrice,
    vaultId,
    propertyDetails,
    
    // Refetch functions
    refetchReservation,
    refetchBids,
    
    // Write functions
    createReservation,
    placeBid,
    cedeReservation,
    withdrawBid,
    checkIn,
    checkOut,
    cancelReservation,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
  }
}

// Helper type for vault state
export enum VaultState {
  FREE = 0,
  AUCTION = 1,
  SETTLED = 2,
}

// Helper to format vault state
export function formatVaultState(state: number): string {
  switch (state) {
    case VaultState.FREE:
      return '🟢 Available'
    case VaultState.AUCTION:
      return '🟡 Active Auction'
    case VaultState.SETTLED:
      return '🔴 Occupied'
    default:
      return 'Unknown'
  }
}
