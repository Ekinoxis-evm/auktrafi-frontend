'use client'

import { WalletConnect } from '@/components/WalletConnect'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏠 Auktrafi
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Decentralized Auction, Booking, and Distribution Platform
              </p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to the Future of
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Property Auctions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, manage, and participate in decentralized property auctions on the blockchain.
            Transparent, secure, and accessible to everyone.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Admin Card */}
          <Link href="/admin">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Admin Panel
              </h3>
              <p className="text-gray-600 mb-6">
                Create and manage your property vaults. Handle all write operations including vault creation and staking management.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  Create property vaults
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  Manage your auctions
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  Fund your wallet
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  Monitor performance
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                Go to Admin Panel
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Marketplace Card */}
          <Link href="/marketplace">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Marketplace
              </h3>
              <p className="text-gray-600 mb-6">
                Browse and participate in live property auctions. Optimized for fast reads and seamless browsing experience.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">✓</span>
                  Browse all auctions
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">✓</span>
                  Filter and search
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">✓</span>
                  Place stakes
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-purple-600">✓</span>
                  Track your bids
                </div>
              </div>
              <div className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                Explore Marketplace
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-bold text-gray-900 mb-2">Secure & Transparent</h4>
            <p className="text-sm text-gray-600">
              All transactions on-chain with full transparency and security
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2">Fast & Efficient</h4>
            <p className="text-sm text-gray-600">
              Optimized for performance with instant reads and quick writes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h4 className="font-bold text-gray-900 mb-2">Globally Accessible</h4>
            <p className="text-sm text-gray-600">
              Participate from anywhere with just a wallet connection
            </p>
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
