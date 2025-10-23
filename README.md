# 🏠 Auktrafi Frontend - Decentralized Property Auction Platform

A modern, fast, and secure frontend application for interacting with Digital House smart contracts on Ethereum and Arbitrum.

## ✨ Features

- **🔐 Passkey Authentication** - Secure login with Privy (email, Google, wallet, passkeys)
- **💰 Fund Wallet Integration** - Easy onramp with Privy's fund wallet feature  
- **⚡ Fast Performance** - Optimized read/write operations with Wagmi/Viem
- **🎨 Beautiful UI** - Modern design with Tailwind CSS
- **🌐 Multi-chain** - Support for Ethereum Sepolia, Arbitrum Sepolia, and mainnets
- **📊 Real-time Updates** - Live auction data and bid tracking
- **🏗️ Admin Panel** - Complete vault management dashboard
- **🏆 Marketplace** - Browse and participate in property auctions

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd digitalhouse-frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Privy App ID (Get from https://dashboard.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Optional: Custom RPC URLs
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-api-key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── admin/             # Admin dashboard
│   └── marketplace/       # Public marketplace
├── components/            # React components
│   ├── WalletConnect.tsx  # Wallet connection with Privy
│   ├── VaultList.tsx      # Display all vaults
│   ├── CreateVault.tsx    # Create new vaults
│   └── VaultManager.tsx   # Complete vault management
├── hooks/                 # Custom React hooks
│   ├── useDigitalHouseFactory.ts  # Factory contract interactions
│   └── useDigitalHouseVault.ts    # Vault contract interactions
├── contracts/             # Contract ABIs
│   ├── DigitalHouseFactory.json
│   └── DigitalHouseVault.json
├── config/               # Configuration files
│   └── wagmi.ts         # Wagmi configuration
└── providers/           # React providers
    └── PrivyProvider.tsx  # Privy + Wagmi setup
```

## 🔧 Configuration

### Contract Addresses

The app automatically selects the correct contract address based on the connected network. Addresses are configured in `src/config/wagmi.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x38e797F2f6b7ae1387e5eC7288Ec216Caf7e0109',
  [arbitrumSepolia.id]: '0xE30eBc03Cdf4c44b1bcD2Ca9aEf8bea27C6D082d',
  // Add mainnet addresses when deployed
}
```

### Supported Networks

- **Ethereum Sepolia** (Testnet)
- **Arbitrum Sepolia** (Testnet)
- **Ethereum Mainnet** (Production)
- **Arbitrum One** (Production)

## 🎯 Key Components

### 1. Wallet Connection (Privy)

```tsx
import { WalletConnect } from '@/components/WalletConnect'

// Features:
// - Passkey authentication
// - Email/Google login
// - Wallet connection
// - Fund wallet button
// - Automatic network switching
```

### 2. Vault Management

```tsx
import { VaultManager } from '@/components/VaultManager'

// Manage complete vault lifecycle:
// - Create reservations
// - Place bids
// - Cede reservations
// - Check in/out
// - View auction history
```

### 3. Custom Hooks

#### Factory Hook
```tsx
const {
  allVaultIds,
  createVault,
  getVaultInfo,
  // ... more functions
} = useDigitalHouseFactory()
```

#### Vault Hook
```tsx
const {
  vaultInfo,
  currentReservation,
  auctionBids,
  placeBid,
  cedeReservation,
  // ... more functions
} = useDigitalHouseVault(vaultAddress)
```

## 📖 Usage Examples

### Creating a Vault (Admin)

```tsx
// Admin panel - Create new vault
const { createVault } = useDigitalHouseFactory()

await createVault(
  'PROPERTY-001',           // Vault ID
  'Luxury Apartment NYC',   // Property details
  parseUnits('1000', 6),    // Base price (PYUSD has 6 decimals)
  '0x...'                   // Real estate address
)
```

### Placing a Bid (User)

```tsx
// Marketplace - Place bid on vault
const { placeBid } = useDigitalHouseVault(vaultAddress)

await placeBid(
  parseUnits('1500', 6)  // Bid amount in PYUSD
)
```

### Creating a Reservation

```tsx
const { createReservation } = useDigitalHouseVault(vaultAddress)

await createReservation(
  parseUnits('1000', 6),              // Stake amount
  BigInt(checkInDate.getTime() / 1000),   // Check-in timestamp
  BigInt(checkOutDate.getTime() / 1000)   // Check-out timestamp
)
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎨 Customization

### Styling

The app uses Tailwind CSS. Customize styles in:
- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Global styles
- Component files - Component-specific styles

### Branding

Update branding in:
- `src/app/layout.tsx` - Site metadata
- `src/app/page.tsx` - Home page content
- `public/` - Logo and favicons

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Contains sensitive API keys
2. **Validate all user inputs** - Especially amounts and addresses
3. **Use Privy's security features** - MFA, passkeys, session management
4. **Test on testnets first** - Before deploying to mainnet
5. **Audit smart contract interactions** - Double-check all transaction parameters

## 🐛 Troubleshooting

### Wallet Connection Issues

```bash
# Clear browser cache and reconnect
# Make sure Privy App ID is correct
# Check network configuration
```

### Transaction Failures

```bash
# Ensure sufficient PYUSD balance
# Check PYUSD approval for contract
# Verify gas settings
# Confirm network is correct
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## 📚 Documentation Links

- [Privy Documentation](https://docs.privy.io/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Discord**: [Join our community](#)
- **Twitter**: [@auktrafi](#)
- **Email**: support@auktrafi.com

---

<div align="center">

**Built with ❤️ using Next.js, Wagmi, Viem, and Privy**

</div>
