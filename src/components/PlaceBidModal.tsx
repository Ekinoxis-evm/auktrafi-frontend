'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useDigitalHouseVault } from '@/hooks/useDigitalHouseVault'
import { usePYUSDApproval } from '@/hooks/usePYUSDApproval'

interface PlaceBidModalProps {
  vaultId: string
  onClose: () => void
  onSuccess: () => void
}

export function PlaceBidModal({ vaultId, onClose, onSuccess }: PlaceBidModalProps) {
  const { address, isConnected } = useAccount()
  const { useVaultInfo, useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultInfo } = useVaultInfo(vaultId)
  const { data: vaultAddressData } = useVaultAddress(vaultId)
  
  const [bidAmount, setBidAmount] = useState('')
  const [step, setStep] = useState<'input' | 'approving' | 'bidding' | 'success'>('input')
  const [error, setError] = useState<string | null>(null)

  // Get vault address (use zero address if not available yet)
  const vaultAddress = (vaultAddressData || '0x0000000000000000000000000000000000000000') as `0x${string}`

  // Initialize hooks
  const vaultHook = useDigitalHouseVault(vaultAddress)
  const approvalHook = usePYUSDApproval(address, vaultAddressData ? vaultAddress : undefined)

  // Get base price from vault info
  let basePrice = BigInt(0)
  try {
    if (vaultInfo) {
      if (Array.isArray(vaultInfo)) {
        basePrice = vaultInfo[3] as bigint
      } else if (typeof vaultInfo === 'object') {
        const info = vaultInfo as Record<string | number, unknown>
        basePrice = (info[3] as bigint) || (info.basePrice as bigint) || BigInt(0)
      }
    }
  } catch (err) {
    console.error('Error getting base price:', err)
  }

  const formattedBasePrice = Number(basePrice) / 1e6

  // Handle placing the bid (after approval)
  const handlePlaceBid = useCallback(async () => {
    if (!vaultAddressData) return
    
    try {
      const bidAmountBigInt = parseUnits(bidAmount, 6) // PYUSD has 6 decimals
      await vaultHook.placeBid(bidAmountBigInt)
    } catch (err) {
      console.error('Error placing bid:', err)
      setError(err instanceof Error ? err.message : 'Failed to place bid')
      setStep('input')
    }
  }, [vaultAddressData, bidAmount, vaultHook])

  // Watch for approval confirmation
  useEffect(() => {
    if (step === 'approving' && approvalHook.isConfirmed) {
      setStep('bidding')
      handlePlaceBid()
    }
  }, [approvalHook.isConfirmed, step, handlePlaceBid])

  // Watch for bid confirmation
  useEffect(() => {
    if (step === 'bidding' && vaultHook.isConfirmed) {
      setStep('success')
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
  }, [vaultHook.isConfirmed, step, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    if (!vaultAddressData) {
      setError('Vault address not found')
      return
    }

    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount')
      return
    }

    if (amount < formattedBasePrice) {
      setError(`Bid must be at least $${formattedBasePrice.toLocaleString()} PYUSD (base price)`)
      return
    }

    const bidAmountBigInt = parseUnits(bidAmount, 6) // PYUSD has 6 decimals

    // Check balance
    if (!approvalHook.hasSufficientBalance(bidAmountBigInt)) {
      setError('Insufficient PYUSD balance')
      return
    }

    try {
      // Check if approval is needed
      if (approvalHook.needsApproval(bidAmountBigInt)) {
        setStep('approving')
        await approvalHook.approve(bidAmountBigInt)
      } else {
        // Already approved, place bid directly
        setStep('bidding')
        await handlePlaceBid()
      }
    } catch (err) {
      console.error('Error in bid process:', err)
      setError(err instanceof Error ? err.message : 'Failed to process bid')
      setStep('input')
    }
  }

  const isSubmitting = step !== 'input'

  const suggestedBids = [
    formattedBasePrice,
    formattedBasePrice * 1.1,
    formattedBasePrice * 1.25,
    formattedBasePrice * 1.5
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">🎯 Place Your Bid</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl leading-none"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
          <p className="text-purple-100 text-sm">
            Vault: <span className="font-semibold">{vaultId}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Vault Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Minimum Bid (Base Price)</span>
              <span className="text-xl font-bold text-blue-600">
                ${formattedBasePrice.toLocaleString()} PYUSD
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Your bid must be equal to or greater than the base price
            </p>
          </div>

          {/* Warning if not connected */}
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                Please connect your wallet to place a bid
              </p>
            </div>
          )}

          {/* Bid Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Bid Amount (PYUSD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                $
              </span>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: ${formattedBasePrice.toLocaleString()}`}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none text-lg"
                step="0.01"
                min={formattedBasePrice}
                disabled={isSubmitting || !isConnected}
                required
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Quick Select Suggestions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {suggestedBids.map((amount, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setBidAmount(amount.toString())}
                  disabled={isSubmitting || !isConnected}
                  className="px-4 py-2 border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-sm text-gray-600">
                    {index === 0 ? 'Base' : `+${((amount / formattedBasePrice - 1) * 100).toFixed(0)}%`}
                  </div>
                  <div className="font-bold text-purple-600">
                    ${amount.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-600 mb-2">
              <strong>📋 Bidding Process:</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Your bid will be recorded on the blockchain</li>
              <li>Funds will be held in escrow until auction ends</li>
              <li>Higher bids have priority in selection</li>
              <li>You can view your bids in the Admin Panel</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isConnected || !bidAmount}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {step === 'approving' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Approving PYUSD...
                </span>
              ) : step === 'bidding' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Placing Bid...
                </span>
              ) : step === 'success' ? (
                <span className="flex items-center justify-center gap-2">
                  ✅ Bid Placed Successfully!
                </span>
              ) : (
                '🎯 Place Bid'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

