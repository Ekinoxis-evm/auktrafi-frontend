'use client'

import { useState } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { Button } from '@/components/ui/Button'
import { parseUnits } from 'viem'

interface CreateVaultProps {
  userWallet?: `0x${string}`
}

export function CreateVault({ userWallet }: CreateVaultProps = {}) {
  const { createVault, isPending, isConfirming, isConfirmed, hash } = useDigitalHouseFactory()
  const [showTooltip, setShowTooltip] = useState(false)
  
  const [formData, setFormData] = useState({
    vaultId: '',
    propertyDetails: '',
    basePrice: '',
    realEstateAddress: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const basePriceInWei = parseUnits(formData.basePrice, 6) // PYUSD has 6 decimals
      
      await createVault(
        formData.vaultId,
        formData.propertyDetails,
        basePriceInWei,
        formData.realEstateAddress
      )
    } catch (error) {
      console.error('Error creating vault:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">🏗️ Create New Vault</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vault ID
          </label>
          <input
            type="text"
            name="vaultId"
            value={formData.vaultId}
            onChange={handleChange}
            placeholder="e.g., APT-NYC-101"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Details
          </label>
          <textarea
            name="propertyDetails"
            value={formData.propertyDetails}
            onChange={handleChange}
            placeholder="Describe the property..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Price (PYUSD)
          </label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            placeholder="1000"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Real Estate Address
            </label>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                ℹ️ What&apos;s this?
              </button>
              {showTooltip && (
                <div className="absolute z-10 right-0 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg -mt-2">
                  <p className="font-semibold mb-1">💰 Payment Destination</p>
                  <p>This wallet address will receive all PYUSD payments from reservations and bids. We recommend using your own wallet address for easy access to your earnings.</p>
                  <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900 -mt-2"></div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              name="realEstateAddress"
              value={formData.realEstateAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              required
            />
            {userWallet && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, realEstateAddress: userWallet }))}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md font-semibold text-sm transition-all whitespace-nowrap"
                title="Use your connected wallet address"
              >
                💼 Use My Wallet
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 Tip: Use the address shown at the top to receive payments to your connected wallet
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full"
        >
          {isPending ? '⏳ Preparing...' : isConfirming ? '⏳ Confirming...' : '✨ Create Vault'}
        </Button>

        {hash && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-900">Transaction Hash:</p>
            <p className="text-xs font-mono text-blue-700 break-all mt-1">{hash}</p>
            {isConfirmed && (
              <p className="text-sm text-green-600 mt-2">✅ Vault created successfully!</p>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

