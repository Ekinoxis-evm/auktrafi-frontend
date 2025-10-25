'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LandingPage() {
  const { ready, authenticated, login } = usePrivy()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/marketplace')
    }
  }, [ready, authenticated, router])

  const handleGoToApp = () => {
    if (!authenticated) {
      login()
    } else {
      router.push('/marketplace')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 animate-fade-in">
          <div className="text-9xl mb-6 animate-bounce-slow">🏠</div>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 animate-fade-in-up">
          Auktrafi
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-white/90 mb-12 font-medium animate-fade-in-up delay-200">
          Decentralized Real Estate Reservations & Auctions
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-400">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🏗️</div>
            <h3 className="text-white font-bold text-lg mb-2">Own Properties</h3>
            <p className="text-white/80 text-sm">Create and manage your tokenized real estate vaults</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-white font-bold text-lg mb-2">Reserve</h3>
            <p className="text-white/80 text-sm">Stake PYUSD to book your dream property</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-bold text-lg mb-2">Bid & Win</h3>
            <p className="text-white/80 text-sm">Compete in auctions for exclusive reservations</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleGoToApp}
          disabled={!ready}
          className="group relative inline-flex items-center gap-3 px-12 py-6 bg-white text-purple-600 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-600"
        >
          <span>Go to App</span>
          <svg 
            className="w-8 h-8 group-hover:translate-x-2 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Info Text */}
        <p className="mt-8 text-white/70 text-sm animate-fade-in-up delay-800">
          Powered by <span className="font-bold">PYUSD and Hardhat</span>. <br />
          Currently deployed on <span className="font-bold">Ethereum</span> & <span className="font-bold">Arbitrum</span>
        </p>

        {/* Test Link (Development) */}
        <div className="mt-4 animate-fade-in-up delay-1000">
          <button
            onClick={() => router.push('/test-booking')}
            className="text-white/50 hover:text-white/80 text-xs underline transition-colors"
          >
            🧪 Test Booking Flow
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
