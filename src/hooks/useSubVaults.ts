import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../config/wagmi'
import DigitalHouseFactoryABI from '../contracts/DigitalHouseFactory.json'

export function useSubVaults() {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]
  
  const { writeContract, data: hash, error, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Get or create sub-vault for specific dates
  const getOrCreateDateVault = async (
    parentVaultId: string,
    checkInDate: number,
    checkOutDate: number
  ) => {
    if (!contractAddress) throw new Error('Contract address not found for current chain')
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: DigitalHouseFactoryABI.abi,
      functionName: 'getOrCreateDateVault',
      args: [parentVaultId, checkInDate, checkOutDate],
    })
  }

  return {
    getOrCreateDateVault,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

// Hook to check date availability
export function useDateAvailability(vaultId: string, checkInDate: number, checkOutDate: number) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DigitalHouseFactoryABI.abi,
    functionName: 'isDateRangeAvailable',
    args: [vaultId, checkInDate, checkOutDate],
    query: {
      enabled: !!contractAddress && !!vaultId && checkInDate > 0 && checkOutDate > 0,
    },
  })
}

// Hook to get existing sub-vault address
export function useGetDateVault(vaultId: string, checkInDate: number, checkOutDate: number) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DigitalHouseFactoryABI.abi,
    functionName: 'getDateVault',
    args: [vaultId, checkInDate, checkOutDate],
    query: {
      enabled: !!contractAddress && !!vaultId && checkInDate > 0 && checkOutDate > 0,
    },
  })
}

// Hook to get parent vault from sub-vault address
export function useGetParentVault(subVaultAddress: string) {
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DigitalHouseFactoryABI.abi,
    functionName: 'getParentVault',
    args: [subVaultAddress],
    query: {
      enabled: !!contractAddress && !!subVaultAddress && subVaultAddress !== '0x0000000000000000000000000000000000000000',
    },
  })
}

// Utility function to convert date to timestamp
export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

// Utility function to convert timestamp to date
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

// Utility function to generate sub-vault ID
export function generateSubVaultId(parentVaultId: string, checkInDate: number, checkOutDate: number): string {
  return `${parentVaultId}-${checkInDate}-${checkOutDate}`
}
