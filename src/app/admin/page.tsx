'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { VaultList } from '@/components/VaultList'
import { CreateVault } from '@/components/CreateVault'
import { FundWallet } from '@/components/FundWallet'
import { BalanceCard } from '@/components/BalanceCard'
import { NetworkSwitcher } from '@/components/NetworkSwitcher'
import { useAccount } from 'wagmi'
import Link from 'next/link'

export default function AdminPage() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  🏠 Auktrafi Admin
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Business Management Dashboard
                </p>
              </div>
              <nav className="hidden md:flex gap-4">
                <Link 
                  href="/admin"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Admin Panel
                </Link>
                <Link 
                  href="/marketplace"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
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
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet with Passkey to manage your business
              </p>
              <WalletConnect />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Balance and Funding Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceCard />
              <FundWallet />
            </div>
            
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Admin Dashboard</h3>
                  <p className="text-sm text-gray-600">
                    Create and manage your property vaults. All write operations (creating vaults, staking) happen here.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Create Vault (Write Operations) */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <CreateVault />
                </div>
              </div>

              {/* Right Column - Vault List (Your Vaults) */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    📊 Your Vaults
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage your created vaults and monitor their performance
                  </p>
                </div>
                <VaultList />
              </div>
            </div>
          </div>
        )}
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

