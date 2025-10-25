'use client'

import { useReadContract } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import { Address } from 'viem'

export function useVaultInfo(vaultAddress: Address) {
  const { data: vaultInfo, isLoading: isLoadingInfo } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getVaultInfo',
  })

  const { data: currentState, isLoading: isLoadingState } = useReadContract({
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

  const { data: owner } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'owner',
  })

  const { data: dailyBasePrice } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'dailyBasePrice',
  })

  return {
    vaultInfo,
    currentState,
    dailyBasePrice,
    vaultId,
    propertyDetails,
    owner,
    isLoading: isLoadingInfo || isLoadingState,
  }
}

export enum VaultState {
  FREE = 0,
  AUCTION = 1,
  SETTLED = 2,
}

export function getVaultStateLabel(state: number): string {
  switch (state) {
    case VaultState.FREE:
      return 'Available'
    case VaultState.AUCTION:
      return 'Active Auction'
    case VaultState.SETTLED:
      return 'Occupied'
    default:
      return 'Unknown'
  }
}

export function getVaultStateColor(state: number): string {
  switch (state) {
    case VaultState.FREE:
      return 'bg-green-100 text-green-800'
    case VaultState.AUCTION:
      return 'bg-yellow-100 text-yellow-800'
    case VaultState.SETTLED:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getVaultStateIcon(state: number): string {
  switch (state) {
    case VaultState.FREE:
      return '🟢'
    case VaultState.AUCTION:
      return '🟡'
    case VaultState.SETTLED:
      return '🔴'
    default:
      return '⚪'
  }
}

