'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { MarketplaceList } from '@/components/MarketplaceList'
import { AuctionFilters } from '@/components/AuctionFilters'
import { BalanceCard } from '@/components/BalanceCard'
import { NetworkSwitcher } from '@/components/NetworkSwitcher'
import { useAccount } from 'wagmi'
import Link from 'next/link'

export default function MarketplacePage() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🏆 Auktrafi Marketplace
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Browse and participate in property auctions
                </p>
              </div>
              <nav className="hidden md:flex gap-4">
                <Link 
                  href="/admin"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Admin Panel
                </Link>
                <Link 
                  href="/marketplace"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
                >
                  Marketplace
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <NetworkSwitcher />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Discover Property Auctions
              </h2>
              <p className="text-gray-600">
                Participate in decentralized property auctions. Browse, stake, and win!
              </p>
            </div>
            <div className="text-6xl">🏘️</div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-gray-600 mb-1">Total Auctions</div>
            <div className="text-2xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-gray-600 mb-1">Active Now</div>
            <div className="text-2xl font-bold text-green-600">0</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-gray-600 mb-1">Total Volume</div>
            <div className="text-2xl font-bold text-blue-600">$0</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-sm text-gray-600 mb-1">Your Stakes</div>
            <div className="text-2xl font-bold text-purple-600">0</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Balance & Filters (Read Optimized) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {isConnected && <BalanceCard />}
              <AuctionFilters />
            </div>
          </div>

          {/* Right Column - Auction List (Read Optimized with React Query) */}
          <div className="lg:col-span-3">
            <MarketplaceList />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 Auktrafi. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600">Documentation</a>
              <a href="#" className="hover:text-blue-600">GitHub</a>
              <a href="#" className="hover:text-blue-600">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

