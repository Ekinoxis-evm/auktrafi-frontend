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

  // Night Vault System - Create or get a night sub-vault for booking
  const getOrCreateNightVault = async (
    parentVaultId: string,
    nightTimestamp: number,
    masterAccessCode: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getOrCreateNightVault',
      args: [parentVaultId, BigInt(nightTimestamp), masterAccessCode],
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

  // Night Vault System hooks - Query functions
  const useNightAvailability = (vaultId: string, nightTimestamp: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getNightAvailability',
      args: [vaultId, BigInt(nightTimestamp)],
      query: {
        enabled: !!contractAddress && !!vaultId && nightTimestamp > 0,
      },
    })
  }

  const useGetNightSubVault = (vaultId: string, nightTimestamp: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getNightSubVault',
      args: [vaultId, BigInt(nightTimestamp)],
      query: {
        enabled: !!contractAddress && !!vaultId && nightTimestamp > 0,
      },
    })
  }

  const useGetNightSubVaultsInfo = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI,
      functionName: 'getNightSubVaultsInfo',
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
    getOrCreateNightVault,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Hooks for specific reads
    useVaultInfo,
    useVaultAddress,
    useOwnerVaults,
    
    // Night Vault System hooks
    useNightAvailability,
    useGetNightSubVault,
    useGetNightSubVaultsInfo,
    
    // Legacy hooks (for compatibility, may be removed)
    useGetParentVault,
    useDateAvailability,
    useGetDateVault,
  }
}

