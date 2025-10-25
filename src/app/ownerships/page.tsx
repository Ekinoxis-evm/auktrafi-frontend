'use client'

import { useAccount } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { CreateVault } from '@/components/CreateVault'
import { OwnerVaultCard } from '@/components/vault/OwnerVaultCard'
import { Layout } from '@/components/Layout'
import { WalletConnect } from '@/components/WalletConnect'
import { useMemo } from 'react'

export default function OwnershipsPage() {
  const { address, isConnected } = useAccount()
  const { useOwnerVaults } = useDigitalHouseFactory()
  
  // Get vaults owned by the connected user directly from contract
  const { data: ownerVaultIds, isLoading: isLoadingVaults } = useOwnerVaults(address || '')

  // Parse and filter valid vault IDs
  const allVaults = useMemo(() => {
    if (!ownerVaultIds || !address) return []
    
    // Handle both array and object formats
    let vaultIds: unknown[] = []
    if (Array.isArray(ownerVaultIds)) {
      vaultIds = ownerVaultIds
    } else if (typeof ownerVaultIds === 'object') {
      vaultIds = Object.values(ownerVaultIds)
    }
    
    return vaultIds.filter((vaultId: unknown) => {
      return typeof vaultId === 'string' && vaultId.length > 0
    }) as string[]
  }, [ownerVaultIds, address])

  if (!isConnected) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to view and manage your ownerships
              </p>
              <WalletConnect />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            🏗️ My Properties
          </h2>
          <p className="text-lg text-gray-600">
            Create and manage your property vaults
          </p>
          
          {/* Wallet Address Display - Quick Copy */}
          {address && (
            <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-blue-700 font-semibold mb-1">
                    💼 Your Wallet Address
                  </p>
                  <p className="font-mono text-sm text-blue-900 font-bold">
                    {address}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address)
                    alert('✅ Address copied to clipboard!')
                  }}
                  className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Vault Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CreateVault />
            </div>
          </div>

          {/* My Ownerships List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Your Properties
              </h3>

              {isLoadingVaults ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-pulse">⏳</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Loading your properties...
                  </h4>
                </div>
              ) : allVaults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏘️</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    No properties yet
                  </h4>
                  <p className="text-gray-600">
                    Create your first vault to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {allVaults.map((vaultId: string) => (
                    <OwnershipVaultCard key={vaultId} vaultId={vaultId} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// Component to display each vault - gets vault address then shows card
function OwnershipVaultCard({ vaultId }: { vaultId: string }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress, isLoading } = useVaultAddress(vaultId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!vaultAddress) return null

  return <OwnerVaultCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} />
}

