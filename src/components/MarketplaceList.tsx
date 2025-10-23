'use client'

import React, { useState, useMemo } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { PlaceBidModal } from './PlaceBidModal'

export function MarketplaceList() {
  const { allVaultIds, refetchVaultIds } = useDigitalHouseFactory()
  const [selectedVaultForBid, setSelectedVaultForBid] = useState<string | null>(null)

  // Safe handling of vault IDs
  const safeVaultIds = useMemo(() => {
    try {
      if (!allVaultIds) return []
      if (!Array.isArray(allVaultIds)) {
        console.warn('allVaultIds is not an array:', allVaultIds)
        return []
      }
      return allVaultIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    } catch (error) {
      console.error('Error processing vault IDs:', error)
      return []
    }
  }, [allVaultIds])

  const vaults = safeVaultIds
  const isLoading = allVaultIds === undefined
  const error = null

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading auctions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error loading auctions</h3>
            <p className="text-sm text-red-700">{(error as Error).message}</p>
            <button 
              onClick={() => refetchVaultIds()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!vaults || vaults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🏚️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Auctions Available
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to create an auction in the Admin Panel!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Available Auctions
          </h2>
          <p className="text-sm text-gray-600">
            {vaults.length} auction{vaults.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button 
          onClick={() => refetchVaultIds()}
          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vaults.map((vaultId) => (
          <VaultAuctionCard 
            key={vaultId} 
            vaultId={vaultId}
            onPlaceBid={() => setSelectedVaultForBid(vaultId)}
          />
        ))}
      </div>

      {/* Place Bid Modal */}
      {selectedVaultForBid && (
        <PlaceBidModal
          vaultId={selectedVaultForBid}
          onClose={() => setSelectedVaultForBid(null)}
          onSuccess={() => {
            setSelectedVaultForBid(null)
            refetchVaultIds()
          }}
        />
      )}
    </div>
  )
}

function VaultAuctionCard({ 
  vaultId, 
  onPlaceBid 
}: { 
  vaultId: string
  onPlaceBid: () => void
}) {
  const { useVaultInfo } = useDigitalHouseFactory()
  const { data: vaultInfo, isLoading, error } = useVaultInfo(vaultId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
        <p className="text-sm text-red-600">⚠️ Error loading vault: {vaultId}</p>
      </div>
    )
  }

  if (!vaultInfo) return null

  // Safe destructuring with validation
  let vaultAddress: string, id: string, propertyDetails: string, basePrice: bigint, createdAt: bigint, isActive: boolean
  
  try {
    if (Array.isArray(vaultInfo)) {
      [vaultAddress, id, propertyDetails, basePrice, createdAt, isActive] = vaultInfo as [string, string, string, bigint, bigint, boolean]
    } else if (vaultInfo && typeof vaultInfo === 'object') {
      const info = vaultInfo as Record<string | number, unknown>
      vaultAddress = (info[0] as string) || (info.vaultAddress as string) || ''
      id = (info[1] as string) || (info.id as string) || vaultId
      propertyDetails = (info[2] as string) || (info.propertyDetails as string) || 'No details available'
      basePrice = (info[3] as bigint) || (info.basePrice as bigint) || BigInt(0)
      createdAt = (info[4] as bigint) || (info.createdAt as bigint) || BigInt(0)
      isActive = info[5] !== undefined ? (info[5] as boolean) : info.isActive !== undefined ? (info.isActive as boolean) : true
    } else {
      throw new Error('Invalid vault info format')
    }
  } catch (parseError) {
    console.error('Error parsing vault info for', vaultId, ':', parseError)
    return (
      <div className="bg-white rounded-lg shadow-md border border-yellow-200 p-6">
        <p className="text-sm text-yellow-800">⚠️ Unable to parse vault data: {vaultId}</p>
      </div>
    )
  }

  const formattedPrice = Number(basePrice) / 1e6 // Assuming 6 decimals for PYUSD

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">🏠 {id}</h3>
              {isActive ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  ✓ Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{propertyDetails}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Base Price</div>
            <div className="text-2xl font-bold text-blue-600">
              ${formattedPrice.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">PYUSD</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <div className="text-2xl font-bold text-purple-600">
              {isActive ? 'Open' : 'Closed'}
            </div>
            <div className="text-xs text-gray-500">for bidding</div>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Property Address:</span>
              <span className="font-mono text-gray-900 text-xs">
                {vaultAddress.slice(0, 8)}...{vaultAddress.slice(-6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-900">
                {new Date(Number(createdAt) * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPlaceBid}
            disabled={!isActive}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isActive ? '🎯 Place Bid' : '🔒 Auction Closed'}
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            📊 Details
          </button>
        </div>
      </div>
    </div>
  )
}

