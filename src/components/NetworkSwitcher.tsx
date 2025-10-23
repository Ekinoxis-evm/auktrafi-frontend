'use client'

import { useSwitchChain, useChainId } from 'wagmi'
import { mainnet, arbitrum, sepolia, arbitrumSepolia } from 'wagmi/chains'

const SUPPORTED_NETWORKS = [
  { chain: mainnet, label: 'Ethereum', icon: '⟠', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { chain: arbitrum, label: 'Arbitrum', icon: '🔷', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { chain: sepolia, label: 'Sepolia', icon: '⟠', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { chain: arbitrumSepolia, label: 'Arb Sepolia', icon: '🔷', color: 'bg-purple-100 text-purple-700 border-purple-300' },
]

export function NetworkSwitcher() {
  const { switchChain, isPending } = useSwitchChain()
  const chainId = useChainId()

  const currentNetwork = SUPPORTED_NETWORKS.find(n => n.chain.id === chainId)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 hidden sm:inline">Network:</span>
      <div className="relative group">
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 font-medium text-sm transition-all hover:shadow-md ${
            currentNetwork?.color || 'bg-gray-100 text-gray-700 border-gray-300'
          }`}
          disabled={isPending}
        >
          <span>{currentNetwork?.icon}</span>
          <span className="hidden sm:inline">{currentNetwork?.label}</span>
          <svg 
            className={`w-4 h-4 transition-transform ${isPending ? 'animate-spin' : 'group-hover:rotate-180'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-2">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.chain.id}
                onClick={() => switchChain({ chainId: network.chain.id })}
                disabled={isPending || chainId === network.chain.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  chainId === network.chain.id
                    ? 'bg-blue-50 text-blue-700 font-semibold cursor-default'
                    : 'hover:bg-gray-50 text-gray-700'
                } disabled:opacity-50`}
              >
                <span className="text-xl">{network.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{network.label}</div>
                  <div className="text-xs text-gray-500">
                    {network.chain.id === chainId ? 'Connected' : 'Switch network'}
                  </div>
                </div>
                {chainId === network.chain.id && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

