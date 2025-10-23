'use client'

import { useAccount } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { useReservation } from '@/hooks/useReservation'
import { WalletConnect } from '@/components/WalletConnect'
import { VaultCard } from '@/components/vault/VaultCard'
import Link from 'next/link'
import { useMemo } from 'react'

export default function ReservesPage() {
  const { address, isConnected } = useAccount()
  const { allVaultIds, useVaultAddress } = useDigitalHouseFactory()

  // Get all vaults where user has a reservation
  const myReserves = useMemo(() => {
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
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
                Please connect your wallet to view your reservations
              </p>
              <WalletConnect />
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
            📋 My Reserves
          </h2>
          <p className="text-lg text-gray-600">
            All your active reservations and bids
          </p>
        </div>

        {/* Reserves List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            🎯 Active Reservations
          </h3>

          {myReserves.length === 0 ? (
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
              {myReserves.map((vaultId: string) => (
                <ReserveVaultCard key={vaultId} vaultId={vaultId} userAddress={address as `0x${string}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Component to check if user has reservation in this vault
function ReserveVaultCard({ vaultId, userAddress }: { vaultId: string; userAddress: `0x${string}` }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) return null

  return <ReservationCheckCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} userAddress={userAddress} />
}

function ReservationCheckCard({ 
  vaultAddress, 
  vaultId, 
  userAddress 
}: { 
  vaultAddress: `0x${string}`
  vaultId: string
  userAddress: `0x${string}`
}) {
  const { booker, hasActiveReservation } = useReservation(vaultAddress)
  
  // Only show if user is the booker
  if (!hasActiveReservation || booker?.toLowerCase() !== userAddress?.toLowerCase()) {
    return null
  }

  return <VaultCard vaultAddress={vaultAddress} vaultId={vaultId} />
}

