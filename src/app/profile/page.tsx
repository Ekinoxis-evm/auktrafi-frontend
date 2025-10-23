'use client'

import { WalletConnect } from '@/components/WalletConnect'
import { BalanceCard } from '@/components/BalanceCard'
import { FundWallet } from '@/components/FundWallet'
import { Layout } from '@/components/Layout'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useAccount } from 'wagmi'

export default function ProfilePage() {
  const { user, authenticated, exportWallet, logout } = usePrivy()
  const { wallets } = useWallets()
  const { address } = useAccount()

  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')

  const handleExportWallet = async () => {
    if (embeddedWallet) {
      try {
        await exportWallet()
      } catch (error) {
        console.error('Error exporting wallet:', error)
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            👤 Your Profile
          </h2>
          <p className="text-lg text-gray-600">
            Manage your account and wallet settings
          </p>
        </div>
        {!authenticated ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your wallet to view your profile
              </p>
              <WalletConnect />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-lg border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>👤</span> Account Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">User ID</label>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-900 break-all">
                    {user?.id || 'N/A'}
                  </div>
                </div>

                {/* Email */}
                {user?.email && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 flex items-center gap-2">
                      <span>📧</span>
                      <span>{user.email.address}</span>
                      <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                )}

                {/* Google Account */}
                {user?.google && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Google Account</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 flex items-center gap-2">
                      <span>🔵</span>
                      <span>{user.google.email}</span>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {user?.phone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 flex items-center gap-2">
                      <span>📱</span>
                      <span>{user.phone.number}</span>
                    </div>
                  </div>
                )}

                {/* Wallet Address */}
                {address && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Connected Wallet Address</label>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 font-mono text-sm text-gray-900 break-all flex items-center justify-between">
                      <span>{address}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(address)
                          alert('Address copied!')
                        }}
                        className="ml-2 px-3 py-1 bg-white hover:bg-gray-50 border rounded-md text-xs font-medium transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                )}

                {/* Created At */}
                {user?.createdAt && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {/* Wallet Type */}
                {embeddedWallet && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Wallet Type</label>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 flex items-center gap-2">
                      <span>🔐</span>
                      <span>Embedded Wallet (Privy)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                {embeddedWallet && (
                  <button
                    onClick={handleExportWallet}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span>💾</span>
                    Export Wallet
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            </div>

            {/* Balances & Funding */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceCard />
              <FundWallet />
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Your private keys are securely encrypted and stored by Privy</li>
                    <li>• You can export your wallet at any time to use with other applications</li>
                    <li>• Two-factor authentication is available for enhanced security</li>
                    <li>• Your email and personal information are never shared without your consent</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

