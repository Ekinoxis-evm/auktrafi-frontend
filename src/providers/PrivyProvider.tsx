'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import { ReactNode } from 'react'
import { arbitrumSepolia } from 'wagmi/chains'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'your-privy-app-id'}
      config={{
        // Privy configuration
        loginMethods: ['email', 'wallet', 'google', 'passkey'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url.com/logo.png',
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
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

