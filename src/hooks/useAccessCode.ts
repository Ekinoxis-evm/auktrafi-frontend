'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'

/**
 * Hook to manage access codes for vault reservations
 * Stores codes in localStorage for persistence
 */
export function useAccessCode(vaultAddress: Address) {
  const [accessCode, setAccessCode] = useState<string | null>(null)
  
  // Storage key for this vault
  const storageKey = `access_code_${vaultAddress.toLowerCase()}`
  
  // Load access code from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setAccessCode(stored)
      }
    }
  }, [storageKey])
  
  // Save access code to both state and localStorage
  const saveAccessCode = (code: string) => {
    setAccessCode(code)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, code)
    }
  }
  
  // Clear access code (when checkout happens)
  const clearAccessCode = () => {
    setAccessCode(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }
  
  return {
    accessCode,
    saveAccessCode,
    clearAccessCode,
    hasAccessCode: Boolean(accessCode),
  }
}

