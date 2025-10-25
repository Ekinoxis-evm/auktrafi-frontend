'use client'

import { useState } from 'react'
import { Address } from 'viem'
import { useDigitalHouseVault } from './useDigitalHouseVault'

/**
 * Centralized hook for managing vault access codes
 * Handles both master access code (door) and current access code (reception)
 */
export function useAccessCodes(vaultAddress: Address) {
  const {
    masterAccessCode,
    currentAccessCode,
    updateMasterAccessCode,
    refetchMasterCode,
    refetchCurrentCode,
    isPending,
    isConfirming,
    isConfirmed,
  } = useDigitalHouseVault(vaultAddress)

  const [masterCodeCopied, setMasterCodeCopied] = useState(false)
  const [currentCodeCopied, setCurrentCodeCopied] = useState(false)

  // Copy master code to clipboard
  const copyMasterCode = () => {
    if (masterAccessCode && typeof masterAccessCode === 'string') {
      navigator.clipboard.writeText(masterAccessCode)
      setMasterCodeCopied(true)
      setTimeout(() => setMasterCodeCopied(false), 2000)
    }
  }

  // Copy current code to clipboard
  const copyCurrentCode = () => {
    if (currentAccessCode && typeof currentAccessCode === 'string') {
      navigator.clipboard.writeText(currentAccessCode)
      setCurrentCodeCopied(true)
      setTimeout(() => setCurrentCodeCopied(false), 2000)
    }
  }

  // Update master access code
  const handleUpdateMasterCode = async (newCode: string) => {
    if (!newCode || newCode.length < 4) {
      throw new Error('Code must be at least 4 characters')
    }
    await updateMasterAccessCode(newCode)
    // Refetch after update
    setTimeout(() => {
      refetchMasterCode()
    }, 2000)
  }

  return {
    // Access codes
    masterCode: masterAccessCode && typeof masterAccessCode === 'string' ? masterAccessCode : undefined,
    currentCode: currentAccessCode && typeof currentAccessCode === 'string' ? currentAccessCode : undefined,
    
    // Copy functions
    copyMasterCode,
    copyCurrentCode,
    masterCodeCopied,
    currentCodeCopied,
    
    // Update functions
    updateMasterCode: handleUpdateMasterCode,
    
    // Refetch functions
    refetchMasterCode,
    refetchCurrentCode,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
  }
}

