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

  // Create vault function
  const createVault = async (
    vaultId: string,
    propertyDetails: string,
    basePrice: bigint,
    realEstateAddress: string
  ) => {
    return writeContract({
      address: contractAddress,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'createVault',
      args: [vaultId, propertyDetails, basePrice, realEstateAddress],
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

  return {
    // Contract info
    contractAddress,
    chainId,
    
    // Read data
    allVaultIds,
    refetchVaultIds,
    
    // Write functions
    createVault,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    
    // Hooks for specific reads
    useVaultInfo,
    useVaultAddress,
    useOwnerVaults,
  }
}

