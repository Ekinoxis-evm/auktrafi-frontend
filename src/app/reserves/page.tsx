'use client'

import { useAccount, useReadContract } from 'wagmi'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { WalletConnect } from '@/components/WalletConnect'
import { VaultCard } from '@/components/vault/VaultCard'
import { Layout } from '@/components/Layout'
import DigitalHouseVaultABI from '@/contracts/DigitalHouseVault.json'
import Link from 'next/link'
import { useMemo } from 'react'

export default function ReservesPage() {
  const { address, isConnected } = useAccount()
  const { allVaultIds } = useDigitalHouseFactory()

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
    </Layout>
  )
}

// Component to check if user has reservation or bids in this vault
function ReserveVaultCard({ vaultId, userAddress }: { vaultId: string; userAddress: `0x${string}` }) {
  const { useVaultAddress } = useDigitalHouseFactory()
  const { data: vaultAddress } = useVaultAddress(vaultId)

  if (!vaultAddress) return null

  return <ParticipationCheckCard vaultAddress={vaultAddress as `0x${string}`} vaultId={vaultId} userAddress={userAddress} />
}

function ParticipationCheckCard({ 
  vaultAddress, 
  vaultId, 
  userAddress 
}: { 
  vaultAddress: `0x${string}`
  vaultId: string
  userAddress: `0x${string}`
}) {
  const { isParticipating } = useUserVaultParticipation(vaultAddress, userAddress)
  
  // Only show if user is participating (has reservation or bids)
  if (!isParticipating) {
    return null
  }

  return <VaultCard vaultAddress={vaultAddress} vaultId={vaultId} />
}

function useUserVaultParticipation(vaultAddress: `0x${string}`, userAddress?: `0x${string}`) {
  const { currentReservation, auctionBids } = useVaultData(vaultAddress)

  if (!userAddress) return { isParticipating: false }

  // Parse currentReservation with robust checks
  let bookerAddress: string | undefined
  let isActive = false

  if (currentReservation) {
    if (Array.isArray(currentReservation)) {
      bookerAddress = currentReservation[0] as string
      isActive = currentReservation[6] as boolean
    } else if (typeof currentReservation === 'object') {
      const res = currentReservation as Record<string | number, unknown>
      bookerAddress = (res.booker || res[0]) as string
      isActive = (res.isActive ?? res[6] ?? false) as boolean
    }
  }

  // Check if user is the booker
  const hasReservation = bookerAddress && 
    typeof bookerAddress === 'string' &&
    bookerAddress.toLowerCase() === userAddress.toLowerCase() &&
    isActive === true

  // Check if user has active bids - also handle both array and object formats
  let hasBids = false
  if (auctionBids && Array.isArray(auctionBids)) {
    hasBids = auctionBids.some((bid: unknown) => {
      if (Array.isArray(bid)) {
        const bidderAddress = bid[0] as string
        const bidIsActive = bid[3] as boolean
        return typeof bidderAddress === 'string' &&
          bidderAddress.toLowerCase() === userAddress.toLowerCase() &&
          bidIsActive === true
      } else if (typeof bid === 'object' && bid !== null) {
        const bidObj = bid as Record<string | number, unknown>
        const bidderAddress = (bidObj.bidder || bidObj[0]) as string
        const bidIsActive = (bidObj.isActive ?? bidObj[3] ?? false) as boolean
        return typeof bidderAddress === 'string' &&
          bidderAddress.toLowerCase() === userAddress.toLowerCase() &&
          bidIsActive === true
      }
      return false
    })
  }

  const isParticipating = Boolean(hasReservation || hasBids)

  // Debug log
  console.log('useUserVaultParticipation:', {
    vaultAddress,
    userAddress,
    bookerAddress,
    isActive,
    hasReservation,
    hasBids,
    isParticipating
  })

  return { isParticipating }
}

function useVaultData(vaultAddress: `0x${string}`) {
  const { data: currentReservation } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getCurrentReservation',
  })

  const { data: auctionBids } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI.abi,
    functionName: 'getAuctionBids',
  })

  return { currentReservation, auctionBids }
}

