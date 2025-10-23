'use client'

import { use } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useVaultInfo, VaultState, getVaultStateLabel, getVaultStateColor, getVaultStateIcon } from '@/hooks/useVaultInfo'
import { WalletConnect } from '@/components/WalletConnect'
import { ReservationFlow } from '@/components/vault/ReservationFlow'
import { AuctionFlow } from '@/components/vault/AuctionFlow'
import Link from 'next/link'
import { formatUnits } from 'viem'

export default function VaultDetailPage({ params }: { params: Promise<{ vaultId: string }> }) {
  const resolvedParams = use(params)
  const vaultId = decodeURIComponent(resolvedParams.vaultId)
  
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">
                  🏠 Auktrafi
                </h1>
              </Link>
              <WalletConnect />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Loading vault...
            </h2>
          </div>
        </div>
      </main>
    )
  }

  return <VaultDetail vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} />
}

function VaultDetail({ vaultAddress, vaultId }: { vaultAddress: `0x${string}`; vaultId: string }) {
  const { propertyDetails, basePrice, currentState, owner, isLoading } = useVaultInfo(vaultAddress)

  const stateNum = currentState !== undefined ? Number(currentState) : -1
  const isFree = stateNum === VaultState.FREE
  const isAuction = stateNum === VaultState.AUCTION

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">
                🏠 Auktrafi
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/marketplace">
                <button className="px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-gray-700 hover:text-gray-900">
                  ← Back to Marketplace
                </button>
              </Link>
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vault Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                🏠 {vaultId}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {propertyDetails ? String(propertyDetails) : 'No details available'}
              </p>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getVaultStateColor(stateNum)}`}>
                  {getVaultStateIcon(stateNum)} {getVaultStateLabel(stateNum)}
                </span>
                {basePrice && typeof basePrice === 'bigint' ? (
                  <div className="px-4 py-2 bg-gray-100 rounded-full">
                    <span className="text-sm font-semibold text-gray-700">
                      💰 Base Price: {formatUnits(basePrice, 6)} PYUSD
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Vault Address</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {vaultAddress}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Owner</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {owner && typeof owner === 'string' ? `${owner.slice(0, 10)}...${owner.slice(-8)}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Flow Components */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-600">Loading vault state...</p>
            </div>
          ) : isFree ? (
            <ReservationFlow 
              vaultAddress={vaultAddress} 
              basePrice={typeof basePrice === 'bigint' ? basePrice : BigInt(0)}
            />
          ) : isAuction ? (
            <AuctionFlow vaultAddress={vaultAddress} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔴</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Property Occupied
              </h3>
              <p className="text-gray-600">
                This property is currently occupied. Check back after checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

