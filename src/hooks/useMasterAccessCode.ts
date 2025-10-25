'use client'

import { useReadContract } from 'wagmi'
import { Address } from 'viem'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'

/**
 * Hook to fetch master access code from parent vault
 * Cached per vault for performance
 */
export function useMasterAccessCode(vaultAddress: Address | undefined) {
  const { data: masterCode, isLoading, error, refetch } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getMasterAccessCode',
    query: {
      enabled: !!vaultAddress && vaultAddress !== '0x0000000000000000000000000000000000000000',
      // Cache for 5 minutes since master code rarely changes
      staleTime: 5 * 60 * 1000,
    },
  })

  return {
    masterCode: masterCode as string | undefined,
    isLoading,
    error,
    refetch,
  }
}

