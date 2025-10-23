'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { useAccount } from 'wagmi'
import { useFundWallet } from '@privy-io/react-auth'

interface Vault {
  vaultId: string
  creator: string
  propertyDetails: string
  basePrice: bigint
  realEstateAddress: string
  active: boolean
  createdAt: bigint
}

interface StakeModalProps {
  vault: Vault
  onClose: () => void
}

export function StakeModal({ vault, onClose }: StakeModalProps) {
  const [amount, setAmount] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const { address } = useAccount()
  const { fundWallet } = useFundWallet()

  const formattedPrice = Number(vault.basePrice) / 1e6

  const handleStake = async () => {
    if (!address || !amount) return

    setIsStaking(true)
    try {
      // TODO: Implement actual staking logic with contract interaction
      console.log('Staking:', { vault: vault.vaultId, amount })
      
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert(`Successfully staked ${amount} PYUSD on ${vault.vaultId}!`)
      onClose()
    } catch (error) {
      console.error('Staking error:', error)
      alert('Error staking. Please try again.')
    } finally {
      setIsStaking(false)
    }
  }

  const handleFund = () => {
    if (address) {
      fundWallet({ address })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              💎 Stake on Auction
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vault Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Staking on</div>
            <div className="font-bold text-gray-900">{vault.vaultId}</div>
            <div className="text-sm text-gray-600 mt-2">{vault.propertyDetails}</div>
          </div>

          {/* Base Price */}
          <div>
            <div className="text-sm text-gray-600 mb-1">Base Price</div>
            <div className="text-3xl font-bold text-purple-600">
              ${formattedPrice.toLocaleString()} PYUSD
            </div>
          </div>

          {/* Stake Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stake Amount (PYUSD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="0"
              step="0.01"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setAmount(formattedPrice.toString())}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Min: ${formattedPrice}
              </button>
              <button
                onClick={() => setAmount((formattedPrice * 1.5).toString())}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                1.5x
              </button>
              <button
                onClick={() => setAmount((formattedPrice * 2).toString())}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                2x
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">ℹ️</span>
              <div className="text-sm text-gray-700">
                <p className="mb-2">
                  By staking, you&apos;re participating in this auction. Your stake will be locked until the auction ends.
                </p>
                <p className="text-xs text-gray-600">
                  Make sure you have enough PYUSD in your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Need funds? */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 mb-2">
              Need funds? Transfer or bridge from another wallet
            </div>
            <Button
              onClick={handleFund}
              variant="outline"
              className="w-full text-green-600 border-green-600 hover:bg-green-100"
            >
              💰 Transfer Funds
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isStaking}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStake}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            disabled={!amount || Number(amount) < formattedPrice || isStaking}
          >
            {isStaking ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Staking...
              </>
            ) : (
              <>💎 Confirm Stake</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

