'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { VaultManagement } from '@/components/VaultManagement'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAccount } from 'wagmi'

export default function VaultManagementPage() {
  const params = useParams()
  const vaultId = params.vaultId as string
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl">←</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    🏠 Auktrafi Admin
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Vault Management
                  </p>
                </div>
              </Link>
            </div>
            <WalletConnect />
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
                Access Required
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to manage this vault
              </p>
              <WalletConnect />
            </div>
          </div>
        ) : (
          <VaultManagement vaultId={decodeURIComponent(vaultId)} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 Auktrafi. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/admin" className="hover:text-blue-600">Back to Admin</Link>
              <Link href="/marketplace" className="hover:text-blue-600">Marketplace</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

