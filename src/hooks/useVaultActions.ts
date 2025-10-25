'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import { Address } from 'viem'

export function useVaultActions(vaultAddress: Address) {
  const { 
    data: hash,
    isPending,
    writeContract,
    error 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

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

  const placeBid = async (bidAmount: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'placeBid',
      args: [bidAmount],
    })
  }

  const cedeReservation = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'cedeReservation',
      args: [bidIndex],
    })
  }

  const withdrawBid = async (bidIndex: bigint) => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'withdrawBid',
      args: [bidIndex],
    })
  }

  const checkIn = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'checkIn',
    })
  }

  const checkOut = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'checkOut',
    })
  }

  const cancelReservation = async () => {
    return writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'cancelReservation',
    })
  }

  return {
    createReservation,
    placeBid,
    cedeReservation,
    withdrawBid,
    checkIn,
    checkOut,
    cancelReservation,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
  }
}

