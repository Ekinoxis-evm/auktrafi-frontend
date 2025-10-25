'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi'
import { Address, parseUnits } from 'viem'
import { PYUSD_ADDRESSES } from '@/config/wagmi'

// ERC20 ABI for approve and allowance
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

export function usePYUSDApproval(userAddress?: Address, spenderAddress?: Address) {
  const chainId = useChainId()
  const pyusdAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES]

  // Get current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: pyusdAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress && spenderAddress ? [userAddress, spenderAddress] : undefined,
    query: {
      enabled: !!(userAddress && spenderAddress && pyusdAddress),
    },
  })

  // Get user's PYUSD balance
  const { data: balance } = useReadContract({
    address: pyusdAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!(userAddress && pyusdAddress),
    },
  })

  // Approval transaction
  const { 
    data: hash,
    isPending,
    writeContract,
    error 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  const approve = async (amount: bigint) => {
    if (!pyusdAddress || !spenderAddress) {
      throw new Error('Missing PYUSD or spender address')
    }

    return writeContract({
      address: pyusdAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amount],
    })
  }

  const needsApproval = (amount: bigint): boolean => {
    if (!currentAllowance || typeof currentAllowance !== 'bigint') return true
    return currentAllowance < amount
  }

  const hasSufficientBalance = (amount: bigint): boolean => {
    if (!balance || typeof balance !== 'bigint') return false
    return balance >= amount
  }

  return {
    approve,
    needsApproval,
    hasSufficientBalance,
    currentAllowance: currentAllowance as bigint | undefined,
    balance: balance as bigint | undefined,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    refetchAllowance,
  }
}