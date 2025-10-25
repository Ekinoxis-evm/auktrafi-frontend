'use client'

import { Address, formatUnits } from 'viem'
import { useVaultInfo, getVaultStateLabel, getVaultStateColor, getVaultStateIcon } from '@/hooks/useVaultInfo'
import { useReservation } from '@/hooks/useReservation'
import { useAccessCodes } from '@/hooks/useAccessCodes'
import { useVaultActions } from '@/hooks/useVaultActions'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface ReservationCardProps {
  vaultAddress: Address
  vaultId: string
}

export function ReservationCard({ vaultAddress, vaultId }: ReservationCardProps) {
  const { address: userAddress } = useAccount()
  const { propertyDetails, currentState, isLoading } = useVaultInfo(vaultAddress)
  const { stakeAmount, checkInDate, checkOutDate, hasActiveReservation, booker } = useReservation(vaultAddress)
  const {
    masterCode,
    currentCode,
    copyMasterCode,
    copyCurrentCode,
    masterCodeCopied,
    currentCodeCopied,
  } = useAccessCodes(vaultAddress)
  const { checkIn, checkOut, isPending } = useVaultActions(vaultAddress)
  
  const [now] = useState(() => Date.now())
  const stateNum = currentState !== undefined ? Number(currentState) : -1
  const isUserBooker = userAddress && booker && typeof booker === 'string' && booker.toLowerCase() === userAddress.toLowerCase()
  
  // Calculate timestamps
  const checkInTimestamp = checkInDate && typeof checkInDate === 'bigint' ? Number(checkInDate) * 1000 : 0
  const checkOutTimestamp = checkOutDate && typeof checkOutDate === 'bigint' ? Number(checkOutDate) * 1000 : 0
  
  // Calculate status
  const canCheckIn = isUserBooker && checkInTimestamp && now >= checkInTimestamp && now < checkOutTimestamp
  const hasCheckedIn = isUserBooker && checkInTimestamp && now >= checkInTimestamp
  const canCheckOut = isUserBooker && checkOutTimestamp && now >= checkOutTimestamp
  
  // Calculate countdown
  const daysUntilCheckIn = checkInTimestamp > now ? Math.ceil((checkInTimestamp - now) / (1000 * 60 * 60 * 24)) : 0
  
  // Format dates
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A'
    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const handleCheckIn = async () => {
    try {
      await checkIn()
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleCheckOut = async () => {
    try {
      await checkOut()
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!hasActiveReservation) {
    return null // Don't show if no active reservation
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-2">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {vaultId}
              </h3>
              <p className="text-emerald-100 text-xs">Your Reservation</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVaultStateColor(stateNum)} border-2 border-white`}>
            {getVaultStateIcon(stateNum)} {getVaultStateLabel(stateNum)}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6 space-y-4">
        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            {propertyDetails ? String(propertyDetails) : 'No details available'}
          </p>
        </div>

        {/* Booking Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-1">🏨 Check-in</p>
            <p className="text-sm font-bold text-blue-900">{formatDate(checkInTimestamp)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-purple-700 font-semibold mb-1">🚪 Check-out</p>
            <p className="text-sm font-bold text-purple-900">{formatDate(checkOutTimestamp)}</p>
          </div>
        </div>

        {/* Countdown */}
        {daysUntilCheckIn > 0 && (
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-sm text-yellow-900 font-semibold text-center">
              ⏰ Check-in in {daysUntilCheckIn} {daysUntilCheckIn === 1 ? 'day' : 'days'}
            </p>
          </div>
        )}

        {/* Stake Amount */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-700 font-semibold mb-1">💰 Your Stake</p>
          <p className="text-xl font-bold text-green-900">
            {stakeAmount && typeof stakeAmount === 'bigint' ? formatUnits(stakeAmount, 6) : '0'} PYUSD
          </p>
        </div>

        {/* Access Codes - Show if checked in */}
        {hasCheckedIn && (masterCode || currentCode) && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-300">
            <h4 className="text-sm font-bold text-indigo-900 mb-3 text-center">
              🔑 Your Access Codes
            </h4>

            {/* Master Code */}
            {masterCode && (
              <div className="bg-white rounded-lg p-3 mb-2 border border-blue-300">
                <p className="text-xs text-blue-700 font-semibold mb-2">🚪 Door Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-50 rounded p-2 border border-blue-200">
                    <p className="font-mono text-lg font-bold text-blue-900 text-center">
                      {masterCode}
                    </p>
                  </div>
                  <button
                    onClick={copyMasterCode}
                    className={`px-3 py-2 rounded text-xs font-semibold ${
                      masterCodeCopied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {masterCodeCopied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
            )}

            {/* Current Code */}
            {currentCode && (
              <div className="bg-white rounded-lg p-3 border border-green-300">
                <p className="text-xs text-green-700 font-semibold mb-2">🏨 Reception Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-green-50 rounded p-2 border border-green-200">
                    <p className="font-mono text-lg font-bold text-green-900 text-center">
                      {currentCode}
                    </p>
                  </div>
                  <button
                    onClick={copyCurrentCode}
                    className={`px-3 py-2 rounded text-xs font-semibold ${
                      currentCodeCopied ? 'bg-green-500 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {currentCodeCopied ? '✅' : '📋'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {canCheckIn && (
            <button
              onClick={handleCheckIn}
              disabled={isPending}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all"
            >
              {isPending ? '⏳ Processing...' : '✅ Check In'}
            </button>
          )}
          
          {canCheckOut && (
            <button
              onClick={handleCheckOut}
              disabled={isPending}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all"
            >
              {isPending ? '⏳ Processing...' : '🚪 Check Out'}
            </button>
          )}
          
          <Link href={`/marketplace/${encodeURIComponent(vaultId)}`}>
            <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">
              👁️ View Property Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

