'use client'

import { useState } from 'react'
import { useDigitalHouseVault, formatVaultState } from '@/hooks/useDigitalHouseVault'
import { Button } from '@/components/ui/Button'
import { Address, parseUnits, formatUnits } from 'viem'
import { useAccount } from 'wagmi'

interface VaultManagerProps {
  vaultAddress: Address
}

export function VaultManager({ vaultAddress }: VaultManagerProps) {
  const { address: userAddress } = useAccount()
  const {
    vaultInfo,
    currentReservation,
    auctionBids,
    currentState,
    basePrice,
    vaultId,
    propertyDetails,
    createReservation,
    placeBid,
    cedeReservation,
    withdrawBid,
    checkIn,
    checkOut,
    cancelReservation,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    refetchReservation,
    refetchBids,
  } = useDigitalHouseVault(vaultAddress)

  const [stakeAmount, setStakeAmount] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [bidAmount, setBidAmount] = useState('')

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const stakeInWei = parseUnits(stakeAmount, 6) // PYUSD has 6 decimals
      const checkInTimestamp = BigInt(new Date(checkInDate).getTime() / 1000)
      const checkOutTimestamp = BigInt(new Date(checkOutDate).getTime() / 1000)
      
      await createReservation(stakeInWei, checkInTimestamp, checkOutTimestamp)
      await refetchReservation()
    } catch (error) {
      console.error('Error creating reservation:', error)
    }
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bidInWei = parseUnits(bidAmount, 6)
      await placeBid(bidInWei)
      await refetchBids()
    } catch (error) {
      console.error('Error placing bid:', error)
    }
  }

  const handleCedeReservation = async (bidIndex: number) => {
    try {
      await cedeReservation(BigInt(bidIndex))
      await refetchReservation()
      await refetchBids()
    } catch (error) {
      console.error('Error ceding reservation:', error)
    }
  }

  const handleWithdrawBid = async (bidIndex: number) => {
    try {
      await withdrawBid(BigInt(bidIndex))
      await refetchBids()
    } catch (error) {
      console.error('Error withdrawing bid:', error)
    }
  }

  const isUserCurrentBooker = currentReservation && 
    currentReservation[0]?.toLowerCase() === userAddress?.toLowerCase()

  return (
    <div className="space-y-6">
      {/* Vault Info Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🏠 {vaultId || 'Loading...'}
            </h2>
            <p className="text-gray-600 mt-2">{propertyDetails}</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium">
                Status: {currentState !== undefined ? formatVaultState(Number(currentState)) : 'Loading...'}
              </span>
              {basePrice && (
                <span className="text-sm">
                  💰 Base Price: {formatUnits(basePrice, 6)} PYUSD
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Vault Address:</p>
            <p className="font-mono text-xs text-gray-700">
              {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Current Reservation */}
      {currentReservation && currentReservation[6] && (
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📋 Current Reservation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Booker</p>
              <p className="font-mono text-sm">{currentReservation[0]?.slice(0, 10)}...</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stake Amount</p>
              <p className="font-semibold">{formatUnits(currentReservation[1], 6)} PYUSD</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-in Date</p>
              <p className="text-sm">{new Date(Number(currentReservation[3]) * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out Date</p>
              <p className="text-sm">{new Date(Number(currentReservation[4]) * 1000).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Booker Actions */}
          {isUserCurrentBooker && (
            <div className="mt-4 flex gap-2">
              <Button onClick={() => checkIn()} size="sm" disabled={isPending}>
                ✅ Check In
              </Button>
              <Button onClick={() => checkOut()} size="sm" variant="outline" disabled={isPending}>
                🚪 Check Out
              </Button>
              <Button onClick={() => cancelReservation()} size="sm" variant="outline" className="text-red-600" disabled={isPending}>
                ❌ Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Reservation Form */}
      {currentState === 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            ✨ Create Reservation
          </h3>
          <form onSubmit={handleCreateReservation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stake Amount (PYUSD)
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Minimum stake amount"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isPending || isConfirming} className="w-full">
              {isPending ? '⏳ Preparing...' : isConfirming ? '⏳ Confirming...' : '🎯 Create Reservation'}
            </Button>
          </form>
        </div>
      )}

      {/* Place Bid Form */}
      {currentState === 1 && !isUserCurrentBooker && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            💎 Place Your Bid
          </h3>
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bid Amount (PYUSD)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <Button type="submit" disabled={isPending || isConfirming} className="w-full">
              {isPending ? '⏳ Preparing...' : isConfirming ? '⏳ Confirming...' : '🚀 Place Bid'}
            </Button>
          </form>
        </div>
      )}

      {/* Auction Bids List */}
      {auctionBids && Array.isArray(auctionBids) && auctionBids.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            🏆 Active Bids ({auctionBids.length})
          </h3>
          <div className="space-y-3">
            {auctionBids.map((bid: any, index: number) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${
                  bid[3] ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-gray-700">
                      {bid[0]?.slice(0, 10)}...
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatUnits(bid[1], 6)} PYUSD
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(bid[2]) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {bid[3] && isUserCurrentBooker && (
                      <Button
                        onClick={() => handleCedeReservation(index)}
                        size="sm"
                        disabled={isPending}
                      >
                        🤝 Cede to this Bid
                      </Button>
                    )}
                    {bid[0]?.toLowerCase() === userAddress?.toLowerCase() && bid[3] && (
                      <Button
                        onClick={() => handleWithdrawBid(index)}
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                      >
                        💸 Withdraw
                      </Button>
                    )}
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      bid[3] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bid[3] ? '✅ Active' : '⏸️ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {hash && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">Transaction Hash:</p>
          <p className="text-xs font-mono text-blue-700 break-all mt-1">{hash}</p>
          {isConfirmed && (
            <p className="text-sm text-green-600 mt-2">✅ Transaction confirmed!</p>
          )}
        </div>
      )}
    </div>
  )
}

