'use client'

import { Button } from './ui/Button'
import { useDigitalHouseVault } from '@/hooks/useDigitalHouseVault'
import { useMemo } from 'react'

interface BidsListProps {
  vaultAddress: `0x${string}`
  onTransfer: (bidderAddress: string) => void
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function BidsList({ vaultAddress, onTransfer }: BidsListProps) {
  const { auctionBids, refetchBids } = useDigitalHouseVault(vaultAddress)

  // Process and format bids from contract
  const processedBids = useMemo(() => {
    if (!auctionBids || !Array.isArray(auctionBids)) return []
    
    return auctionBids
      .filter((bid: unknown) => {
        if (!bid || typeof bid !== 'object') return false
        const b = bid as { isActive?: boolean }
        return b.isActive !== false
      })
      .map((bid: unknown, index: number) => {
        const b = bid as {
          bidder: string
          amount: bigint
          timestamp: bigint
          isActive: boolean
        }
        return {
          bidder: b.bidder || '',
          amount: (Number(b.amount) / 1e6).toString(), // PYUSD has 6 decimals
          timestamp: Number(b.timestamp) * 1000, // Convert to milliseconds
          status: b.isActive ? 'active' : 'inactive',
          index
        }
      })
  }, [auctionBids])

  if (!auctionBids) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600">Loading bids...</p>
      </div>
    )
  }

  if (processedBids.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Bids Yet</h3>
        <p className="text-gray-600 mb-4">
          Waiting for participants to place their bids
        </p>
        <Button onClick={() => refetchBids()} variant="outline" size="sm">
          🔄 Refresh
        </Button>
      </div>
    )
  }

  // Sort bids by amount (highest first)
  const sortedBids = [...processedBids].sort((a, b) => Number(b.amount) - Number(a.amount))

  return (
    <div className="space-y-3">
      {sortedBids.map((bid, index) => (
        <div
          key={`${bid.bidder}-${index}`}
          className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
            index === 0 ? 'bg-green-50 border-green-200' : 'bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Bidder Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {index === 0 && (
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                    🏆 HIGHEST
                  </span>
                )}
                {index === 1 && (
                  <span className="px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded">
                    🥈 2nd
                  </span>
                )}
                {index === 2 && (
                  <span className="px-2 py-1 bg-orange-400 text-white text-xs font-bold rounded">
                    🥉 3rd
                  </span>
                )}
                <span className={`text-xs font-semibold ${
                  bid.status === 'active' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {bid.status === 'active' ? '● Active' : '○ Inactive'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Bidder Address</div>
                  <div className="font-mono text-sm text-gray-900">
                    {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 mb-1">Bid Amount</div>
                  <div className="text-lg font-bold text-purple-600">
                    ${Number(bid.amount).toLocaleString()} PYUSD
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-600 mb-1">Bid Time</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(bid.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                onClick={() => onTransfer(bid.bidder)}
                className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                size="sm"
              >
                🔄 Transfer Bid
              </Button>
              <Button
                variant="outline"
                className="text-gray-600 whitespace-nowrap"
                size="sm"
              >
                📋 View Details
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
            <div className="flex gap-4 text-gray-600">
              <span>Position: #{index + 1}</span>
              <span>•</span>
              <span>Total Bids: {sortedBids.length}</span>
            </div>
            <button className="text-blue-600 hover:underline">
              Copy Address
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
