'use client'

import { useState, useEffect } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { Button } from '@/components/ui/Button'
import { parseUnits, formatUnits } from 'viem'

export function CreateVault() {
  const { createVault, isPending, isConfirming, isConfirmed, hash } = useDigitalHouseFactory()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [savedCode, setSavedCode] = useState('')
  
  const [formData, setFormData] = useState({
    vaultId: '',
    propertyDetails: '',
    dailyBasePrice: '',
    masterAccessCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields are filled
    if (!formData.vaultId.trim()) {
      alert('Please enter a Vault ID')
      return
    }
    if (!formData.propertyDetails.trim()) {
      alert('Please enter Property Details')
      return
    }
    if (!formData.dailyBasePrice.trim() || isNaN(Number(formData.dailyBasePrice))) {
      alert('Please enter a valid Nightly Rate')
      return
    }
    if (!formData.masterAccessCode.trim()) {
      alert('Please enter a Master Access Code')
      return
    }
    if (formData.masterAccessCode.length < 4 || formData.masterAccessCode.length > 12) {
      alert('Master Access Code must be between 4-12 characters')
      return
    }
    
    try {
      const dailyBasePriceInWei = parseUnits(formData.dailyBasePrice, 6) // PYUSD has 6 decimals
      
      // Validate parameters before sending
      if (dailyBasePriceInWei <= BigInt(0)) {
        throw new Error('Daily base price must be greater than 0')
      }
      
      if (!formData.vaultId.trim() || formData.vaultId.length < 3) {
        throw new Error('Vault ID must be at least 3 characters')
      }
      
      if (!formData.propertyDetails.trim() || formData.propertyDetails.length < 10) {
        throw new Error('Property details must be at least 10 characters')
      }
      
      if (!formData.masterAccessCode.trim() || formData.masterAccessCode.length < 4) {
        throw new Error('Master access code must be at least 4 characters')  
      }
      
      // Save the master code before creating vault
      setSavedCode(formData.masterAccessCode.trim())
      
      await createVault(
        formData.vaultId.trim(),
        formData.propertyDetails.trim(),
        dailyBasePriceInWei,
        formData.masterAccessCode.trim()
      )
    } catch (error) {
      console.error('❌ Error creating vault:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      alert(`Error creating vault: ${errorMessage}`)
    }
  }

  // Show success modal when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && !showSuccessModal && savedCode) {
      setShowSuccessModal(true)
    }
  }, [isConfirmed, showSuccessModal, savedCode])

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
        dailyBasePrice: '',
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
            🌙 Nightly Rate (PYUSD/night)
          </label>
          <input
            type="number"
            name="dailyBasePrice"
            value={formData.dailyBasePrice}
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

