'use client'

import { useState } from 'react'
import { Button } from './ui/Button'
import { StakeModal } from './StakeModal'

interface Vault {
  vaultId: string
  creator: string
  propertyDetails: string
  basePrice: bigint
  realEstateAddress: string
  active: boolean
  createdAt: bigint
}

interface AuctionCardProps {
  vault: Vault
}

export function AuctionCard({ vault }: AuctionCardProps) {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  
  const formattedPrice = Number(vault.basePrice) / 1e6 // Assuming 6 decimals for PYUSD
  const formattedDate = new Date(Number(vault.createdAt) * 1000).toLocaleDateString()

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {vault.vaultId}
                </h3>
                {vault.active ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    ✓ Active
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{vault.propertyDetails}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span className="font-mono">{vault.realEstateAddress.slice(0, 20)}...</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Base Price</div>
                <div className="text-2xl font-bold text-purple-600">
                  ${formattedPrice.toLocaleString()} PYUSD
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsStakeModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!vault.active}
                >
                  💎 Stake Now
                </Button>
                <Button
                  variant="outline"
                  className="text-gray-600"
                >
                  📊 Details
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Creator: {vault.creator.slice(0, 6)}...{vault.creator.slice(-4)}</span>
              <span className="font-mono">ID: {vault.vaultId}</span>
            </div>
          </div>
        </div>
      </div>

      {isStakeModalOpen && (
        <StakeModal
          vault={vault}
          onClose={() => setIsStakeModalOpen(false)}
        />
      )}
    </>
  )
}

