'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export function WalletConnect() {
  const { login, logout, authenticated } = usePrivy()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  const handleConnect = async () => {
    if (!authenticated) {
      await login()
    }
  }

  const handleDisconnect = async () => {
    try {
      console.log('🚪 Starting full logout...')
      
      // Step 1: Privy logout (clears authentication)
      await logout()
      
      // Step 2: Wagmi disconnect (disconnects wallet)
      disconnect()
      
      // Step 3: Clear any localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // Step 4: Redirect to home page
      router.push('/')
      
      console.log('✅ Full logout completed')
    } catch (err) {
      console.error('❌ Logout error:', err)
      // Force redirect even if error
      router.push('/')
    }
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
      className="text-red-600 border-red-600 hover:bg-red-50 font-semibold hover:border-red-700"
    >
      🚪 Full Logout
    </Button>
  )
}

