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
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop)',
          }}
        >
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-purple-900/80 to-blue-900/85"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {/* Logo/Icon */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="text-9xl mb-6 animate-bounce-slow">🏠</div>
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 text-center animate-fade-in-up">
            Auktrafi
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/95 mb-4 text-center font-medium animate-fade-in-up delay-200">
            Decentralized Real Estate Reservations & Auctions
          </p>

          {/* Economic Model Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 mb-12 border border-white/20 shadow-2xl animate-fade-in-up delay-400">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
              💰 Modelo Económico Innovador
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/90">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔐</span> Tokenización de Propiedades
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Transforma cualquier propiedad inmobiliaria en un activo digital tokenizado. Los propietarios pueden crear vaults que representan sus propiedades, estableciendo un nuevo estándar en la gestión de bienes raíces descentralizada.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💎</span> Staking PYUSD para Reservas
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Utilizamos PYUSD (PayPal USD), una stablecoin estable y confiable, para garantizar transacciones seguras. Los usuarios hacen stake de PYUSD para reservar propiedades, creando un sistema de garantía descentralizado y transparente.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Subastas Competitivas
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Sistema de subastas descentralizado donde múltiples usuarios pueden competir por reservas exclusivas. El precio se determina por el mercado, garantizando que los propietarios obtengan el valor justo y los usuarios paguen precios competitivos.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🌐</span> Blockchain Pura
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Todas las transacciones están registradas en Ethereum y Arbitrum, garantizando transparencia total, seguridad inmutable y eliminando intermediarios. Cada reserva, puja y transferencia es verificable públicamente.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in-up delay-600">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="text-white font-bold text-lg mb-2">Own Properties</h3>
              <p className="text-white/80 text-sm">Create and manage your tokenized real estate vaults</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-white font-bold text-lg mb-2">Reserve</h3>
              <p className="text-white/80 text-sm">Stake PYUSD to book your dream property</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-white font-bold text-lg mb-2">Bid & Win</h3>
              <p className="text-white/80 text-sm">Compete in auctions for exclusive reservations</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center animate-fade-in-up delay-800">
            <button
              onClick={handleGoToApp}
              disabled={!ready}
              className="group relative inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Info Text */}
          <p className="mt-8 text-white/80 text-center text-sm animate-fade-in-up delay-1000">
            Powered by <span className="font-bold text-white">PYUSD and Hardhat</span>. <br />
            Currently deployed on <span className="font-bold text-white">Ethereum</span> & <span className="font-bold text-white">Arbitrum</span>
          </p>
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
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
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
