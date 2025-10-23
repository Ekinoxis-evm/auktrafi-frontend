'use client'

import { useState } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { Button } from '@/components/ui/Button'
import { parseUnits } from 'viem'

export function CreateVault() {
  const { createVault, isPending, isConfirming, isConfirmed, hash } = useDigitalHouseFactory()
  
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Real Estate Address
          </label>
          <input
            type="text"
            name="realEstateAddress"
            value={formData.realEstateAddress}
            onChange={handleChange}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
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

