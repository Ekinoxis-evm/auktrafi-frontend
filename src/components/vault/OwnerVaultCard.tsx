'use client'

import { Address, formatUnits } from 'viem'
import { useVaultInfo, getVaultStateLabel, getVaultStateColor, getVaultStateIcon, VaultState } from '@/hooks/useVaultInfo'
import { useReservation } from '@/hooks/useReservation'
import { useAuction } from '@/hooks/useAuction'
import { useReadContract, useChainId } from 'wagmi'
import { PYUSD_ADDRESSES } from '@/config/wagmi'
import Link from 'next/link'
import { useState } from 'react'

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

interface OwnerVaultCardProps {
  vaultAddress: Address
  vaultId: string
}

export function OwnerVaultCard({ vaultAddress, vaultId }: OwnerVaultCardProps) {
  const { propertyDetails, basePrice, currentState, isLoading } = useVaultInfo(vaultAddress)
  const { stakeAmount, checkInDate, checkOutDate, hasActiveReservation, booker } = useReservation(vaultAddress)
  const { activeBids } = useAuction(vaultAddress)
  const [copied, setCopied] = useState(false)
  
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

  // Calculate additional value from bids (beyond floor price)
  const additionalValue = totalValueLocked - (stakeAmount || BigInt(0))
  
  const stateNum = currentState !== undefined ? Number(currentState) : -1
  const isFree = stateNum === VaultState.FREE
  const isAuction = stateNum === VaultState.AUCTION
  const isOccupied = stateNum === VaultState.OCCUPIED

  // Generate access link
  const accessLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/marketplace/${encodeURIComponent(vaultId)}`

  const copyAccessLink = () => {
    navigator.clipboard.writeText(accessLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format dates
  const formatDate = (timestamp: bigint | undefined) => {
    if (!timestamp || timestamp === BigInt(0)) return 'N/A'
    try {
      const date = new Date(Number(timestamp) * 1000)
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Header - Owner Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-2">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {vaultId}
              </h3>
              <p className="text-blue-100 text-xs">You own this property</p>
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

        {/* Financial Overview */}
        <div className="grid grid-cols-2 gap-3">
          {/* Floor Price */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-green-700 font-semibold mb-1">💰 Floor Price</p>
            <p className="text-xl font-bold text-green-900">
              {basePrice && typeof basePrice === 'bigint' ? formatUnits(basePrice, 6) : '0'} PYUSD
            </p>
            <p className="text-xs text-green-600 mt-1">Minimum stake required</p>
          </div>

          {/* Current Stake */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold mb-1">📦 Current Stake</p>
            <p className="text-xl font-bold text-blue-900">
              {stakeAmount && typeof stakeAmount === 'bigint' ? formatUnits(stakeAmount, 6) : '0'} PYUSD
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {hasActiveReservation ? 'Active reservation' : 'No stake yet'}
            </p>
          </div>
        </div>

        {/* Additional Value from Bids */}
        {activeBids && activeBids.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-purple-700 font-semibold">💎 Additional Value from Bids</p>
              <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                {activeBids.length} Active {activeBids.length === 1 ? 'Bid' : 'Bids'}
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              +{additionalValue > BigInt(0) ? formatUnits(additionalValue, 6) : '0'} PYUSD
            </p>
            <p className="text-xs text-purple-600 mt-1">Beyond floor price</p>
          </div>
        )}

        {/* Total Value Locked */}
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold opacity-90 mb-1">🔒 TOTAL VALUE LOCKED</p>
              <p className="text-3xl font-bold">
                {formatUnits(totalValueLocked, 6)} PYUSD
              </p>
            </div>
            <div className="text-5xl opacity-50">💰</div>
          </div>
        </div>

        {/* Reservation Details */}
        {hasActiveReservation && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm font-bold text-yellow-900 mb-3">📅 Active Reservation</p>
            
            <div className="space-y-2">
              {/* Booker */}
              {booker && typeof booker === 'string' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-700">👤 Booker:</span>
                  <span className="font-mono text-yellow-900 font-semibold">
                    {booker.slice(0, 6)}...{booker.slice(-4)}
                  </span>
                </div>
              )}
              
              {/* Check-in */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">🏨 Check-in:</span>
                <span className="font-semibold text-yellow-900">{formatDate(checkInDate)}</span>
              </div>
              
              {/* Check-out */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">🚪 Check-out:</span>
                <span className="font-semibold text-yellow-900">{formatDate(checkOutDate)}</span>
              </div>
              
              {/* Duration */}
              {checkInDate && checkOutDate && typeof checkInDate === 'bigint' && typeof checkOutDate === 'bigint' && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-yellow-200">
                  <span className="text-yellow-700">⏱️ Duration:</span>
                  <span className="font-bold text-yellow-900">
                    {Math.ceil((Number(checkOutDate) - Number(checkInDate)) / (60 * 60 * 24))} days
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Access Link */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">🔑 Access Link</p>
            <button
              onClick={copyAccessLink}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
          </div>
          <p className="text-xs font-mono text-gray-600 break-all bg-white p-2 rounded border border-gray-200">
            {accessLink}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            💡 Share this link with potential bookers to view your property
          </p>
        </div>

        {/* Vault Technical Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-semibold">🔧 Vault Address</p>
          <p className="font-mono text-xs text-gray-900 break-all">
            {vaultAddress}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/marketplace/${encodeURIComponent(vaultId)}`} className="flex-1">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md">
              👁️ View Public Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

