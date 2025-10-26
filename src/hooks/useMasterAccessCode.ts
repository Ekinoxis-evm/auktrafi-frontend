'use client'

import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import DigitalHouseVaultABI from '@/contracts/abis/DigitalHouseVault.json'

/**
 * Hook to fetch master access code from parent vault
 * Cached per vault for performance
 */
export function useMasterAccessCode(vaultAddress: Address | undefined) {
  const { data: masterCode, isLoading, error, refetch } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getMasterAccessCode',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
      // Cache for 5 minutes since master code rarely changes
      staleTime: 5 * 60 * 1000,
      // Retry failed requests
      retry: 3,
      retryDelay: 1000,
    },
  })

  // Debug logging for master code issues
  console.log('🔑 Master Access Code Hook Debug:', {
    vaultAddress,
    masterCode,
    isLoading,
    error: error?.message,
    enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
  })

  return {
    masterCode: masterCode as string | undefined,
    isLoading,
    error,
    refetch,
    // Helper to check if we have a valid master code
    hasValidMasterCode: !!(masterCode && typeof masterCode === 'string' && masterCode.length > 0),
  }
}

