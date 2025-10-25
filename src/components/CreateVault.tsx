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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [savedCode, setSavedCode] = useState('')
  
  const [formData, setFormData] = useState({
    vaultId: '',
    propertyDetails: '',
    basePrice: '',
    realEstateAddress: '',
    masterAccessCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const basePriceInWei = parseUnits(formData.basePrice, 6) // PYUSD has 6 decimals
      
      // Save the master code before creating vault
      setSavedCode(formData.masterAccessCode)
      
      await createVault(
        formData.vaultId,
        formData.propertyDetails,
        basePriceInWei,
        formData.realEstateAddress,
        formData.masterAccessCode
      )
    } catch (error) {
      console.error('Error creating vault:', error)
    }
  }

  // Show success modal when transaction is confirmed
  if (isConfirmed && !showSuccessModal && savedCode) {
    setShowSuccessModal(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(savedCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleCloseModal = () => {
    if (confirmationChecked) {
      setShowSuccessModal(false)
      setConfirmationChecked(false)
      setSavedCode('')
      setCodeCopied(false)
      // Reset form
      setFormData({
        vaultId: '',
        propertyDetails: '',
        basePrice: '',
        realEstateAddress: '',
        masterAccessCode: '',
      })
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
            Master Access Code
          </label>
          <input
            type="text"
            name="masterAccessCode"
            value={formData.masterAccessCode}
            onChange={handleChange}
            placeholder="e.g., HOTEL2024"
            minLength={4}
            maxLength={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            🔑 This code will be given to guests upon check-in. You can update it later. (4-12 characters)
          </p>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Vault Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your property vault is now active
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-blue-900">
                  🔑 Master Access Code (Door)
                </p>
                <button
                  onClick={handleCopyCode}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    codeCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {codeCopied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <p className="font-mono text-3xl font-bold text-blue-900 tracking-wider text-center py-4 bg-white rounded-lg border-2 border-blue-300">
                {savedCode}
              </p>
              <p className="text-xs text-blue-700 mt-3 text-center">
                💡 This code opens the property door. Save it securely!
              </p>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900 font-semibold mb-2">⚠️ Important</p>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Save this code in a secure location</li>
                <li>• You can update it later in your property details</li>
                <li>• Share it with guests upon check-in</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmationChecked}
                  onChange={(e) => setConfirmationChecked(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I&apos;ve saved this code securely
                </span>
              </label>
            </div>

            <button
              onClick={handleCloseModal}
              disabled={!confirmationChecked}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                confirmationChecked
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {confirmationChecked ? '✨ Continue' : '⏳ Please confirm above'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

