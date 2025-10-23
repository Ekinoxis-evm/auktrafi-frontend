'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'

export function WalletConnect() {
  const { login, logout, authenticated } = usePrivy()
  const { disconnect } = useDisconnect()

  const handleConnect = async () => {
    if (!authenticated) {
      await login()
    }
  }

  const handleDisconnect = async () => {
    await logout()
    disconnect()
  }

  if (!authenticated) {
    return (
      <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700 font-semibold">
        🔐 Connect
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleDisconnect}
      variant="outline"
      className="text-red-600 border-red-600 hover:bg-red-50 font-semibold"
    >
      🚪 Disconnect
    </Button>
  )
}

