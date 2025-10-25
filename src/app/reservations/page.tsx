'use client'

import { useAccount } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useUserVaultParticipation } from '@/hooks/useUserVaultParticipation'
import { WalletConnect } from '@/components/WalletConnect'
import { ReservationCard } from '@/components/vault/ReservationCard'
import { Layout } from '@/components/Layout'
import Link from 'next/link'
import { useMemo } from 'react'

export default function ReservationsPage() {
  const { address, isConnected } = useAccount()
  const { allVaultIds, useVaultAddress } = useDigitalHouseFactory()

  // Parse all vault IDs
  const parsedVaultIds = useMemo(() => {
    if (!allVaultIds || !address) return []
    
    let vaultIds: unknown[] = []
    if (Array.isArray(allVaultIds)) {
      vaultIds = allVaultIds
    } else if (typeof allVaultIds === 'object') {
      vaultIds = Object.values(allVaultIds)
    }
    
    return vaultIds.filter((vaultId: unknown) => {
      return typeof vaultId === 'string' && vaultId.length > 0
    }) as string[]
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
                Please connect your wallet to view your reservations
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
            📋 My Reservations
          </h2>
          <p className="text-lg text-gray-600">
            All your active reservations and bids
          </p>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Your Reservations & Active Bids
          </h3>

          {parsedVaultIds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏖️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                No reservations yet
              </h4>
              <p className="text-gray-600 mb-6">
                Browse the marketplace to create your first reservation
              </p>
              <Link href="/marketplace">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105">
                  🏆 Browse Marketplace
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedVaultIds.map((vaultId: string) => (
                <UserReservationVault key={vaultId} vaultId={vaultId} userAddress={address as `0x${string}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

// Component to check if user is participating and render ReservationCard
function UserReservationVault({ vaultId, userAddress }: { vaultId: string; userAddress: `0x${string}` }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress, isLoading: isLoadingAddress } = useVaultAddress(vaultId)
  const { isParticipating, isLoading: isCheckingParticipation } = useUserVaultParticipation(
    vaultAddress as `0x${string}`,
    userAddress
  )

  // Don't render if still loading
  if (isLoadingAddress || isCheckingParticipation) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  // Only show if user is participating (has reservation or active bids)
  if (!vaultAddress || !isParticipating) {
    return null
  }

  return <ReservationCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} />
}

