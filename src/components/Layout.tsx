'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from './WalletConnect'
import { NetworkSwitcher } from './NetworkSwitcher'

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/ownerships', label: '🏗️ My Properties', emoji: '🏗️' },
    { href: '/reserves', label: '📋 Reservations', emoji: '📋' },
    { href: '/marketplace', label: '🏆 Marketplace', emoji: '🏆' },
    { href: '/profile', label: '👤 Profile', emoji: '👤' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl">🏠</span>
              <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Auktrafi
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="hidden lg:inline">{link.label}</span>
                  <span className="lg:hidden text-xl">{link.emoji}</span>
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              <NetworkSwitcher />
              <WalletConnect />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2
                  ${isActive(link.href)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 bg-white hover:bg-gray-100'
                  }
                `}
              >
                <span>{link.emoji}</span>
                <span className="text-sm">{link.label.replace(/^[^ ]+ /, '')}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 gap-4">
            <p>© 2025 Auktrafi. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="https://github.com/Ekinoxis-evm/auktrafi-frontend" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

