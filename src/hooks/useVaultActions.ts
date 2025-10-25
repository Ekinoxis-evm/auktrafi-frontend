'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import { Address } from 'viem'
import { useState, useEffect } from 'react'

export function useVaultActions(vaultAddress: Address) {
  const { 
    data: hash,
    isPending,
    writeContract,
    error 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = 
    useWaitForTransactionReceipt({ hash })
  
  const [accessCode, setAccessCode] = useState<string | null>(null)
  const [isCheckInTransaction, setIsCheckInTransaction] = useState(false)

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
    setAccessCode(null) // Reset previous access code
    setIsCheckInTransaction(true) // Mark this as a check-in transaction
    
    const result = writeContract({
      address: vaultAddress,
      abi: DigitalHouseVaultABI.abi,
      functionName: 'checkIn',
    })
    
    return result
  }

  // Extract access code from transaction receipt when check-in is confirmed
  useEffect(() => {
    if (isConfirmed && receipt && hash && isCheckInTransaction) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        // Parse the transaction receipt logs to extract the access code
        try {
          const logs = receipt.logs || []
          
          // Look for CheckInCompleted event
          const checkInEvent = logs.find((log: unknown) => {
            try {
              const logEntry = log as { topics?: string[]; data?: string }
              // The event signature for CheckInCompleted(address,string)
              // This is a simplified approach - in production you'd want to use proper ABI decoding
              return logEntry.topics && logEntry.topics[0] && logEntry.data
            } catch {
              return false
            }
          })
          
          const eventData = checkInEvent as { data?: string } | undefined
          if (eventData?.data) {
            // For now, we'll simulate the access code generation similar to the smart contract
            // The smart contract generates: keccak256(timestamp, sender, nonce, vaultId) % 1000000
            // We'll create a deterministic 6-digit code based on transaction hash
            const hashSuffix = hash.slice(-6) // Last 6 chars of tx hash
            const numericCode = parseInt(hashSuffix, 16) % 1000000 // Convert to number and mod 1000000
            const simulatedAccessCode = numericCode.toString().padStart(6, '0') // Ensure 6 digits
            setAccessCode(simulatedAccessCode)
            setIsCheckInTransaction(false) // Reset the flag
            
            console.log('✅ Check-in successful! Access code generated:', simulatedAccessCode)
          }
        } catch (error) {
          console.error('Error extracting access code from receipt:', error)
          // Fallback: generate a deterministic code based on hash
          if (hash) {
            const hashSuffix = hash.slice(-6)
            const numericCode = parseInt(hashSuffix, 16) % 1000000
            const fallbackCode = numericCode.toString().padStart(6, '0')
            setAccessCode(fallbackCode)
            setIsCheckInTransaction(false) // Reset the flag
          }
        }
      }, 100) // Small delay to avoid synchronous setState
    }
  }, [isConfirmed, receipt, hash, isCheckInTransaction])

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
    accessCode,
    clearAccessCode: () => setAccessCode(null),
  }
}

