'use client'

import { Address, formatUnits } from 'viem'
import { useVaultInfo, getVaultStateLabel, getVaultStateColor, getVaultStateIcon } from '@/hooks/useVaultInfo'
import { useReservation } from '@/hooks/useReservation'
import Link from 'next/link'

interface VaultCardProps {
  vaultAddress: Address
  vaultId: string
  showManageButton?: boolean
}

export function VaultCard({ vaultAddress, vaultId, showManageButton = false }: VaultCardProps) {
  const { propertyDetails, basePrice, currentState, owner, isLoading } = useVaultInfo(vaultAddress)
  const { checkInDate, checkOutDate, hasActiveReservation } = useReservation(vaultAddress)

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  const stateNum = currentState !== undefined ? Number(currentState) : -1

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden group hover:scale-[1.02]">
      {/* Header with Status */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg truncate flex-1">
            🏠 {vaultId}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVaultStateColor(stateNum)} border-2 border-white`}>
            {getVaultStateIcon(stateNum)} {getVaultStateLabel(stateNum)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Property Details */}
        <p className="text-gray-700 text-sm line-clamp-2">
          {propertyDetails || 'No details available'}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Base Price</p>
            <p className="font-bold text-gray-900">
              {basePrice ? `${formatUnits(basePrice, 6)} PYUSD` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Vault Address</p>
            <p className="font-mono text-xs text-gray-900">
              {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
            </p>
          </div>
        </div>

        {/* Reservation Dates */}
        {hasActiveReservation && checkInDate && checkOutDate && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-900 font-semibold mb-2">📅 Reservation Dates</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-blue-700">Check-in:</p>
                <p className="font-semibold text-blue-900">
                  {new Date(Number(checkInDate) * 1000).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Check-out:</p>
                <p className="font-semibold text-blue-900">
                  {new Date(Number(checkOutDate) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/marketplace/${encodeURIComponent(vaultId)}`} className="flex-1">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md">
              👁️ View Details
            </button>
          </Link>
          {showManageButton && (
            <Link href={`/ownerships/${encodeURIComponent(vaultId)}`}>
              <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all">
                ⚙️ Manage
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

