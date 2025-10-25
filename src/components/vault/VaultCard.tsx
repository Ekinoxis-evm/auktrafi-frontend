'use client'

import { Address, formatUnits } from 'viem'
import { useVaultInfo, getVaultStateLabel, getVaultStateColor, getVaultStateIcon } from '@/hooks/useVaultInfo'
import { useReservation } from '@/hooks/useReservation'
import { useAuction } from '@/hooks/useAuction'
import { useDailySubVaults } from '@/hooks/useDailySubVaults'
import { useReadContract, useChainId } from 'wagmi'
import { PYUSD_ADDRESSES } from '@/config/wagmi'
import Link from 'next/link'

// ERC20 ABI minimal for balanceOf
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const

interface VaultCardProps {
  vaultAddress: Address
  vaultId: string
  showManageButton?: boolean
}

export function VaultCard({ vaultAddress, vaultId, showManageButton = false }: VaultCardProps) {
  const { propertyDetails, dailyBasePrice, currentState, isLoading } = useVaultInfo(vaultAddress)
  const { stakeAmount, checkInDate, checkOutDate, hasActiveReservation } = useReservation(vaultAddress)
  const { activeBids } = useAuction(vaultAddress)
  const { dailySubVaults } = useDailySubVaults(vaultId)
  
  const chainId = useChainId()
  const pyusdAddress = PYUSD_ADDRESSES[chainId as keyof typeof PYUSD_ADDRESSES]

  // Get the actual PYUSD balance of the vault contract (Real TVL)
  const { data: vaultPYUSDBalance } = useReadContract({
    address: pyusdAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [vaultAddress],
  })

  // Total Value Locked = Actual PYUSD balance in the vault
  const totalValueLocked = vaultPYUSDBalance || BigInt(0)

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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-lg truncate flex-1">
            🏠 {vaultId}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVaultStateColor(stateNum)} border-2 border-white`}>
            {getVaultStateIcon(stateNum)} {getVaultStateLabel(stateNum)}
          </span>
        </div>
        {/* Daily Booking Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          {dailySubVaults.length === 0 ? (
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/30">
              📅 All dates available
            </span>
          ) : (
            <>
              {dailySubVaults.filter(sv => sv.currentState === 0).length > 0 && (
                <span className="bg-green-500/90 px-2 py-1 rounded-full text-xs font-bold text-white">
                  🟢 {dailySubVaults.filter(sv => sv.currentState === 0).length} free
                </span>
              )}
              {dailySubVaults.filter(sv => sv.currentState === 1).length > 0 && (
                <span className="bg-yellow-500/90 px-2 py-1 rounded-full text-xs font-bold text-white">
                  🟡 {dailySubVaults.filter(sv => sv.currentState === 1).length} auction
                </span>
              )}
              {dailySubVaults.filter(sv => sv.currentState === 2).length > 0 && (
                <span className="bg-red-500/90 px-2 py-1 rounded-full text-xs font-bold text-white">
                  🔴 {dailySubVaults.filter(sv => sv.currentState === 2).length} occupied
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Property Details */}
        <p className="text-gray-700 text-sm line-clamp-2">
          {propertyDetails ? String(propertyDetails) : 'No details available'}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Daily Rate</p>
            <p className="font-bold text-gray-900 text-sm">
              {dailyBasePrice && typeof dailyBasePrice === 'bigint' ? `${formatUnits(dailyBasePrice, 6)} PYUSD/day` : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Vault Address</p>
            <p className="font-mono text-xs text-gray-900">
              {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
            </p>
          </div>
        </div>

        {/* Total Value Locked - Full Width Highlight */}
        {totalValueLocked > BigInt(0) && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-2 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-700 font-semibold mb-1">💰 Total Value Locked</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {formatUnits(totalValueLocked, 6)} PYUSD
                </p>
              </div>
              <div className="text-4xl">🔒</div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700">
              {stakeAmount && typeof stakeAmount === 'bigint' && stakeAmount > BigInt(0) && (
                <span className="bg-emerald-100 px-2 py-1 rounded-full">
                  📦 Floor Price: {formatUnits(stakeAmount, 6)}
                </span>
              )}
              {activeBids && activeBids.length > 0 && (
                <span className="bg-teal-100 px-2 py-1 rounded-full">
                  🎯 {activeBids.length} Bid{activeBids.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        )}

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

