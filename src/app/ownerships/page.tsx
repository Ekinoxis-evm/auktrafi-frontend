'use client'

import { useAccount } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useVaultInfo } from '@/hooks/useVaultInfo'
import { WalletConnect } from '@/components/WalletConnect'
import { CreateVault } from '@/components/CreateVault'
import { VaultCard } from '@/components/vault/VaultCard'
import Link from 'next/link'
import { useMemo } from 'react'

export default function OwnershipsPage() {
  const { address, isConnected } = useAccount()
  const { allVaultIds, useVaultAddress, useVaultInfo } = useDigitalHouseFactory()

  // Get all vaults created by the connected user
  const myOwnerships = useMemo(() => {
    if (!allVaultIds || !Array.isArray(allVaultIds) || !address) return []
    
    return allVaultIds.filter((vaultId: string) => {
      try {
        return typeof vaultId === 'string' && vaultId.length > 0
      } catch {
        return false
      }
    })
  }, [allVaultIds, address])

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            🏗️ My Ownerships
          </h2>
          <p className="text-lg text-gray-600">
            Create and manage your property vaults
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Vault Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CreateVault />
            </div>
          </div>

          {/* My Ownerships List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                📋 Your Properties ({myOwnerships.length})
              </h3>

              {myOwnerships.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏘️</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    No ownerships yet
                  </h4>
                  <p className="text-gray-600">
                    Create your first vault to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {myOwnerships.map((vaultId: string) => (
                    <OwnershipVaultCard key={vaultId} vaultId={vaultId} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// Component to display each vault with owner check
function OwnershipVaultCard({ vaultId }: { vaultId: string }) {
  const { address } = useAccount()
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) return null

  return <OwnerCheckCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} userAddress={address as `0x${string}`} />
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

