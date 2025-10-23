'use client'

import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'

export function MarketplaceList() {
  const { allVaultIds, refetchVaultIds } = useDigitalHouseFactory()

  // Note: In a real implementation, you would fetch vault details for each ID
  // For now, we'll use the vault IDs directly
  const vaults = allVaultIds as string[] | undefined
  const isLoading = !vaults
  const error = null

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading auctions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Error loading auctions</h3>
            <p className="text-sm text-red-700">{(error as Error).message}</p>
            <button 
              onClick={() => refetchVaultIds()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!vaults || vaults.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🏚️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Auctions Available
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to create an auction in the Admin Panel!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Available Auctions
          </h2>
          <p className="text-sm text-gray-600">
            {vaults.length} auction{vaults.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button 
          onClick={() => refetchVaultIds()}
          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-700">
          🚧 <strong>Coming Soon:</strong> Full vault details will be displayed here. Currently showing vault IDs only.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vaults.map((vaultId, index) => (
          <div key={`${vaultId}-${index}`} className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{vaultId}</h3>
                <p className="text-sm text-gray-600 mt-1">Vault ID: {vaultId}</p>
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                Details Loading...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

