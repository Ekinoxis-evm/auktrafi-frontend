'use client'

import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useVaultInfo, VaultState } from '@/hooks/useVaultInfo'
import { WalletConnect } from '@/components/WalletConnect'
import { VaultCard } from '@/components/vault/VaultCard'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function MarketplacePage() {
  const { allVaultIds, refetchVaultIds } = useDigitalHouseFactory()
  const [filterStatus, setFilterStatus] = useState<'all' | VaultState>('all')

  const vaultList = useMemo(() => {
    if (!allVaultIds || !Array.isArray(allVaultIds)) return []
    
    return allVaultIds.filter((vaultId: string) => {
      try {
        return typeof vaultId === 'string' && vaultId.length > 0
      } catch {
        return false
      }
    })
  }, [allVaultIds])

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                🏆 Marketplace
              </h2>
              <p className="text-lg text-gray-600">
                Browse and participate in property auctions
              </p>
            </div>
            <button
              onClick={() => refetchVaultIds()}
              className="px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
            >
              <span>🔄</span>
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setFilterStatus(VaultState.FREE)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filterStatus === VaultState.FREE
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟢 Available
            </button>
            <button
              onClick={() => setFilterStatus(VaultState.AUCTION)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filterStatus === VaultState.AUCTION
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟡 Active Auction
            </button>
            <button
              onClick={() => setFilterStatus(VaultState.SETTLED)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                filterStatus === VaultState.SETTLED
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🔴 Occupied
            </button>
          </div>
        </div>

        {/* Vault Grid */}
        {vaultList.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🏘️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No properties available yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a property vault!
            </p>
            <Link href="/ownerships">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105">
                🏗️ Create Ownership
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vaultList.map((vaultId: string) => (
              <MarketplaceVaultCard 
                key={vaultId} 
                vaultId={vaultId} 
                filterStatus={filterStatus}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// Wrapper component to handle filtering
function MarketplaceVaultCard({ vaultId, filterStatus }: { vaultId: string; filterStatus: 'all' | VaultState }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) return null

  return <FilteredVaultCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} filterStatus={filterStatus} />
}

function FilteredVaultCard({ vaultAddress, vaultId, filterStatus }: { vaultAddress: `0x${string}`; vaultId: string; filterStatus: 'all' | VaultState }) {
  const { currentState } = useVaultInfo(vaultAddress)
  
  // Apply filter
  if (filterStatus !== 'all' && Number(currentState) !== filterStatus) {
    return null
  }

  return <VaultCard vaultAddress={vaultAddress} vaultId={vaultId} />
}
