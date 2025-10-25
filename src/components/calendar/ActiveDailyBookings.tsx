'use client'

import { useState, useMemo } from 'react'
import { formatUnits } from 'viem'
import { useDailySubVaults } from '@/hooks/useDailySubVaults'
import { VaultState } from '@/types/daily-vaults'
import { timestampToDate } from '@/config/wagmi'
import Link from 'next/link'

interface ActiveDailyBookingsProps {
  parentVaultId: string
}

export function ActiveDailyBookings({ parentVaultId }: ActiveDailyBookingsProps) {
  const { dailySubVaults, isLoading } = useDailySubVaults(parentVaultId)
  const [filterState, setFilterState] = useState<'all' | VaultState>('all')

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = dailySubVaults

    if (filterState !== 'all') {
      filtered = filtered.filter(sv => sv.currentState === filterState)
    }

    // Sort by date (earliest first)
    return filtered.sort((a, b) => a.date - b.date)
  }, [dailySubVaults, filterState])

  // Group by state
  const bookingsByState = useMemo(() => {
    const free = dailySubVaults.filter(sv => sv.currentState === VaultState.FREE)
    const auction = dailySubVaults.filter(sv => sv.currentState === VaultState.AUCTION)
    const settled = dailySubVaults.filter(sv => sv.currentState === VaultState.SETTLED)

    return { free, auction, settled }
  }, [dailySubVaults])

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    )
  }

  if (dailySubVaults.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">📅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600">This property has no bookings yet. Be the first to book!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📅 Daily Bookings
        </h3>
        <p className="text-gray-600">
          {dailySubVaults.length} day{dailySubVaults.length !== 1 ? 's' : ''} booked
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <p className="text-xs text-green-700 font-semibold mb-1">🟢 FREE</p>
          <p className="text-2xl font-bold text-green-900">{bookingsByState.free.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <p className="text-xs text-yellow-700 font-semibold mb-1">🟡 AUCTION</p>
          <p className="text-2xl font-bold text-yellow-900">{bookingsByState.auction.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <p className="text-xs text-red-700 font-semibold mb-1">🔴 SETTLED</p>
          <p className="text-2xl font-bold text-red-900">{bookingsByState.settled.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterState('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterState === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({dailySubVaults.length})
        </button>
        <button
          onClick={() => setFilterState(VaultState.FREE)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterState === VaultState.FREE
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🟢 Free ({bookingsByState.free.length})
        </button>
        <button
          onClick={() => setFilterState(VaultState.AUCTION)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterState === VaultState.AUCTION
              ? 'bg-yellow-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🟡 Auction ({bookingsByState.auction.length})
        </button>
        <button
          onClick={() => setFilterState(VaultState.SETTLED)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filterState === VaultState.SETTLED
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔴 Settled ({bookingsByState.settled.length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings match this filter</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredBookings.map((booking) => (
            <DailyBookingCard key={booking.subVaultId} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}

// Individual booking card
interface DailySubVaultInfo {
  subVaultId: string
  subVaultAddress: string
  date: number
  currentState: 0 | 1 | 2
  dailyPrice: bigint
  createdAt: number
}

function DailyBookingCard({ booking }: { booking: DailySubVaultInfo }) {
  const date = timestampToDate(booking.date)
  
  const getStateColor = () => {
    switch (booking.currentState) {
      case VaultState.FREE:
        return 'bg-green-50 border-green-200 text-green-900'
      case VaultState.AUCTION:
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case VaultState.SETTLED:
        return 'bg-red-50 border-red-200 text-red-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const getStateLabel = () => {
    switch (booking.currentState) {
      case VaultState.FREE:
        return '🟢 Available'
      case VaultState.AUCTION:
        return '🟡 In Auction'
      case VaultState.SETTLED:
        return '🔴 Occupied'
      default:
        return '⚪ Unknown'
    }
  }

  return (
    <div className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStateColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-bold text-lg">
            {date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs opacity-75">Sub-vault: {booking.subVaultId}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/50">
          {getStateLabel()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="opacity-75">Daily Price:</p>
          <p className="font-semibold">{formatUnits(booking.dailyPrice, 6)} PYUSD</p>
        </div>
        <Link href={`/marketplace/${booking.subVaultId}`}>
          <button className="px-3 py-1 bg-white/70 hover:bg-white rounded-lg text-xs font-medium transition-colors">
            View Details →
          </button>
        </Link>
      </div>
    </div>
  )
}

