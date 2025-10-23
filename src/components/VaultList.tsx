'use client'

import React, { useState, useMemo } from 'react'
import { useDigitalHouseFactory } from '@/hooks/useDigitalHouseFactory'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function VaultList() {
  const { allVaultIds, refetchVaultIds } = useDigitalHouseFactory()
  const [selectedVault, setSelectedVault] = useState<string | null>(null)

  // Safe handling of vault IDs
  const safeVaultIds = useMemo(() => {
    try {
      if (!allVaultIds) return []
      if (!Array.isArray(allVaultIds)) {
        console.warn('allVaultIds is not an array:', allVaultIds)
        return []
      }
      return allVaultIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    } catch (error) {
      console.error('Error processing vault IDs:', error)
      return []
    }
  }, [allVaultIds])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 All Vaults</h2>
        <Button onClick={() => refetchVaultIds()} size="sm" variant="outline">
          🔄 Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {safeVaultIds.length > 0 ? (
          safeVaultIds.map((vaultId) => (
            <VaultCard 
              key={vaultId} 
              vaultId={vaultId}
              isSelected={selectedVault === vaultId}
              onSelect={() => setSelectedVault(vaultId)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No vaults found</p>
            <p className="text-sm text-gray-400 mt-2">Create your first vault to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VaultCard({ 
  vaultId, 
  isSelected, 
  onSelect 
}: { 
  vaultId: string
  isSelected: boolean
  onSelect: () => void
}) {
  const { useVaultInfo } = useDigitalHouseFactory()
  const { data: vaultInfo, isLoading, error } = useVaultInfo(vaultId)

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-sm text-red-600">⚠️ Error loading vault: {vaultId}</p>
      </div>
    )
  }

  if (!vaultInfo) return null

  // Safe destructuring with fallbacks
  const [vaultAddress, id, propertyDetails, basePrice, createdAt, isActive] = vaultInfo as [string, string, string, bigint, bigint, boolean]

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">🏠 {id}</h3>
          <p className="text-sm text-gray-600 mt-1">{propertyDetails}</p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-gray-700">
              💰 Base Price: <span className="font-mono">{basePrice?.toString()} PYUSD</span>
            </p>
            <p className="text-gray-500 font-mono text-xs">
              📍 {vaultAddress?.slice(0, 6)}...{vaultAddress?.slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              Created: {new Date(Number(createdAt) * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? '✅ Active' : '⏸️ Inactive'}
          </span>
          <Link href={`/admin/vault/${encodeURIComponent(id)}`}>
            <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              📊 Manage Bids
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

