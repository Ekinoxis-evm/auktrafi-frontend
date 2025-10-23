# 🏠 Auktrafi - Decentralized Auction Platform

> Decentralized Auction, Booking, and Distribution Platform for Property Vaults

[![Next.js](https://img.shields.io/badge/Next.js-16.0.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![Privy](https://img.shields.io/badge/Privy-Auth-purple)](https://privy.io/)

## 📋 Overview

Auktrafi is a comprehensive blockchain-based platform for managing and participating in property auctions. Built with modern web technologies and blockchain integration, it provides a seamless experience for both property owners and auction participants.

## 🚨 Quick Troubleshooting

**Wallet not connecting after deployment?**
→ See **[Cache Troubleshooting Guide](./docs/setup/CLEAR_CACHE.md)**

**Need to configure Privy domains?**
→ See **[Privy Domain Config](./docs/setup/PRIVY_DOMAIN_CONFIG.md)**

## ✨ Features

### 🏗️ **Admin Panel** (`/admin`)
- **Create Property Vaults**: Simple form to tokenize real estate
- **Manage Auctions**: Monitor and control your property listings
- **Multi-Token Balance**: View ETH, ARB, PYUSD, and USD balances
- **Network Switching**: Seamlessly switch between Ethereum and Arbitrum
- **Funding Integration**: Add funds via wallet transfers or bridging

### 🏪 **Marketplace** (`/marketplace`)
- **Browse Auctions**: Optimized read operations with React Query
- **Advanced Filtering**: Filter by price, status, and more
- **Staking System**: Participate in auctions by placing stakes
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Cross-chain Support**: Interact across Ethereum and Arbitrum

### 💰 **Balance Management**
- **Multi-Token Display**: ETH, ARB, PYUSD with USD valuations
- **Network Switching**: One-click network changes
- **Funding Options**:
  - Transfer from external wallets (MetaMask, Coinbase, etc.)
  - Cross-chain bridging (automatic detection)
  - Manual address copy

### 🔐 **Authentication**
- **Privy Integration**: Passwordless authentication
- **Passkey Support**: Modern, secure login
- **Embedded Wallets**: Automatic wallet creation
- **Multi-Wallet**: Support for external wallet connections

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Privy App ID ([Get one here](https://dashboard.privy.io))
- Alchemy API key (optional, for custom RPCs)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ekinoxis-evm/auktrafi-frontend.git
cd auktrafi-frontend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Edit .env.local with your credentials
nano .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Privy Configuration (Required)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Optional: Custom RPC URLs
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-api-key
```

### Privy Setup

1. Go to [Privy Dashboard](https://dashboard.privy.io)
2. Create a new app
3. Copy your App ID
4. Configure login methods (Email, Wallet, Google, Passkey)
5. Set up funding methods (Wallet transfers enabled by default)

## 📁 Project Structure

```
auktrafi-frontend/
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── page.tsx             # Landing page
│   │   ├── admin/               # Admin dashboard
│   │   └── marketplace/         # Public marketplace
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── BalanceCard.tsx      # Multi-token balance display
│   │   ├── CreateVault.tsx      # Vault creation form
│   │   ├── MarketplaceList.tsx  # Auction listings
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   │   └── useDigitalHouseFactory.ts
│   ├── config/                  # Configuration
│   │   └── wagmi.ts            # Blockchain config
│   ├── contracts/              # Contract ABIs
│   │   └── DigitalHouseFactory.json
│   └── providers/              # React context providers
│       └── PrivyProvider.tsx
├── public/                     # Static assets
├── docs/                       # 📚 Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── BALANCE_MODULE.md      # Balance module
│   ├── VAULT_MANAGEMENT.md    # Vault management
│   ├── IMPLEMENTATION_SUMMARY.md # Implementation details
│   └── setup/                 # Setup guides
│       ├── VERCEL_SETUP.md
│       ├── PRIVY_DOMAIN_CONFIG.md
│       ├── PRIVY_APP_CLIENT_SETUP.md
│       └── CLEAR_CACHE.md
└── README.md                   # 👈 You are here
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: [Privy](https://privy.io/)
- **Blockchain**: 
  - [Wagmi](https://wagmi.sh/) - React Hooks for Ethereum
  - [Viem](https://viem.sh/) - TypeScript Interface for Ethereum
- **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
- **Networks**: Ethereum, Arbitrum (+ Testnets)

## 🎯 Key Features Explained

### Balance Card

The BalanceCard component provides a comprehensive view of user funds:

```typescript
- ETH/ARB Balance: Native token with live USD price
- PYUSD Balance: Stablecoin with $1.00 peg
- Total USD: Sum of all holdings
- Network Switcher: Ethereum ↔ Arbitrum
- Quick Actions: Fund wallet, copy address
```

### Network Switching

Users can seamlessly switch between:
- **Ethereum Mainnet** / Sepolia (testnet)
- **Arbitrum** / Arbitrum Sepolia (testnet)

Benefits:
- Lower gas fees on Arbitrum
- Faster transaction confirmations
- Same functionality across both networks

### Funding Options

Powered by Privy, users can fund their wallets via:

1. **Wallet Transfers**: Connect MetaMask, Coinbase Wallet, etc.
2. **Cross-Chain Bridging**: Automatic detection and bridging
3. **Manual Transfer**: Copy address and send manually

## 📚 Documentation

### 📖 Core Documentation
- **[Architecture Overview](./docs/ARCHITECTURE.md)**: Complete system architecture
- **[Balance Module](./docs/BALANCE_MODULE.md)**: Multi-token balance management
- **[Vault Management](./docs/VAULT_MANAGEMENT.md)**: Vault creation and bidding
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)**: Technical implementation details

### ⚙️ Setup & Configuration
- **[Vercel Deployment](./docs/setup/VERCEL_SETUP.md)**: Deploy to Vercel
- **[Privy Domain Config](./docs/setup/PRIVY_DOMAIN_CONFIG.md)**: Configure Privy domains
- **[Privy App Client Setup](./docs/setup/PRIVY_APP_CLIENT_SETUP.md)**: Privy authentication setup
- **[Cache Troubleshooting](./docs/setup/CLEAR_CACHE.md)**: Fix Privy connection issues

## 🔐 Security

- ✅ Privy authentication with Passkey support
- ✅ Wallet signature required for transactions
- ✅ Client-side and contract-level validation
- ✅ Secure RPC connections
- ✅ No private key exposure

## 🚧 Roadmap

### Short Term
- [ ] Complete vault details display in marketplace
- [ ] Implement actual staking transactions
- [ ] Add real-time price feeds (CoinGecko/Chainlink)
- [ ] Enhanced filtering and search

### Medium Term
- [ ] Multi-token support (USDC, USDT, DAI)
- [ ] Historical balance charts
- [ ] Notification system
- [ ] Mobile app (React Native)

### Long Term
- [ ] DAO governance
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Privy](https://privy.io/) for authentication infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for smart contract standards
- [Wagmi](https://wagmi.sh/) for React hooks
- [Next.js](https://nextjs.org/) team for the amazing framework

## 📞 Support

- **Documentation**: Check our docs folder
- **Issues**: [GitHub Issues](https://github.com/Ekinoxis-evm/auktrafi-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ekinoxis-evm/auktrafi-frontend/discussions)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

Built with ❤️ by the Auktrafi Team
