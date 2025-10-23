'use client'

import { useAccount, useBalance, useSwitchChain } from 'wagmi'
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains'
import { useQuery } from '@tanstack/react-query'
import { Button } from './ui/Button'
import { useFundWallet } from '@privy-io/react-auth'
import { PYUSD_ADDRESSES } from '@/config/wagmi'
import { formatUnits } from 'viem'

export function BalanceCard() {
  const { address, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const { fundWallet } = useFundWallet()

  // ETH/Native Balance
  const { data: nativeBalance, refetch: refetchNative } = useBalance({
    address: address,
  })

  // PYUSD Balance
  const { data: pyusdBalance, refetch: refetchPyusd } = useBalance({
    address: address,
    token: chain?.id ? PYUSD_ADDRESSES[chain.id as keyof typeof PYUSD_ADDRESSES] : undefined,
  })

  // Get USD prices (mock for now - you can integrate with a price API)
  const { data: prices } = useQuery({
    queryKey: ['token-prices'],
    queryFn: async () => {
      // TODO: Integrate with real price API (CoinGecko, CoinMarketCap, etc.)
      return {
        eth: 3500,
        arb: 0.85,
        pyusd: 1.0,
      }
    },
    refetchInterval: 60000, // Refetch every minute
  })

  const handleFund = () => {
    if (address) {
      fundWallet({ address })
    }
  }

  const handleRefresh = () => {
    refetchNative()
    refetchPyusd()
  }

  if (!address || !chain) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-gray-500">
          <p className="text-sm">Connect wallet to view balances</p>
        </div>
      </div>
    )
  }

  const nativeAmount = nativeBalance ? Number(formatUnits(nativeBalance.value, nativeBalance.decimals)) : 0
  const pyusdAmount = pyusdBalance ? Number(formatUnits(pyusdBalance.value, pyusdBalance.decimals)) : 0
  
  const nativeUsdValue = nativeAmount * (chain.id === arbitrum.id || chain.id === arbitrumSepolia.id ? (prices?.arb || 0) : (prices?.eth || 0))
  const pyusdUsdValue = pyusdAmount * (prices?.pyusd || 0)
  const totalUsdValue = nativeUsdValue + pyusdUsdValue

  const isMainnetChain = chain.id === mainnet.id || chain.id === sepolia.id
  const isArbitrumChain = chain.id === arbitrum.id || chain.id === arbitrumSepolia.id

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg border border-indigo-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">💰 Your Balances</h3>
          <p className="text-sm text-gray-600">
            Network: <span className="font-semibold">{chain.name}</span>
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          title="Refresh balances"
        >
          🔄
        </button>
      </div>

      {/* Total Balance in USD */}
      <div className="bg-white rounded-lg p-4 mb-4 border-2 border-indigo-200">
        <div className="text-sm text-gray-600 mb-1">Total Balance (USD)</div>
        <div className="text-3xl font-bold text-indigo-600">
          ${totalUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Individual Token Balances */}
      <div className="space-y-3 mb-6">
        {/* Native Token (ETH or ARB) */}
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {isArbitrumChain ? 'ARB' : 'ETH'}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {nativeBalance?.symbol || (isArbitrumChain ? 'ETH' : 'ETH')}
              </div>
              <div className="text-xs text-gray-500">
                ${nativeUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">
              {nativeAmount.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </div>
            <div className="text-xs text-gray-500">
              @ ${(chain.id === arbitrum.id || chain.id === arbitrumSepolia.id ? prices?.arb : prices?.eth)?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* PYUSD Token */}
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              PYUSD
            </div>
            <div>
              <div className="font-semibold text-gray-900">PayPal USD</div>
              <div className="text-xs text-gray-500">
                ${pyusdUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">
              {pyusdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">@ $1.00</div>
          </div>
        </div>
      </div>

      {/* Network Switcher */}
      <div className="border-t pt-4 mb-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Switch Network</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => switchChain({ chainId: process.env.NODE_ENV === 'production' ? mainnet.id : sepolia.id })}
            disabled={isMainnetChain}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              isMainnetChain
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-blue-50 border'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔷</span>
              <span>Ethereum</span>
            </div>
            {isMainnetChain && (
              <div className="text-xs mt-1">Connected</div>
            )}
          </button>
          <button
            onClick={() => switchChain({ chainId: process.env.NODE_ENV === 'production' ? arbitrum.id : arbitrumSepolia.id })}
            disabled={isArbitrumChain}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              isArbitrumChain
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-blue-50 border'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔵</span>
              <span>Arbitrum</span>
            </div>
            {isArbitrumChain && (
              <div className="text-xs mt-1">Connected</div>
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleFund}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          💸 Add Funds
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address)
              alert('Address copied to clipboard!')
            }
          }}
        >
          📋 Copy Address
        </Button>
      </div>

      {/* Address Display */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-xs text-gray-500 mb-1">Your Address</div>
        <div className="font-mono text-sm text-gray-700 break-all">
          {address}
        </div>
      </div>
    </div>
  )
}

