'use client'

import { useFundWallet } from '@privy-io/react-auth'
import { Button } from '@/components/ui/Button'
import { useAccount } from 'wagmi'

export function FundWallet() {
  const { fundWallet } = useFundWallet()
  const { address, chain } = useAccount()

  if (!address) {
    return null
  }

  const handleFund = () => {
    fundWallet({
      address: address,
    })
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <h3 className="font-semibold text-gray-900">Fund Your Wallet</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Add funds to your wallet to interact with Digital House vaults. You can:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Transfer from external wallet (MetaMask, Coinbase Wallet, etc.)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Bridge funds from other networks (automatic detection)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">•</span>
              Copy your address to receive funds manually
            </li>
          </ul>
          <Button 
            onClick={handleFund}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            💸 Fund Wallet
          </Button>
        </div>
      </div>
      
      {chain && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-xs text-gray-500">
            Current Network: <span className="font-semibold text-gray-700">{chain.name}</span>
          </p>
        </div>
      )}
    </div>
  )
}

