'use client'

import Link from 'next/link'
import { WalletConnect } from './WalletConnect'
import { AuthGuard } from './AuthGuard'
import { useAccount } from 'wagmi'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { address } = useAccount()
  
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                🏠 Auktrafi
              </h1>
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/ownerships" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
                🏗️ Ownerships
              </Link>
              <Link href="/reservations" className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors">
                📋 Reservations
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                🏆 Marketplace
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
                👤 Profile
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              {address && (
                <div className="hidden md:block px-4 py-2 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold">Connected</p>
                  <p className="text-sm font-mono font-bold text-gray-900">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </p>
                </div>
              )}
              <WalletConnect />
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex items-center justify-around gap-2">
            <Link href="/ownerships" className="text-xs text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              🏗️ Own
            </Link>
            <Link href="/reservations" className="text-xs text-gray-700 hover:text-emerald-600 font-semibold transition-colors">
              📋 Book
            </Link>
            <Link href="/marketplace" className="text-xs text-gray-700 hover:text-purple-600 font-semibold transition-colors">
              🏆 Market
            </Link>
            <Link href="/profile" className="text-xs text-gray-700 hover:text-indigo-600 font-semibold transition-colors">
              👤 Profile
            </Link>
          </nav>
        </div>
      </header>
      
        {children}
      </main>
    </AuthGuard>
  )
}