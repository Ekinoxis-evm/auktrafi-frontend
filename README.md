# 🏠 Auktrafi - Digital House Platform

A decentralized real estate booking platform with auction-based pricing and daily sub-vault system for flexible property rentals.

## 🚀 Overview

Auktrafi enables property owners to tokenize their real estate as vaults and allow users to book individual days through a competitive auction system. Each property can be divided into daily sub-vaults, creating a flexible, market-driven pricing mechanism.

## ✨ Key Features

### 🏡 For Property Owners
- **Create Vaults**: Tokenize properties with master access codes
- **Daily Pricing**: Set base daily rates for flexible bookings
- **Revenue Dashboard**: Track bookings and earnings per property
- **Access Control**: Manage master and daily access codes
- **Multi-chain**: Deploy on Ethereum Mainnet, Arbitrum, or testnets

### 🗓️ For Users
- **Daily Booking Calendar**: Visual calendar showing availability by day
- **Multi-day Reservations**: Book single or multiple days at once
- **Competitive Pricing**: Participate in auctions for popular dates
- **Instant Bookings**: Reserve available dates immediately
- **Access Codes**: Receive codes after check-in for property access

### 🎨 Daily Pricing Calendar System

The platform uses a **daily sub-vault architecture** where each day is an independent booking unit:

- **🟢 FREE** - Available for immediate booking
- **🟡 AUCTION** - Active bids, users can compete
- **🔴 SETTLED** - Occupied, not available
- **⚪ Available** - No sub-vault yet, can be booked

## 🏗️ Architecture

### Smart Contract System

```
DigitalHouseFactory (Factory Contract)
├── createVault(vaultId, details, basePrice, address, masterCode)
├── getOrCreateDailyVault(vaultId, dayTimestamp, masterCode)
└── createMultiDayReservation(vaultId, dayTimestamps[], masterCode)

DigitalHouseVault (Parent Vault)
├── dailyBasePrice (daily rate)
├── getMasterAccessCode()
└── Daily Sub-Vaults (children)
    ├── Individual day bookings
    ├── State: FREE → AUCTION → SETTLED
    └── Access codes per booking
```

### Frontend Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing page with Privy auth
│   ├── marketplace/
│   │   ├── page.tsx                  # Browse all properties
│   │   └── [vaultId]/page.tsx        # Property details + daily calendar
│   ├── ownerships/page.tsx           # Owner dashboard
│   ├── reservations/page.tsx         # User bookings
│   └── profile/page.tsx              # Wallet & balances
├── components/
│   ├── calendar/
│   │   ├── DailySubVaultsCalendar.tsx    # Interactive monthly calendar
│   │   ├── DayCell.tsx                   # Individual day cells
│   │   └── ActiveDailyBookings.tsx       # Booking list with filters
│   ├── vault/
│   │   ├── DailyBookingFlow.tsx          # 5-step booking process
│   │   ├── VaultCard.tsx                 # Property card with stats
│   │   ├── OwnerVaultCard.tsx            # Owner property card
│   │   ├── ReservationCard.tsx           # User reservation card
│   │   ├── AuctionFlow.tsx               # Auction bidding interface
│   │   └── CreateVault.tsx               # Create new property
│   ├── Layout.tsx                    # Persistent navbar + footer
│   ├── WalletConnect.tsx             # Connect/disconnect wallet
│   ├── NetworkSwitcher.tsx           # Chain selector
│   └── ui/                           # Reusable UI components
├── hooks/
│   ├── useDailySubVaults.ts          # Fetch daily sub-vaults
│   ├── useDailyVaultActions.ts       # Create bookings
│   ├── useMasterAccessCode.ts        # Fetch master code
│   ├── useDigitalHouseFactory.ts     # Factory contract interactions
│   ├── useDigitalHouseVault.ts       # Vault contract interactions
│   ├── useAccessCodes.ts             # Access code management
│   ├── useVaultInfo.ts               # Vault metadata
│   ├── useReservation.ts             # Reservation data
│   ├── useAuction.ts                 # Auction data
│   └── usePYUSDApproval.ts           # Token approvals
├── config/
│   └── wagmi.ts                      # Chain config + contract addresses
└── providers/
    └── PrivyProvider.tsx             # Privy auth config
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Wagmi, Viem, OnchainKit
- **Authentication**: Privy (embedded wallets)
- **Smart Contracts**: Solidity (Sepolia & Arbitrum Sepolia)
- **Token**: PYUSD (PayPal USD stablecoin)

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd digitalhouse-frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local

# Add your Privy App ID and RPC URLs to .env.local
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here

# Run development server
npm run dev
```

## 🌐 Deployment

The application is configured for **Vercel deployment**:

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

### Privy Configuration

After deploying, update your Privy dashboard:

1. **Allowed Domains**: Add your Vercel domain
2. **Allowed Origins**: Add your production URL
3. **Redirect URIs**: Add callback URLs

## 🔗 Smart Contract Addresses

### Testnets (Current)

- **Sepolia**: `0xBdB8AcD5c9feA0C7bC5D3ec5F99E2C198526a58F`
- **Arbitrum Sepolia**: `0xC3f3B1192E938A22a79149bbFc6d8218B1bC0117`

### PYUSD Token Addresses

- **Sepolia**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **Arbitrum Sepolia**: `0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1`
- **Ethereum Mainnet**: `0x6c3ea9036406852006290770BEdFcAbA0e23A0e8`

## 📱 Application Flow

### For Property Owners

1. **Connect Wallet** → Authenticate with Privy
2. **Go to Ownerships** → Click "Create New Vault"
3. **Fill Property Details** → Set daily price, add master access code
4. **Deploy Vault** → Transaction creates parent vault on-chain
5. **Manage Bookings** → View daily calendar, track earnings

### For Renters

1. **Connect Wallet** → Authenticate with Privy
2. **Browse Marketplace** → View available properties
3. **Select Property** → View daily calendar with availability
4. **Choose Dates** → Select one or multiple days
5. **Approve PYUSD** → Authorize payment (daily rate × days)
6. **Create Booking** → Transaction creates daily sub-vaults
7. **Check-In** → Receive access codes in Reservations page

### Booking States

Each day goes through these states:

```
No Sub-Vault (⚪)
    ↓ User books
FREE (🟢)
    ↓ Someone else bids higher
AUCTION (🟡)
    ↓ Auction ends (24h before check-in)
SETTLED (🔴)
    ↓ After check-out
Released (back to available)
```

## 🎯 Key Components

### Daily Booking Calendar

Interactive calendar showing real-time availability:

- **Color-coded days** by state (FREE/AUCTION/SETTLED)
- **Multi-day selection** for consecutive bookings
- **Month navigation** with stats summary
- **Real-time updates** after booking creation
- **Optimized queries** - data fetched on-demand

### Booking Flow (5 Steps)

1. **Select Dates** - Visual calendar selection
2. **Confirm** - Review selection and total cost
3. **Approve PYUSD** - Token approval transaction
4. **Create Booking** - Multi-day reservation transaction
5. **Success** - Confirmation with booking details

### Access Code System

- **Master Code** - Set by owner during vault creation, used for all bookings
- **Daily Codes** - Generated per booking, shown after check-in
- **Dual Display** - Master code (door access) + current code (reception)

## 🔐 Security Features

- **Privy Authentication** - Secure wallet management
- **ERC20 Approvals** - Granular token permissions
- **On-chain Verification** - All bookings stored on blockchain
- **Access Control** - Owner-only functions protected
- **Master Code Encryption** - Secure storage on-chain

## 🚦 Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page with "Go to App" button | No |
| `/marketplace` | Browse all properties | Yes |
| `/marketplace/[vaultId]` | Property details + booking | Yes |
| `/ownerships` | Owner dashboard | Yes |
| `/reservations` | User bookings | Yes |
| `/profile` | Wallet, balances, funding | Yes |

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npm run build

# Run in development
npm run dev
```

## 📊 Performance Optimizations

- **React Query caching** - Smart contract data cached
- **Optimistic updates** - UI updates before confirmation
- **Parallel queries** - Multiple contract calls batched
- **Memoization** - Calendar calculations cached
- **On-demand loading** - Data fetched when needed

## 🤝 Contributing

This is a production application. All changes should:

1. Pass TypeScript compilation
2. Pass linter checks
3. Be tested on testnets
4. Follow existing code patterns
5. Update this README if adding features

## 📄 License

MIT

## 🔗 Links

- **Frontend Repository**: [Current Repository]
- **Smart Contracts**: [Contract Repository]
- **Explorer (Sepolia)**: https://sepolia.etherscan.io
- **Explorer (Arbitrum Sepolia)**: https://sepolia.arbiscan.io

---

Built with ❤️ using Next.js, Privy, Wagmi, and PYUSD
