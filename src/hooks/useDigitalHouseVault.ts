'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/abis/DigitalHouseVault.json'
import { Address } from 'viem'

export function useDigitalHouseVault(vaultAddress: Address) {
  // Read functions
  const { data: vaultInfo } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getVaultInfo',
  })

  const { data: currentReservation, refetch: refetchReservation } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getCurrentReservation',
  })

  const { data: auctionBids, refetch: refetchBids } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getAuctionBids',
  })

  const { data: currentState } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'currentState',
  })

  const { data: vaultId } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'vaultId',
  })

  const { data: propertyDetails } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'propertyDetails',
  })

  // Access code read functions
  const { data: masterAccessCode, refetch: refetchMasterCode } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getMasterAccessCode',
  })

  const { data: currentAccessCode, refetch: refetchCurrentCode } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getCurrentAccessCode',
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
      abi: DigitalHouseVaultABI,
      functionName: 'createReservation',
      args: [stakeAmount, checkInDate, checkOutDate],
    })
  }

  // Place bid
  const placeBid = async (bidAmount: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'placeBid',
      args: [bidAmount],
    })
  }

  // Cede reservation
  const cedeReservation = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'cedeReservation',
      args: [bidIndex],
    })
  }

  // Withdraw bid
  const withdrawBid = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'withdrawBid',
      args: [bidIndex],
    })
  }

  // Check in
  const checkIn = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'checkIn',
    })
  }

  // Check out
  const checkOut = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'checkOut',
    })
  }

  // Cancel reservation
  const cancelReservation = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'cancelReservation',
    })
  }

  // Update master access code
  const updateMasterAccessCode = async (newCode: string) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'updateMasterAccessCode',
      args: [newCode],
    })
  }

  // Withdraw earnings (for parent vaults - treasury)
  const withdrawEarnings = async () => {
    console.log('💰 Withdrawing earnings from vault:', vaultAddress)
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI,
      functionName: 'withdrawEarnings',
      args: [],
    })
  }

  return {
    // Read data
    vaultInfo,
    currentReservation,
    auctionBids,
    currentState,
    vaultId,
    propertyDetails,
    
    // Access codes
    masterAccessCode,
    currentAccessCode,
    
    // Refetch functions
    refetchReservation,
    refetchBids,
    refetchMasterCode,
    refetchCurrentCode,
    
    // Write functions
    createReservation,
    placeBid,
    cedeReservation,
    withdrawBid,
    checkIn,
    checkOut,
    cancelReservation,
    updateMasterAccessCode,
    withdrawEarnings,
    
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
