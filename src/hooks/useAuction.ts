'use client'

import { useReadContract } from 'wagmi'
import DigitalHouseVaultABI from '@/contracts/abis/DigitalHouseVault.json'
import { Address } from 'viem'

export interface AuctionBid {
  bidder: Address
  amount: bigint
  timestamp: bigint
  isActive: boolean
}

export function useAuction(vaultAddress: Address) {
  const { data: auctionBids, isLoading, refetch } = useReadContract({
    address: vaultAddress,
    abi: DigitalHouseVaultABI,
    functionName: 'getAuctionBids',
  })

  const bids = (auctionBids as any[] || []).map((bid: any) => ({
    bidder: bid[0] as Address,
    amount: bid[1] as bigint,
    timestamp: bid[2] as bigint,
    isActive: bid[3] as boolean,
  }))

  const activeBids = bids.filter(bid => bid.isActive)
  const highestBid = activeBids.length > 0 
    ? activeBids.reduce((max, bid) => bid.amount > max.amount ? bid : max, activeBids[0])
    : null

  return {
    bids,
    activeBids,
    highestBid,
    isLoading,
    refetch,
  }
}

