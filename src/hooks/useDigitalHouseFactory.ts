'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'

export function useDigitalHouseFactory() {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // Read functions - fetch all vaults from THIS factory only
  const { data: allVaultIds, refetch: refetchVaultIds } = useReadContract({
    address: contractAddress,
    abi: DigitalHouseFactoryABI,
    functionName: 'getAllVaultIds',
    query: {
      // Refetch more frequently to get new vaults
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  })

  // Write functions
  const { 
    data: hash,
    isPending,
    writeContract 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Create vault function (updated with master access code)
  // Clone Pattern: realEstateAddress is automatically set by the Factory
  const createVault = async (
    vaultId: string,
    propertyDetails: string,
    nightPrice: bigint,
    masterAccessCode: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'createVault',
      args: [vaultId, propertyDetails, nightPrice, masterAccessCode],
    })
  }

  // Get or create date vault (Sub-Vault System - Date Range)
  const getOrCreateDateVault = async (
    parentVaultId: string,
    checkInDate: number,
    checkOutDate: number
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateDateVault',
      args: [parentVaultId, checkInDate, checkOutDate],
    })
  }

  // Daily Vault System functions
  const getOrCreateDailyVault = async (
    parentVaultId: string,
    dayTimestamp: number,
    masterAccessCode: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateDailyVault',
      args: [parentVaultId, dayTimestamp, masterAccessCode],
    })
  }

  const createMultiDayReservation = async (
    parentVaultId: string,
    dayTimestamps: number[],
    masterAccessCode: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'createMultiDayReservation',
      args: [parentVaultId, dayTimestamps, masterAccessCode],
    })
  }

  // Get vault info
  const useVaultInfo = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getVaultInfo',
      args: [vaultId],
    })
  }

  // Get vault address
  const useVaultAddress = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getVaultAddress',
      args: [vaultId],
    })
  }

  // Get owner vaults
  const useOwnerVaults = (ownerAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOwnerVaults',
      args: [ownerAddress],
    })
  }

  // Sub-Vault System hooks
  const useDateAvailability = (vaultId: string, checkInDate: number, checkOutDate: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'isDateRangeAvailable',
      args: [vaultId, checkInDate, checkOutDate],
      query: {
        enabled: !!contractAddress && !!vaultId && checkInDate > 0 && checkOutDate > 0,
      },
    })
  }

  const useGetDateVault = (vaultId: string, checkInDate: number, checkOutDate: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getDateVault',
      args: [vaultId, checkInDate, checkOutDate],
      query: {
        enabled: !!contractAddress && !!vaultId && checkInDate > 0 && checkOutDate > 0,
      },
    })
  }

  const useGetParentVault = (subVaultAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getParentVault',
      args: [subVaultAddress],
      query: {
        enabled: !!contractAddress && !!subVaultAddress && subVaultAddress !== '0x0000000000000000000000000000000000000000',
      },
    })
  }

  // Daily Vault System hooks
  const useGetDailySubVault = (vaultId: string, dayTimestamp: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getDailySubVault',
      args: [vaultId, dayTimestamp],
      query: {
        enabled: !!contractAddress && !!vaultId && dayTimestamp > 0,
      },
    })
  }

  const useGetDailySubVaultsInfo = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getDailySubVaultsInfo',
      args: [vaultId],
      query: {
        enabled: !!contractAddress && !!vaultId,
      },
    })
  }

  return {
    // Contract info
    contractAddress,
    chainId,
    
    // Read data
    allVaultIds,
    refetchVaultIds,
    
    // Write functions
    createVault,
    getOrCreateDateVault,
    getOrCreateDailyVault,
    createMultiDayReservation,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Hooks for specific reads
    useVaultInfo,
    useVaultAddress,
    useOwnerVaults,
    
    // Sub-Vault System hooks (Date Range)
    useDateAvailability,
    useGetDateVault,
    useGetParentVault,
    
    // Daily Vault System hooks
    useGetDailySubVault,
    useGetDailySubVaultsInfo,
  }
}

