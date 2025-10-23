'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import { ReactNode, useEffect } from 'react'
import { arbitrumSepolia } from 'wagmi/chains'

const queryClient = new QueryClient()

// Debug component to help troubleshoot Privy issues
function PrivyDebug() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    
    if (!appId || appId === 'your-privy-app-id') {
      console.error('❌ Privy App ID not configured!')
      console.error('Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment variables')
      console.error('Get your App ID from: https://dashboard.privy.io')
    } else {
      console.log('✅ Privy App ID configured')
    }
    
    if (typeof window !== 'undefined') {
      console.log('🌐 Current Domain:', window.location.origin)
      console.log('Make sure this domain is added to Privy Dashboard → Settings → Allowed Domains')
    }
  }, [])
  
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  // Show error if App ID is not configured
  if (!appId || appId === 'your-privy-app-id') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-xl border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Configuration Error</h2>
          <p className="text-gray-700 mb-4">
            Privy App ID is not configured. Please set up your environment variables.
          </p>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <code className="text-sm">NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here</code>
          </div>
          <p className="text-sm text-gray-600">
            Get your App ID from:{' '}
            <a 
              href="https://dashboard.privy.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Privy Dashboard
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Privy configuration
        loginMethods: ['email', 'wallet', 'google', 'passkey'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png',
          walletChainType: 'ethereum-only',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // Enable passkeys for authentication
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // Default chain for funding operations
        defaultChain: arbitrumSepolia,
        // Supported chains for funding (enables cross-chain bridging and wallet transfers)
        supportedChains: [arbitrumSepolia],
      }}
    >
      <PrivyDebug />
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

