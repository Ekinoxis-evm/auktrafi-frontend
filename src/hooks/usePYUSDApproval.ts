'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useChainId } from 'wagmi'
import { PYUSD_ADDRESSES } from '@/config/wagmi'

// ERC20 ABI minimal (solo approve y allowance)
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const

export function usePYUSDApproval(ownerAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const chainId = useChainId()
  const pyusdAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES]

  // Check current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: pyusdAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: ownerAddress && spenderAddress ? [ownerAddress, spenderAddress] : undefined,
    query: {
      enabled: Boolean(ownerAddress && spenderAddress),
    }
  })

  // Check PYUSD balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: pyusdAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: Boolean(ownerAddress),
    }
  })

  // Write contract
  const { 
    data: hash,
    isPending,
    writeContract,
    error: writeError
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Approve PYUSD
  const approve = async (amount: bigint) => {
    if (!spenderAddress) {
      console.error('Spender address not provided')
      throw new Error('Spender address not provided')
    }
    
    console.log('=== PYUSD APPROVAL ===')
    console.log('PYUSD Address:', pyusdAddress)
    console.log('Spender (Vault):', spenderAddress)
    console.log('Amount to approve:', amount.toString())
    
    return writeContract({
      address: pyusdAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amount],
    })
  }

  // Approve max amount (common pattern)
  const approveMax = async () => {
    const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
    return approve(maxUint256)
  }

  // Check if approval is needed
  const needsApproval = (amount: bigint): boolean => {
    console.log('=== CHECK APPROVAL ===')
    console.log('Current Allowance:', currentAllowance?.toString())
    console.log('Amount needed:', amount.toString())
    
    if (!currentAllowance) {
      console.log('No allowance found, approval needed')
      return true
    }
    
    const needed = currentAllowance < amount
    console.log('Approval needed:', needed)
    return needed
  }

  // Check if user has sufficient balance
  const hasSufficientBalance = (amount: bigint): boolean => {
    console.log('=== CHECK BALANCE ===')
    console.log('Current Balance:', balance?.toString())
    console.log('Amount needed:', amount.toString())
    
    if (!balance) {
      console.log('No balance found')
      return false
    }
    
    const sufficient = balance >= amount
    console.log('Sufficient balance:', sufficient)
    return sufficient
  }

  return {
    // Read data
    currentAllowance,
    balance,
    pyusdAddress,
    refetchAllowance,
    refetchBalance,
    
    // Write functions
    approve,
    approveMax,
    
    // Helper functions
    needsApproval,
    hasSufficientBalance,
    
    // Transaction state
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    writeError,
  }
}

