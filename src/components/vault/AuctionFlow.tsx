'use client'

import { useState } from 'react'
import { Address, parseUnits, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useReservation } from '@/hooks/useReservation'
import { useAuction } from '@/hooks/useAuction'
import { useVaultActions } from '@/hooks/useVaultActions'
import { Button } from '@/components/ui/Button'

interface AuctionFlowProps {
  vaultAddress: Address
  onSuccess?: () => void
}

export function AuctionFlow({ vaultAddress, onSuccess }: AuctionFlowProps) {
  const { address: userAddress } = useAccount()
  const { reservation, booker, stakeAmount, checkInDate, checkOutDate, refetch: refetchReservation } = useReservation(vaultAddress)
  const { bids, activeBids, highestBid, refetch: refetchBids } = useAuction(vaultAddress)
  const { placeBid, cedeReservation, checkIn, checkOut, cancelReservation, withdrawBid, isPending, isConfirming, isConfirmed, hash } = useVaultActions(vaultAddress)

  const [bidAmount, setBidAmount] = useState('')

  const isUserBooker = booker?.toLowerCase() === userAddress?.toLowerCase()
  const checkInTimestamp = checkInDate ? Number(checkInDate) * 1000 : 0
  const checkOutTimestamp = checkOutDate ? Number(checkOutDate) * 1000 : 0
  const now = Date.now()
  
  // Check if within 24h of check-in
  const canCede = isUserBooker && checkInTimestamp && (checkInTimestamp - now) <= 24 * 60 * 60 * 1000 && (checkInTimestamp - now) > 0
  const canCheckIn = isUserBooker && checkInTimestamp && now >= checkInTimestamp && now < checkOutTimestamp
  const canCheckOut = isUserBooker && checkOutTimestamp && now >= checkOutTimestamp

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bidInWei = parseUnits(bidAmount, 6)
      await placeBid(bidInWei)
      setBidAmount('')
      setTimeout(() => {
        refetchBids()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error placing bid:', error)
    }
  }

  const handleCede = async (bidIndex: number) => {
    try {
      await cedeReservation(BigInt(bidIndex))
      setTimeout(() => {
        refetchReservation()
        refetchBids()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error ceding reservation:', error)
    }
  }

  const handleWithdraw = async (bidIndex: number) => {
    try {
      await withdrawBid(BigInt(bidIndex))
      setTimeout(() => {
        refetchBids()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error withdrawing bid:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      await checkIn()
      setTimeout(() => {
        refetchReservation()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error checking in:', error)
    }
  }

  const handleCheckOut = async () => {
    try {
      await checkOut()
      setTimeout(() => {
        refetchReservation()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error checking out:', error)
    }
  }

  const handleCancel = async () => {
    try {
      await cancelReservation()
      setTimeout(() => {
        refetchReservation()
        if (onSuccess) onSuccess()
      }, 2000)
    } catch (error) {
      console.error('Error canceling reservation:', error)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current Reservation Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Active Auction</h3>
            <p className="text-sm text-gray-600">Current reservation holder</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-xs text-gray-600 mb-1">Booker</p>
            <p className="font-mono text-sm font-semibold text-gray-900">
              {booker ? `${booker.slice(0, 6)}...${booker.slice(-4)}` : 'N/A'}
            </p>
            {isUserBooker && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                You
              </span>
            )}
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-xs text-gray-600 mb-1">Stake Amount</p>
            <p className="text-lg font-bold text-gray-900">
              {stakeAmount ? formatUnits(stakeAmount, 6) : '0'} PYUSD
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-xs text-gray-600 mb-1">Check-in</p>
            <p className="text-sm font-semibold text-gray-900">
              {checkInTimestamp ? new Date(checkInTimestamp).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-xs text-gray-600 mb-1">Check-out</p>
            <p className="text-sm font-semibold text-gray-900">
              {checkOutTimestamp ? new Date(checkOutTimestamp).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Booker Actions */}
        {isUserBooker && (
          <div className="flex flex-wrap gap-2">
            {canCheckIn && (
              <Button onClick={handleCheckIn} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                ✅ Check In
              </Button>
            )}
            {canCheckOut && (
              <Button onClick={handleCheckOut} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
                🚪 Check Out
              </Button>
            )}
            <Button onClick={handleCancel} disabled={isPending} variant="outline" className="text-red-600 border-red-600">
              ❌ Cancel Reservation
            </Button>
          </div>
        )}
      </div>

      {/* Place Bid Form - Only for non-bookers */}
      {!isUserBooker && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Place Your Bid</h3>
              <p className="text-sm text-gray-600">Compete for this reservation</p>
            </div>
          </div>

          <form onSubmit={handlePlaceBid} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Bid Amount (PYUSD)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={stakeAmount ? `Higher than ${formatUnits(stakeAmount, 6)}` : 'Enter amount'}
                step="0.01"
                min={stakeAmount ? Number(formatUnits(stakeAmount, 6)) + 0.01 : 0}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              {highestBid && (
                <p className="text-xs text-gray-500 mt-1">
                  Highest bid: {formatUnits(highestBid.amount, 6)} PYUSD
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isPending || isConfirming}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isPending ? '⏳ Preparing...' : isConfirming ? '⏳ Confirming...' : '🚀 Place Bid'}
            </Button>
          </form>
        </div>
      )}

      {/* Active Bids List */}
      {activeBids.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏅</span>
            Active Bids ({activeBids.length})
          </h3>

          <div className="space-y-3">
            {activeBids.map((bid, index) => {
              const isUserBid = bid.bidder.toLowerCase() === userAddress?.toLowerCase()
              const originalIndex = bids.findIndex(b => b.bidder === bid.bidder && b.amount === bid.amount && b.timestamp === bid.timestamp)

              return (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isUserBid 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-mono text-sm font-semibold text-gray-900">
                          {bid.bidder.slice(0, 6)}...{bid.bidder.slice(-4)}
                        </p>
                        {isUserBid && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">
                        {formatUnits(bid.amount, 6)} PYUSD
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(Number(bid.timestamp) * 1000).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {canCede && isUserBooker && (
                        <Button
                          onClick={() => handleCede(originalIndex)}
                          size="sm"
                          disabled={isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          🤝 Cede
                        </Button>
                      )}
                      {isUserBid && !isUserBooker && (
                        <Button
                          onClick={() => handleWithdraw(originalIndex)}
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className="text-red-600 border-red-600"
                        >
                          💸 Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {hash && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 animate-slide-up">
          <p className="text-sm font-semibold text-blue-900 mb-1">Transaction Hash:</p>
          <p className="text-xs font-mono text-blue-700 break-all">{hash}</p>
          {isConfirmed && (
            <p className="text-sm text-green-600 mt-2 font-semibold">✅ Transaction confirmed!</p>
          )}
        </div>
      )}
    </div>
  )
}

