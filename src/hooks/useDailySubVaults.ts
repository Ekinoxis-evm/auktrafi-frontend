'use client'

import { useMemo } from 'react'
import { useReadContract, useChainId } from 'wagmi'
import { Address } from 'viem'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'

interface DailySubVaultInfo {
  subVaultAddress: Address
  subVaultId: string
  date: number
  currentState: 0 | 1 | 2
  dailyPrice: bigint
  createdAt: number
}

interface MonthStats {
  free: number
  auction: number
  settled: number
  total: number
  noSubVault: number
}

/**
 * Hook to fetch and manage daily sub-vault information from factory contract
 */
export function useDailySubVaults(parentVaultId: string) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // Fetch all daily sub-vaults for this parent vault
  const { data: rawSubVaults, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: DigitalHouseFactoryABI,
    functionName: 'getDailySubVaultsInfo',
    args: [parentVaultId],
    query: {
      enabled: !!contractAddress && !!parentVaultId,
    },
  })

  // Parse and normalize the sub-vaults data
  const dailySubVaults = useMemo(() => {
    if (!rawSubVaults || !Array.isArray(rawSubVaults)) return []

    return rawSubVaults.map((sv: unknown) => {
      // Handle both object and array formats from contract
      const data = sv as Record<string | number, unknown> | unknown[]
      
      if (Array.isArray(data)) {
        const priceValue = data[4]
        return {
          subVaultAddress: data[0] as Address,
          subVaultId: data[1] as string,
          date: Number(data[2]),
          currentState: Number(data[3]) as 0 | 1 | 2,
          dailyPrice: typeof priceValue === 'bigint' ? priceValue : BigInt(String(priceValue || 0)),
          createdAt: Number(data[5]),
        }
      } else {
        const priceValue = data.dailyPrice || data[4]
        return {
          subVaultAddress: (data.subVaultAddress || data[0]) as Address,
          subVaultId: (data.subVaultId || data[1]) as string,
          date: Number(data.date || data[2]),
          currentState: Number(data.currentState || data[3]) as 0 | 1 | 2,
          dailyPrice: typeof priceValue === 'bigint' ? priceValue : BigInt(String(priceValue || 0)),
          createdAt: Number(data.createdAt || data[5]),
        }
      }
    }) as DailySubVaultInfo[]
  }, [rawSubVaults])

  // Create a map for quick lookups by date
  const dateMap = useMemo(() => {
    const map = new Map<string, DailySubVaultInfo>()
    dailySubVaults.forEach(sv => {
      const dateKey = getDateKey(new Date(sv.date * 1000))
      map.set(dateKey, sv)
    })
    return map
  }, [dailySubVaults])

  /**
   * Get the state of a specific day
   * @returns State number (0=FREE, 1=AUCTION, 2=SETTLED) or null if no sub-vault exists
   */
  const getDayState = (date: Date): 0 | 1 | 2 | null => {
    const dateKey = getDateKey(date)
    const subVault = dateMap.get(dateKey)
    return subVault ? subVault.currentState : null
  }

  /**
   * Get the sub-vault address for a specific day
   * @returns Address or undefined if no sub-vault exists
   */
  const getDaySubVault = (date: Date): Address | undefined => {
    const dateKey = getDateKey(date)
    return dateMap.get(dateKey)?.subVaultAddress
  }

  /**
   * Check if a date is available for booking
   * @returns true if date has no sub-vault or is in FREE state
   */
  const isDateAvailable = (date: Date): boolean => {
    const state = getDayState(date)
    return state === null || state === 0
  }

  /**
   * Get statistics for a specific month
   */
  const getMonthStats = (month: Date): MonthStats => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    let free = 0
    let auction = 0
    let settled = 0
    let noSubVault = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day)
      const state = getDayState(date)

      if (state === null) {
        noSubVault++
      } else if (state === 0) {
        free++
      } else if (state === 1) {
        auction++
      } else if (state === 2) {
        settled++
      }
    }

    return {
      free,
      auction,
      settled,
      total: free + auction + settled,
      noSubVault,
    }
  }

  /**
   * Get daily price (same for all days)
   */
  const getDailyPrice = (): bigint => {
    return dailySubVaults[0]?.dailyPrice || BigInt(0)
  }

  return {
    dailySubVaults,
    isLoading,
    error,
    refetch,
    getDayState,
    getDaySubVault,
    isDateAvailable,
    getMonthStats,
    getDailyPrice,
  }
}

/**
 * Helper to generate consistent date keys (YYYY-MM-DD)
 */
function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export type { DailySubVaultInfo, MonthStats }

