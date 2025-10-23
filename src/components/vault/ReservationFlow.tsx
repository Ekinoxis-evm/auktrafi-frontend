'use client'

import { useState } from 'react'
import { Address, parseUnits } from 'viem'
import { useVaultActions } from '@/hooks/useVaultActions'
import { Button } from '@/components/ui/Button'

interface ReservationFlowProps {
  vaultAddress: Address
  basePrice: bigint
  onSuccess?: () => void
}

export function ReservationFlow({ vaultAddress, basePrice, onSuccess }: ReservationFlowProps) {
  const [stakeAmount, setStakeAmount] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  
  const { createReservation, isPending, isConfirming, isConfirmed, hash } = useVaultActions(vaultAddress)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const stakeInWei = parseUnits(stakeAmount, 6) // PYUSD has 6 decimals
      const checkInTimestamp = BigInt(new Date(checkInDate).getTime() / 1000)
      const checkOutTimestamp = BigInt(new Date(checkOutDate).getTime() / 1000)
      
      await createReservation(stakeInWei, checkInTimestamp, checkOutTimestamp)
      
      if (onSuccess) {
        setTimeout(onSuccess, 2000) // Wait for confirmation
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
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
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending || isConfirming}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          {isPending ? '⏳ Preparing Transaction...' : 
           isConfirming ? '⏳ Confirming on Blockchain...' : 
           '🎯 Create Reservation'}
        </Button>

        {hash && (
          <div className="mt-4 p-4 bg-green-100 rounded-xl border border-green-300 animate-slide-up">
            <p className="text-sm font-semibold text-green-900 mb-1">Transaction Submitted</p>
            <p className="text-xs font-mono text-green-700 break-all">{hash}</p>
            {isConfirmed && (
              <p className="text-sm text-green-600 mt-2 font-semibold">✅ Reservation created successfully!</p>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

