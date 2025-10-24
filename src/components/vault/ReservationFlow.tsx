'use client'

import { useState, useEffect, useCallback } from 'react'
import { Address, parseUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useVaultActions } from '@/hooks/useVaultActions'
import { usePYUSDApproval } from '@/hooks/usePYUSDApproval'
import { Button } from '@/components/ui/Button'

interface ReservationFlowProps {
  vaultAddress: Address
  basePrice: bigint
  onSuccess?: () => void
}

enum FlowStep {
  INPUT = 'input',
  APPROVING = 'approving',
  CREATING = 'creating',
  SUCCESS = 'success',
}

export function ReservationFlow({ vaultAddress, basePrice, onSuccess }: ReservationFlowProps) {
  const [stakeAmount, setStakeAmount] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [step, setStep] = useState<FlowStep>(FlowStep.INPUT)
  const [error, setError] = useState<string | null>(null)
  
  const { address } = useAccount()
  
  const { createReservation, isPending, isConfirming, isConfirmed, hash } = useVaultActions(vaultAddress)
  const { 
    approve, 
    needsApproval, 
    hasSufficientBalance,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    hash: approveHash
  } = usePYUSDApproval(address, vaultAddress)

  const handleCreateReservation = useCallback(async (stakeInWei: bigint) => {
    setStep(FlowStep.CREATING)
    
    // Set specific times: Check-in at 14:00 (2:00 PM), Check-out at 12:00 (noon)
    const checkInTimestamp = BigInt(Math.floor(new Date(`${checkInDate}T14:00:00`).getTime() / 1000))
    const checkOutTimestamp = BigInt(Math.floor(new Date(`${checkOutDate}T12:00:00`).getTime() / 1000))
    
    await createReservation(stakeInWei, checkInTimestamp, checkOutTimestamp)
  }, [checkInDate, checkOutDate, createReservation])

  const handleCreateAfterApproval = useCallback(async () => {
    try {
      const stakeInWei = parseUnits(stakeAmount, 6)
      await handleCreateReservation(stakeInWei)
    } catch (err) {
      console.error('Error creating reservation:', err)
      setError(err instanceof Error ? err.message : 'Failed to create reservation')
      setStep(FlowStep.INPUT)
    }
  }, [stakeAmount, handleCreateReservation])

  // Auto-progress from approving to creating
  useEffect(() => {
    if (step === FlowStep.APPROVING && isApproveConfirmed) {
      setTimeout(() => {
        handleCreateAfterApproval()
      }, 0)
    }
  }, [isApproveConfirmed, step, handleCreateAfterApproval])

  // Auto-progress to success
  useEffect(() => {
    if (step === FlowStep.CREATING && isConfirmed) {
      setTimeout(() => {
        setStep(FlowStep.SUCCESS)
        if (onSuccess) {
          setTimeout(onSuccess, 2000)
        }
      }, 0)
    }
  }, [isConfirmed, step, onSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      if (!address) {
        setError('Please connect your wallet')
        return
      }

      const stakeInWei = parseUnits(stakeAmount, 6) // PYUSD has 6 decimals
      
      // Check balance
      if (!hasSufficientBalance(stakeInWei)) {
        setError('Insufficient PYUSD balance')
        return
      }

      // Check if approval is needed
      const needsApprove = await needsApproval(stakeInWei)
      
      if (needsApprove) {
        // Start approval flow
        setStep(FlowStep.APPROVING)
        await approve(stakeInWei)
      } else {
        // Directly create reservation
        await handleCreateReservation(stakeInWei)
      }
    } catch (err) {
      console.error('Error in reservation flow:', err)
      setError(err instanceof Error ? err.message : 'Transaction failed. Please try again.')
      setStep(FlowStep.INPUT)
    }
  }

  const minStake = basePrice ? Number(basePrice) / 1000000 : 0

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">✨</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Create Your Reservation</h3>
          <p className="text-sm text-gray-600">Be the first to stake and secure this property</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💰 Stake Amount (PYUSD)
          </label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder={`Minimum: ${minStake} PYUSD`}
            step="0.01"
            min={minStake}
            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
          />
          {basePrice && (
            <p className="text-xs text-gray-500 mt-1">
              Base price: {minStake} PYUSD
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Check-in Date
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              ⏰ Default time: 14:00 (2:00 PM)
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              ⏰ Default time: 12:00 (Noon)
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">❌ {error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={step !== FlowStep.INPUT}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {step === FlowStep.INPUT && '🎯 Create Reservation'}
          {step === FlowStep.APPROVING && (isApprovePending || isApproveConfirming) && '⏳ Approving PYUSD...'}
          {step === FlowStep.CREATING && (isPending || isConfirming) && '⏳ Creating Reservation...'}
          {step === FlowStep.SUCCESS && '✅ Reservation Created!'}
        </Button>

        {/* Approval Transaction */}
        {approveHash && step === FlowStep.APPROVING && (
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-300 animate-slide-up">
            <p className="text-sm font-semibold text-blue-900 mb-1">Step 1/2: Approving PYUSD</p>
            <p className="text-xs font-mono text-blue-700 break-all">{approveHash}</p>
            {isApproveConfirmed && (
              <p className="text-sm text-blue-600 mt-2 font-semibold">✅ PYUSD approved! Creating reservation...</p>
            )}
          </div>
        )}

        {/* Reservation Transaction */}
        {hash && (step === FlowStep.CREATING || step === FlowStep.SUCCESS) && (
          <div className="mt-4 p-4 bg-green-100 rounded-xl border border-green-300 animate-slide-up">
            <p className="text-sm font-semibold text-green-900 mb-1">
              {approveHash ? 'Step 2/2: Creating Reservation' : 'Transaction Submitted'}
            </p>
            <p className="text-xs font-mono text-green-700 break-all">{hash}</p>
            {step === FlowStep.SUCCESS && (
              <p className="text-sm text-green-600 mt-2 font-semibold">✅ Reservation created successfully!</p>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        {step !== FlowStep.INPUT && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${step === FlowStep.APPROVING ? 'bg-blue-500 animate-pulse' : 'bg-blue-300'}`} />
            <div className={`w-3 h-3 rounded-full ${step === FlowStep.CREATING ? 'bg-green-500 animate-pulse' : step === FlowStep.SUCCESS ? 'bg-green-500' : 'bg-gray-300'}`} />
          </div>
        )}
      </form>
    </div>
  )
}

