'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { DateBookingFlow } from '../../components/vault/DateBookingFlow'
import { WalletConnect } from '../../components/WalletConnect'
import { Layout } from '../../components/Layout'

export default function TestBookingPage() {
  const { address, isConnected } = useAccount()
  const [testVaultId, setTestVaultId] = useState('VAULT001')
  const [testBasePrice, setTestBasePrice] = useState('100000000') // 100 PYUSD

  if (!isConnected) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              🧪 Booking Flow Test
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to test the complete booking flow
            </p>
            <WalletConnect />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Booking Flow Test
          </h1>
          <p className="text-gray-600">
            Test the complete booking flow with calendar selection, PYUSD approval, and reservation/bidding
          </p>
        </div>

        {/* Test Configuration */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vault ID
              </label>
              <input
                type="text"
                value={testVaultId}
                onChange={(e) => setTestVaultId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vault ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (PYUSD wei)
              </label>
              <input
                type="text"
                value={testBasePrice}
                onChange={(e) => setTestBasePrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter base price"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {(Number(testBasePrice) / 1e6).toLocaleString()} PYUSD
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Connected Wallet</h3>
          <p className="text-blue-700 font-mono text-sm break-all">{address}</p>
        </div>

        {/* Test Instructions */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-900 mb-4">📋 Test Instructions</h2>
          <div className="space-y-3 text-yellow-800">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>Select dates using the calendar (green = available, blue = can bid)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Check availability - system will detect if it&apos;s a new reservation or bid</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>Approve PYUSD spending for the vault contract</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Create reservation or place bid depending on date availability</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              <span>Verify success message and access code (for reservations)</span>
            </div>
          </div>
        </div>

        {/* Booking Flow Component */}
        <div className="bg-white rounded-lg shadow-lg">
          <DateBookingFlow 
            vaultId={testVaultId}
            basePrice={BigInt(testBasePrice)}
          />
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔍 Debug Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Test Parameters</h3>
              <ul className="space-y-1 text-gray-600">
                <li><strong>Vault ID:</strong> {testVaultId}</li>
                <li><strong>Base Price:</strong> {(Number(testBasePrice) / 1e6).toLocaleString()} PYUSD</li>
                <li><strong>Price (wei):</strong> {testBasePrice}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Expected Behavior</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Calendar shows simulated availability</li>
                <li>• Green dates = new reservations</li>
                <li>• Blue dates = bidding opportunities</li>
                <li>• PYUSD approval required before booking</li>
                <li>• Success shows access code for reservations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setTestBasePrice('50000000')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Set 50 PYUSD
          </button>
          <button
            onClick={() => setTestBasePrice('100000000')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Set 100 PYUSD
          </button>
          <button
            onClick={() => setTestBasePrice('200000000')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Set 200 PYUSD
          </button>
        </div>
      </div>
    </Layout>
  )
}
