'use client'

import Link from 'next/link'
import { WalletConnect } from './WalletConnect'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
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
                🏗️ My Properties
              </Link>
              <Link href="/reserves" className="text-gray-700 hover:text-emerald-600 font-semibold transition-colors">
                📋 My Reservations
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-purple-600 font-semibold transition-colors">
                🏆 Marketplace
              </Link>
            </nav>
            
            <WalletConnect />
          </div>
          
          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex items-center justify-center gap-4">
            <Link href="/ownerships" className="text-sm text-gray-700 hover:text-blue-600 font-semibold transition-colors">
              🏗️ Properties
            </Link>
            <Link href="/reserves" className="text-sm text-gray-700 hover:text-emerald-600 font-semibold transition-colors">
              📋 Reserves
            </Link>
            <Link href="/marketplace" className="text-sm text-gray-700 hover:text-purple-600 font-semibold transition-colors">
              🏆 Marketplace
            </Link>
          </nav>
        </div>
      </header>
      
      {children}
    </main>
  )
}