'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/config/wagmi'
import DigitalHouseFactoryABI from '@/contracts/DigitalHouseFactory.json'

export function useDigitalHouseFactory() {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  // Read functions
  const { data: allVaultIds, refetch: refetchVaultIds } = useReadContract({
    address: contractAddress,
    abi: DigitalHouseFactoryABI.abi,
    functionName: 'getAllVaultIds',
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
  const createVault = async (
    vaultId: string,
    propertyDetails: string,
    basePrice: bigint,
    realEstateAddress: string,
    masterAccessCode: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'createVault',
      args: [vaultId, propertyDetails, basePrice, realEstateAddress, masterAccessCode],
    })
  }

  // Get or create date vault (Sub-Vault System)
  const getOrCreateDateVault = async (
    parentVaultId: string,
    checkInDate: number,
    checkOutDate: number
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getOrCreateDateVault',
      args: [parentVaultId, checkInDate, checkOutDate],
    })
  }

  // Get vault info
  const useVaultInfo = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getVaultInfo',
      args: [vaultId],
    })
  }

  // Get vault address
  const useVaultAddress = (vaultId: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getVaultAddress',
      args: [vaultId],
    })
  }

  // Get owner vaults
  const useOwnerVaults = (ownerAddress: string) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getOwnerVaults',
      args: [ownerAddress],
    })
  }

  // Sub-Vault System hooks
  const useDateAvailability = (vaultId: string, checkInDate: number, checkOutDate: number) => {
    return useReadContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
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
      abi: DigitalHouseFactoryABI.abi,
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
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getParentVault',
      args: [subVaultAddress],
      query: {
        enabled: !!contractAddress && !!subVaultAddress && subVaultAddress !== '0x0000000000000000000000000000000000000000',
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
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Hooks for specific reads
    useVaultInfo,
    useVaultAddress,
    useOwnerVaults,
    
    // Sub-Vault System hooks
    useDateAvailability,
    useGetDateVault,
    useGetParentVault,
  }
}

