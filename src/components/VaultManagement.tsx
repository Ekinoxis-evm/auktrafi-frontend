'use client'

import { useState } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { Button } from './ui/Button'
import { BidsList } from './BidsList'
import { TransferBidModal } from './TransferBidModal'

interface VaultManagementProps {
  vaultId: string
}

export function VaultManagement({ vaultId }: VaultManagementProps) {
  const { useVaultInfo } = useDigitalHouseFactory()
  const { data: vaultInfo, refetch } = useVaultInfo(vaultId)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedBidder, setSelectedBidder] = useState<string | null>(null)

  // Mock bids data - In production, this would come from contract events
  const mockBids = [
    {
      bidder: '0x1234567890123456789012345678901234567890',
      amount: '1500',
      timestamp: Date.now() - 86400000,
      status: 'active'
    },
    {
      bidder: '0x2345678901234567890123456789012345678901',
      amount: '1800',
      timestamp: Date.now() - 43200000,
      status: 'active'
    },
    {
      bidder: '0x3456789012345678901234567890123456789012',
      amount: '2000',
      timestamp: Date.now() - 3600000,
      status: 'active'
    }
  ]

  const handleTransferBid = (bidderAddress: string) => {
    setSelectedBidder(bidderAddress)
    setIsTransferModalOpen(true)
  }

  if (!vaultInfo) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading vault information...</p>
        </div>
      </div>
    )
  }

  const [creator, details, basePrice, realEstateAddress, active] = vaultInfo as [
    string,
    string,
    bigint,
    string,
    boolean
  ]

  const formattedPrice = Number(basePrice) / 1e6 // Assuming 6 decimals for PYUSD

  return (
    <div className="space-y-6">
      {/* Vault Header */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {vaultId}
            </h2>
            <p className="text-gray-600">{details}</p>
          </div>
          {active ? (
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-full">
              ✓ Active
            </span>
          ) : (
            <span className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-full">
              Inactive
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Base Price</div>
            <div className="text-2xl font-bold text-blue-600">
              ${formattedPrice.toLocaleString()} PYUSD
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Bids</div>
            <div className="text-2xl font-bold text-purple-600">
              {mockBids.length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Highest Bid</div>
            <div className="text-2xl font-bold text-green-600">
              ${Math.max(...mockBids.map(b => Number(b.amount))).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Property Address:</span>
              <p className="font-mono text-gray-900 mt-1">{realEstateAddress}</p>
            </div>
            <div>
              <span className="text-gray-600">Creator:</span>
              <p className="font-mono text-gray-900 mt-1">
                {creator.slice(0, 6)}...{creator.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="text-blue-600 border-blue-600"
            >
              🔄 Refresh
            </Button>
            <Button
              variant="outline"
              className="text-gray-600"
            >
              📊 View Analytics
            </Button>
            <Button
              variant="outline"
              className={active ? "text-red-600 border-red-600" : "text-green-600 border-green-600"}
            >
              {active ? "⏸️ Pause Auction" : "▶️ Activate Auction"}
            </Button>
          </div>
        </div>
      </div>

      {/* Bids Management */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            📋 Bids Management
          </h3>
          <span className="text-sm text-gray-600">
            Manage and transfer bids to other participants
          </span>
        </div>

        <BidsList 
          bids={mockBids} 
          onTransfer={handleTransferBid}
        />
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && selectedBidder && (
        <TransferBidModal
          vaultId={vaultId}
          bidderAddress={selectedBidder}
          bidAmount={mockBids.find(b => b.bidder === selectedBidder)?.amount || '0'}
          onClose={() => {
            setIsTransferModalOpen(false)
            setSelectedBidder(null)
          }}
        />
      )}
    </div>
  )
}

