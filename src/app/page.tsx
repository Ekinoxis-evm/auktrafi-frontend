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
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image - Futuristic Sustainable Building */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2070&auto=format&fit=crop)',
            filter: 'brightness(0.35) saturate(1.4) contrast(1.2)',
          }}
        >
          {/* Cyberpunk Overlay - Perfect balance for anime-style building */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-purple-900/45 to-cyan-900/55"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(6,182,212,0.2),transparent_65%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_55%,rgba(168,85,247,0.18),transparent_65%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(236,72,153,0.12),transparent_55%)]"></div>
          {/* Orange accent for the roof */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(251,146,60,0.08),transparent_50%)]"></div>
        </div>
        
        {/* Grid Pattern - Enhanced visibility */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}></div>
        
        {/* Animated Neon Glows - Matching the building's energy theme */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/25 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/25 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-500/18 rounded-full blur-3xl animate-pulse-slow delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-green-500/12 rounded-full blur-3xl animate-pulse-slow delay-3000"></div>
        {/* Orange glow for roof accent */}
        <div className="absolute top-0 right-1/3 w-[250px] h-[250px] bg-orange-500/15 rounded-full blur-3xl animate-pulse-slow delay-1500"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Hero Section - Ethereum Foundation Style */}
          <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-block mb-8 md:mb-12 animate-scale-in">
              <div className="text-7xl md:text-9xl lg:text-[140px] filter drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-float">
                🏠
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 mb-6 animate-fade-in-up delay-200 leading-tight tracking-tight">
              AUKTRAFI
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cyan-100 mb-16 md:mb-20 font-light animate-fade-in-up delay-400 max-w-3xl mx-auto leading-relaxed">
              Decentralized Real Estate Reservations & Auctions
            </p>
          </div>

          {/* Economic Model Section - Ethereum Foundation + Cyberpunk */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl md:rounded-[40px] p-6 sm:p-8 md:p-12 lg:p-16 mb-12 md:mb-16 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] animate-fade-in-up delay-600 hover:border-cyan-500/50 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-300 mb-8 md:mb-12 text-center tracking-tight">
              Innovative Economic Model
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              <div className="group relative bg-black/30 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 hover:bg-black/40 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">🔐</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-purple-300">Property Tokenization</h3>
                </div>
                <p className="text-cyan-100/80 leading-relaxed text-sm md:text-base">
                  Transform any real estate property into a tokenized digital asset. Property owners can create vaults representing their properties, establishing a new standard in decentralized real estate management.
                </p>
              </div>
              
              <div className="group relative bg-black/30 border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 hover:bg-black/40 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">💎</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-pink-300">PYUSD Staking</h3>
                </div>
                <p className="text-cyan-100/80 leading-relaxed text-sm md:text-base">
                  We use PYUSD (PayPal USD), a stable and reliable stablecoin, to ensure secure transactions. Users stake PYUSD to reserve properties, creating a decentralized and transparent guarantee system.
                </p>
              </div>
              
              <div className="group relative bg-black/30 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 hover:bg-black/40 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">⚡</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-cyan-300">Competitive Auctions</h3>
                </div>
                <p className="text-cyan-100/80 leading-relaxed text-sm md:text-base">
                  Decentralized auction system where multiple users can compete for exclusive reservations. Market-driven pricing ensures property owners get fair value and users pay competitive prices.
                </p>
              </div>
              
              <div className="group relative bg-black/30 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 hover:bg-black/40 transition-all duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">🌐</span>
                  <h3 className="text-xl md:text-2xl font-semibold text-green-300">Pure Blockchain</h3>
                </div>
                <p className="text-cyan-100/80 leading-relaxed text-sm md:text-base">
                  All transactions are recorded on Ethereum and Arbitrum, ensuring total transparency, immutable security, and eliminating intermediaries. Every reservation, bid, and transfer is publicly verifiable.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Distribution Section */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl md:rounded-[40px] p-6 sm:p-8 md:p-12 lg:p-16 mb-12 md:mb-16 border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.2)] animate-fade-in-up delay-700 hover:border-pink-500/50 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-pink-300 mb-3 md:mb-4 text-center tracking-tight">
              💰 Payment Distribution
            </h2>
            <p className="text-cyan-100/60 text-center text-sm md:text-base mb-8 md:mb-12">
              Transparent Revenue Sharing Model Built on Blockchain
            </p>

            {/* Base Price Section */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-semibold text-cyan-300 mb-4 md:mb-6">Base Price (No Auction)</h3>
              <p className="text-cyan-100/70 mb-4 md:mb-6 text-sm md:text-base">When a guest books at base price:</p>
              <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-black/30 border border-green-500/30 rounded-2xl p-5 md:p-6 hover:border-green-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-green-300 mb-2">95%</div>
                  <p className="text-cyan-100/80 text-sm md:text-base">Property Owner<br />(Parent Vault Treasury)</p>
                </div>
                <div className="bg-black/30 border border-purple-500/30 rounded-2xl p-5 md:p-6 hover:border-purple-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">5%</div>
                  <p className="text-cyan-100/80 text-sm md:text-base">Platform<br />(Auktrafi)</p>
                </div>
              </div>
            </div>

            {/* With Auction Section */}
            <div className="mb-8 md:mb-12">
              <h3 className="text-xl md:text-2xl font-semibold text-cyan-300 mb-4 md:mb-6">With Auction (Competitive Bidding)</h3>
              <p className="text-cyan-100/70 mb-4 md:mb-6 text-sm md:text-base">When final price exceeds base price, the additional value is split:</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-black/30 border border-cyan-500/30 rounded-2xl p-5 md:p-6 hover:border-cyan-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-300 mb-2">40%</div>
                  <p className="text-cyan-100/80 text-xs md:text-sm">Current Booker<br />(Who Checks In)</p>
                </div>
                <div className="bg-black/30 border border-yellow-500/30 rounded-2xl p-5 md:p-6 hover:border-yellow-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">30%</div>
                  <p className="text-cyan-100/80 text-xs md:text-sm">Last Booker<br />(Who Ceded)</p>
                </div>
                <div className="bg-black/30 border border-green-500/30 rounded-2xl p-5 md:p-6 hover:border-green-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-green-300 mb-2">20%</div>
                  <p className="text-cyan-100/80 text-xs md:text-sm">Property Owner</p>
                </div>
                <div className="bg-black/30 border border-purple-500/30 rounded-2xl p-5 md:p-6 hover:border-purple-500/50 hover:bg-black/40 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-purple-300 mb-2">10%</div>
                  <p className="text-cyan-100/80 text-xs md:text-sm">Platform<br />(Auktrafi)</p>
                </div>
              </div>
            </div>

            {/* Example Section */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/40 rounded-2xl md:rounded-3xl p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-purple-300 mb-4 md:mb-6">Example</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-cyan-200/60 text-xs md:text-sm mb-1">Base Price</p>
                    <p className="text-cyan-300 text-lg md:text-xl font-bold">$100/NIGHT</p>
                  </div>
                  <div className="bg-black/40 border border-pink-500/30 rounded-xl p-4">
                    <p className="text-pink-200/60 text-xs md:text-sm mb-1">Final Bid</p>
                    <p className="text-pink-300 text-lg md:text-xl font-bold">$150/NIGHT</p>
                  </div>
                </div>
                <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-200/60 text-xs md:text-sm mb-2">Additional Value</p>
                  <p className="text-yellow-300 text-xl md:text-2xl font-bold">$50</p>
                </div>
                <div className="pt-4 border-t border-cyan-500/30">
                  <p className="text-cyan-200 text-sm md:text-base mb-4 font-medium">Distribution:</p>
                  <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-black/50 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all duration-300">
                      <p className="text-green-200/80 text-xs md:text-sm mb-1">Property Owner</p>
                      <p className="text-green-300 text-base md:text-lg font-bold">$105</p>
                      <p className="text-cyan-100/50 text-xs">$95 (base) + $10 (20%)</p>
                    </div>
                    <div className="bg-black/50 border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-500/50 transition-all duration-300">
                      <p className="text-cyan-200/80 text-xs md:text-sm mb-1">Current Booker</p>
                      <p className="text-cyan-300 text-base md:text-lg font-bold">$20</p>
                      <p className="text-cyan-100/50 text-xs">40% of $50</p>
                    </div>
                    <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-300">
                      <p className="text-yellow-200/80 text-xs md:text-sm mb-1">Last Booker</p>
                      <p className="text-yellow-300 text-base md:text-lg font-bold">$15</p>
                      <p className="text-cyan-100/50 text-xs">30% of $50</p>
                    </div>
                    <div className="bg-black/50 border border-purple-500/30 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300">
                      <p className="text-purple-200/80 text-xs md:text-sm mb-1">Platform</p>
                      <p className="text-purple-300 text-base md:text-lg font-bold">$10</p>
                      <p className="text-cyan-100/50 text-xs">$5 (base) + $5 (10%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 animate-fade-in-up delay-800">
            <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 hover:bg-black/50 transition-all duration-500 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">🏗️</div>
              <h3 className="text-cyan-300 font-semibold text-lg md:text-xl mb-2">Own Properties</h3>
              <p className="text-cyan-100/70 text-sm md:text-base">Create and manage your tokenized real estate vaults</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-purple-500/50 hover:bg-black/50 transition-all duration-500 group">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">📋</div>
              <h3 className="text-purple-300 font-semibold text-lg md:text-xl mb-2">Reserve</h3>
              <p className="text-cyan-100/70 text-sm md:text-base">Stake PYUSD to book your dream property</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl border border-pink-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-pink-500/50 hover:bg-black/50 transition-all duration-500 group sm:col-span-2 lg:col-span-1">
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">🏆</div>
              <h3 className="text-pink-300 font-semibold text-lg md:text-xl mb-2">Bid & Win</h3>
              <p className="text-cyan-100/70 text-sm md:text-base">Compete in auctions for exclusive reservations</p>
            </div>
          </div>

          {/* CTA Button - Ethereum Foundation Style */}
          <div className="text-center animate-fade-in-up delay-1000">
            <button
              onClick={handleGoToApp}
              disabled={!ready}
              className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-cyan-400 to-purple-400 text-black rounded-2xl md:rounded-3xl font-bold text-lg md:text-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">Go to App</span>
              <svg 
                className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-300 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Footer Info */}
          <p className="mt-10 md:mt-12 text-cyan-100/60 text-center text-xs md:text-sm animate-fade-in-up delay-1200">
            Powered by <span className="font-semibold text-cyan-300">PYUSD</span> and <span className="font-semibold text-purple-300">Hardhat</span>
            <span className="mx-2 text-cyan-400/50">•</span>
            Deployed on <span className="font-semibold text-green-300">Ethereum</span> & <span className="font-semibold text-cyan-300">Arbitrum</span>
          </p>
        </div>
      </div>

      {/* Ethereum Foundation + Cyberpunk Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
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
        
        .delay-700 {
          animation-delay: 0.7s;
        }
        
        .delay-800 {
          animation-delay: 0.8s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-1200 {
          animation-delay: 1.2s;
        }
        
        .delay-1500 {
          animation-delay: 1.5s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .delay-3000 {
          animation-delay: 3s;
        }
        
        .delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}
