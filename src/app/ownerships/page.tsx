'use client'

import { useAccount } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useVaultInfo } from '@/hooks/useVaultInfo'
import { CreateVault } from '@/components/CreateVault'
import { VaultCard } from '@/components/vault/VaultCard'
import { Layout } from '@/components/Layout'
import { WalletConnect } from '@/components/WalletConnect'
import { useMemo } from 'react'

export default function OwnershipsPage() {
  const { address, isConnected } = useAccount()
  const { allVaultIds } = useDigitalHouseFactory()

  // Get all vaults - we'll filter by owner in the component
  const allVaults = useMemo(() => {
    if (!allVaultIds || !Array.isArray(allVaultIds) || !address) return []
    
    return allVaultIds.filter((vaultId: string | unknown) => {
      try {
        return typeof vaultId === 'string' && vaultId.length > 0
      } catch {
        return false
      }
    })
  }, [allVaultIds, address])

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

              {allVaults.length === 0 ? (
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
                    <OwnershipVaultCard key={vaultId} vaultId={vaultId} userAddress={address as `0x${string}`} />
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

// Component to display each vault with owner check
function OwnershipVaultCard({ vaultId, userAddress }: { vaultId: string; userAddress: `0x${string}` }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) return null

  return <OwnerCheckCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} userAddress={userAddress} />
}

function OwnerCheckCard({ 
  vaultAddress, 
  vaultId, 
  userAddress 
}: { 
  vaultAddress: `0x${string}`
  vaultId: string
  userAddress: `0x${string}`
}) {
  const { owner } = useVaultInfo(vaultAddress)
  
  // Only show if user is the owner
  if (!owner || typeof owner !== 'string' || owner.toLowerCase() !== userAddress?.toLowerCase()) {
    return null
  }

  return <VaultCard vaultAddress={vaultAddress} vaultId={vaultId} showManageButton />
}

