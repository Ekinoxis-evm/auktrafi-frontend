'use client'

import { usePrivy, useWallets, useFundWallet } from '@privy-io/react-auth'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'

export function WalletConnect() {
  const { login, logout, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  const { address, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { fundWallet } = useFundWallet()

  const handleConnect = async () => {
    if (!authenticated) {
      await login()
    }
  }

  const handleDisconnect = async () => {
    await logout()
    disconnect()
  }

  const handleFund = () => {
    if (address) {
      fundWallet({
        address: address,
      })
    }
  }

  if (!authenticated) {
    return (
      <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
        🔐 Connect with Passkey
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Connected</p>
          <p className="font-mono text-sm">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet'}
          </p>
          {chain && (
            <p className="text-xs text-gray-500 mt-1">
              Network: {chain.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleFund}
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50"
            title="Fund Wallet"
          >
            💰 Fund
          </Button>
          <Button 
            onClick={handleDisconnect}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      </div>
      
      {user && (
        <div className="text-xs text-gray-500">
          <p>Email: {user.email?.address || 'N/A'}</p>
          <p>Wallets: {wallets.length}</p>
        </div>
      )}
    </div>
  )
}

