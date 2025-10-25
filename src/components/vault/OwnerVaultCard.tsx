'use client'

import { Address, formatUnits } from 'viem'
import { useVaultInfo, getVaultStateLabel, getVaultStateColor, getVaultStateIcon } from '@/hooks/useVaultInfo'
import { useReservation } from '@/hooks/useReservation'
import { useAuction } from '@/hooks/useAuction'
import { useAccessCodes } from '@/hooks/useAccessCodes'
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
  const { propertyDetails, dailyBasePrice, currentState, isLoading } = useVaultInfo(vaultAddress)
  const { stakeAmount, checkInDate, checkOutDate, hasActiveReservation, booker } = useReservation(vaultAddress)
  const { activeBids } = useAuction(vaultAddress)
  const { 
    masterCode, 
    currentCode, 
    copyMasterCode, 
    copyCurrentCode, 
    masterCodeCopied, 
    currentCodeCopied,
    updateMasterCode,
    isPending,
    isConfirming 
  } = useAccessCodes(vaultAddress)
  const [copied, setCopied] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newMasterCode, setNewMasterCode] = useState('')
  const [updateError, setUpdateError] = useState('')
  
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

  // Handle master code update
  const handleUpdateMasterCode = async () => {
    setUpdateError('')
    if (!newMasterCode || newMasterCode.length < 4) {
      setUpdateError('Code must be at least 4 characters')
      return
    }
    try {
      await updateMasterCode(newMasterCode)
      setShowUpdateModal(false)
      setNewMasterCode('')
    } catch (error) {
      console.error('Error updating master code:', error)
      setUpdateError('Failed to update code. Please try again.')
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
            <p className="text-xs text-green-700 font-semibold mb-1">🌙 Nightly Rate</p>
            <p className="text-xl font-bold text-green-900">
              {dailyBasePrice && typeof dailyBasePrice === 'bigint' ? formatUnits(dailyBasePrice, 6) : '0'} PYUSD/night
            </p>
            <p className="text-xs text-green-600 mt-1">Rate per night for bookings</p>
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

        {/* Access Codes Management */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200">
          <h4 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            🔑 Access Codes Management
          </h4>
          
          {/* Master Access Code (Door) */}
          <div className="bg-white rounded-lg p-4 mb-3 border-2 border-blue-300">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-blue-900">🚪 Master Code (Door Access)</p>
                <p className="text-xs text-blue-600">This code opens the property door</p>
              </div>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all"
              >
                ✏️ Update
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="font-mono text-2xl font-bold text-blue-900 text-center tracking-wider">
                  {masterCode || 'Loading...'}
                </p>
              </div>
              <button
                onClick={copyMasterCode}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  masterCodeCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                {masterCodeCopied ? '✅ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          {/* Current Reservation Code (Reception) */}
          {hasActiveReservation && currentCode && (
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-green-900">🏨 Current Code (Reception)</p>
                  <p className="text-xs text-green-600">Guest uses this for check-in desk</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="font-mono text-2xl font-bold text-green-900 text-center tracking-wider">
                    {currentCode}
                  </p>
                </div>
                <button
                  onClick={copyCurrentCode}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    currentCodeCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  {currentCodeCopied ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          )}

          {!hasActiveReservation && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                🏨 Current reception code will appear when a guest checks in
              </p>
            </div>
          )}
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

      {/* Update Master Code Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🔑 Update Master Access Code
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Code
              </label>
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
                <p className="font-mono text-lg font-bold text-gray-900 text-center">
                  {masterCode}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Code *
              </label>
              <input
                type="text"
                value={newMasterCode}
                onChange={(e) => setNewMasterCode(e.target.value)}
                placeholder="Enter new code (min 4 characters)"
                minLength={4}
                maxLength={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg"
              />
              {updateError && (
                <p className="text-sm text-red-600 mt-1">{updateError}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                💡 Choose a secure code that you can easily share with guests
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false)
                  setNewMasterCode('')
                  setUpdateError('')
                }}
                disabled={isPending || isConfirming}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMasterCode}
                disabled={isPending || isConfirming || !newMasterCode}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
              >
                {isPending ? '⏳ Preparing...' : isConfirming ? '⏳ Confirming...' : '✅ Update Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

