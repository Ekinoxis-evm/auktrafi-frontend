'use client'

import { useState, useEffect, useCallback } from 'react'
import { Address, parseUnits, formatUnits } from 'viem'
import { useAccount } from 'wagmi'
import { useReservation } from '@/hooks/useReservation'
import { useAuction } from '@/hooks/useAuction'
import { useVaultActions } from '@/hooks/useVaultActions'
import { usePYUSDApproval } from '@/hooks/usePYUSDApproval'
import { Button } from '@/components/ui/Button'

interface AuctionFlowProps {
  vaultAddress: Address
  onSuccess?: () => void
}

enum BidStep {
  INPUT = 'input',
  APPROVING = 'approving',
  BIDDING = 'bidding',
  SUCCESS = 'success',
}

export function AuctionFlow({ vaultAddress, onSuccess }: AuctionFlowProps) {
  const { address: userAddress } = useAccount()
  const { reservation, booker, stakeAmount, checkInDate, checkOutDate, isLoading: isLoadingReservation, refetch: refetchReservation } = useReservation(vaultAddress)
  const { bids, activeBids, highestBid, refetch: refetchBids } = useAuction(vaultAddress)
  const { placeBid, cedeReservation, checkIn, checkOut, cancelReservation, withdrawBid, isPending, isConfirming, isConfirmed, hash } = useVaultActions(vaultAddress)
  
  const { 
    approve, 
    needsApproval, 
    hasSufficientBalance,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    hash: approveHash
  } = usePYUSDApproval(userAddress, vaultAddress)

  const [bidAmount, setBidAmount] = useState('')
  const [bidStep, setBidStep] = useState<BidStep>(BidStep.INPUT)
  const [bidError, setBidError] = useState<string | null>(null)
  const [currentTime] = useState(() => Date.now())

  const isUserBooker = booker && typeof booker === 'string' && userAddress 
    ? booker.toLowerCase() === userAddress.toLowerCase() 
    : false
  
  // Convert timestamps to milliseconds for JavaScript Date
  const checkInTimestamp = checkInDate && typeof checkInDate === 'bigint' 
    ? Number(checkInDate) * 1000 
    : 0
  const checkOutTimestamp = checkOutDate && typeof checkOutDate === 'bigint'
    ? Number(checkOutDate) * 1000 
    : 0
  const now = currentTime
  
  // Format dates for display
  const formatDate = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return 'N/A'
    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }
  
  // Check if within 24h of check-in
  const canCede = isUserBooker && checkInTimestamp && (checkInTimestamp - now) <= 24 * 60 * 60 * 1000 && (checkInTimestamp - now) > 0
  const canCheckIn = isUserBooker && checkInTimestamp && now >= checkInTimestamp && now < checkOutTimestamp
  const canCheckOut = isUserBooker && checkOutTimestamp && now >= checkOutTimestamp

  const handlePlaceBidAfterApproval = useCallback(async () => {
    try {
      const bidInWei = parseUnits(bidAmount, 6)
      setBidStep(BidStep.BIDDING)
      await placeBid(bidInWei)
    } catch (err) {
      console.error('Error placing bid:', err)
      setBidError(err instanceof Error ? err.message : 'Failed to place bid')
      setBidStep(BidStep.INPUT)
    }
  }, [bidAmount, placeBid])

  // Auto-progress from approving to bidding
  useEffect(() => {
    if (bidStep === BidStep.APPROVING && isApproveConfirmed) {
      setTimeout(() => {
        handlePlaceBidAfterApproval()
      }, 0)
    }
  }, [isApproveConfirmed, bidStep, handlePlaceBidAfterApproval])

  // Auto-progress to success
  useEffect(() => {
    if (bidStep === BidStep.BIDDING && isConfirmed) {
      setTimeout(() => {
        setBidStep(BidStep.SUCCESS)
        setBidAmount('')
        setTimeout(() => {
          refetchBids()
          setBidStep(BidStep.INPUT)
          if (onSuccess) onSuccess()
        }, 2000)
      }, 0)
    }
  }, [isConfirmed, bidStep, onSuccess, refetchBids])

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    setBidError(null)
    
    try {
      if (!userAddress) {
        setBidError('Please connect your wallet')
        return
      }

      // Validate bid amount
      if (!bidAmount || bidAmount.trim() === '') {
        setBidError('Please enter a bid amount')
        return
      }

      const bidInWei = parseUnits(bidAmount, 6)
      
      // Debug log
      console.log('=== PLACE BID DEBUG ===')
      console.log('User Address:', userAddress)
      console.log('Vault Address:', vaultAddress)
      console.log('Bid Amount (input):', bidAmount)
      console.log('Bid Amount (wei):', bidInWei.toString())
      console.log('Stake Amount:', stakeAmount?.toString())
      
      // Validate bid is higher than current stake
      if (stakeAmount && typeof stakeAmount === 'bigint' && bidInWei <= stakeAmount) {
        setBidError(`Bid must be higher than current stake (${formatUnits(stakeAmount, 6)} PYUSD)`)
        return
      }
      
      // Check balance
      if (!hasSufficientBalance(bidInWei)) {
        setBidError('Insufficient PYUSD balance')
        return
      }

      // Check if approval is needed
      console.log('Checking if approval is needed...')
      const needsApprove = needsApproval(bidInWei)
      console.log('Needs approval:', needsApprove)
      
      if (needsApprove) {
        // Start approval flow
        console.log('Starting approval flow...')
        setBidStep(BidStep.APPROVING)
        await approve(bidInWei)
        console.log('Approval completed')
      } else {
        // Directly place bid
        console.log('Placing bid directly...')
        setBidStep(BidStep.BIDDING)
        await placeBid(bidInWei)
        console.log('Bid placed successfully')
      }
    } catch (err) {
      console.error('Error in bid flow:', err)
      
      // More detailed error handling
      let errorMessage = 'Transaction failed. Please try again.'
      
      if (err instanceof Error) {
        errorMessage = err.message
        
        // Check for specific error types
        if (errorMessage.includes('User rejected') || errorMessage.includes('user rejected')) {
          errorMessage = 'Transaction was rejected by user'
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds for gas or tokens'
        } else if (errorMessage.includes('Invalid parameters')) {
          errorMessage = 'Invalid parameters. Make sure bid amount is correct and higher than current stake.'
        }
      }
      
      setBidError(errorMessage)
      setBidStep(BidStep.INPUT)
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

  // Debug: Log reservation data
  console.log('AuctionFlow - Reservation Data:', {
    reservation,
    booker,
    stakeAmount: stakeAmount?.toString(),
    checkInDate: checkInDate?.toString(),
    checkOutDate: checkOutDate?.toString(),
    isLoadingReservation
  })

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

        {isLoadingReservation ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-600">Loading reservation details...</p>
          </div>
        ) : !booker || !stakeAmount ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-gray-600">No active reservation data found</p>
            <p className="text-xs text-gray-500 mt-2">The vault may not have a reservation yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">👤 Booker (First Reserver)</p>
                <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                  {booker && typeof booker === 'string' ? `${booker.slice(0, 10)}...${booker.slice(-8)}` : 'N/A'}
                </p>
                {isUserBooker && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                    ✓ You are the booker
                  </span>
                )}
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">💰 Total PYUSD Staked</p>
                <p className="text-lg font-bold text-gray-900">
                  {stakeAmount && typeof stakeAmount === 'bigint' ? formatUnits(stakeAmount, 6) : '0'} PYUSD
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Initial reservation stake
                </p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">📅 Check-in Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(checkInTimestamp)}
                </p>
                {checkInTimestamp > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {checkInTimestamp > now ? `In ${Math.ceil((checkInTimestamp - now) / (1000 * 60 * 60 * 24))} days` : 'Available now'}
                  </p>
                )}
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">📅 Check-out Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(checkOutTimestamp)}
                </p>
                {checkOutTimestamp > 0 && checkInTimestamp > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Duration: {Math.ceil((checkOutTimestamp - checkInTimestamp) / (1000 * 60 * 60 * 24))} days
                  </p>
                )}
              </div>
            </div>

            {/* Booker Actions - Only show if user is the booker */}
            {isUserBooker && (
              <div className="flex flex-wrap gap-2 mt-4">
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
          </>
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
                placeholder={stakeAmount && typeof stakeAmount === 'bigint' ? `Higher than ${formatUnits(stakeAmount, 6)}` : 'Enter amount'}
                step="0.01"
                min={stakeAmount && typeof stakeAmount === 'bigint' ? Number(formatUnits(stakeAmount, 6)) + 0.01 : 0}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                disabled={bidStep !== BidStep.INPUT}
              />
              {highestBid && highestBid?.amount && (
                <p className="text-xs text-gray-500 mt-1">
                  Highest bid: {formatUnits(highestBid?.amount, 6)} PYUSD
                </p>
              )}
            </div>

            {bidError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">❌ {bidError}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={bidStep !== BidStep.INPUT}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bidStep === BidStep.INPUT && '🚀 Place Bid'}
              {bidStep === BidStep.APPROVING && (isApprovePending || isApproveConfirming) && '⏳ Approving PYUSD...'}
              {bidStep === BidStep.BIDDING && (isPending || isConfirming) && '⏳ Placing Bid...'}
              {bidStep === BidStep.SUCCESS && '✅ Bid Placed!'}
            </Button>

            {/* Approval Transaction */}
            {approveHash && bidStep === BidStep.APPROVING && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-300 animate-slide-up">
                <p className="text-sm font-semibold text-blue-900 mb-1">Step 1/2: Approving PYUSD</p>
                <p className="text-xs font-mono text-blue-700 break-all">{approveHash}</p>
                {isApproveConfirmed && (
                  <p className="text-sm text-blue-600 mt-2 font-semibold">✅ PYUSD approved! Placing bid...</p>
                )}
              </div>
            )}

            {/* Bid Transaction */}
            {hash && (bidStep === BidStep.BIDDING || bidStep === BidStep.SUCCESS) && (
              <div className="mt-4 p-4 bg-green-100 rounded-xl border border-green-300 animate-slide-up">
                <p className="text-sm font-semibold text-green-900 mb-1">
                  {approveHash ? 'Step 2/2: Placing Bid' : 'Transaction Submitted'}
                </p>
                <p className="text-xs font-mono text-green-700 break-all">{hash}</p>
                {bidStep === BidStep.SUCCESS && (
                  <p className="text-sm text-green-600 mt-2 font-semibold">✅ Bid placed successfully!</p>
                )}
              </div>
            )}

            {/* Progress Indicator */}
            {bidStep !== BidStep.INPUT && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${bidStep === BidStep.APPROVING ? 'bg-blue-500 animate-pulse' : 'bg-blue-300'}`} />
                <div className={`w-3 h-3 rounded-full ${bidStep === BidStep.BIDDING ? 'bg-purple-500 animate-pulse' : bidStep === BidStep.SUCCESS ? 'bg-purple-500' : 'bg-gray-300'}`} />
              </div>
            )}
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

