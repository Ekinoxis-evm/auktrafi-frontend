'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { ready, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      // Redirect to landing page if not authenticated
      router.push('/')
    }
  }, [ready, authenticated, router])

  // Show loading while checking auth
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🔒</div>
          <p className="text-xl font-semibold text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Render children if authenticated
  return <>{children}</>
}

