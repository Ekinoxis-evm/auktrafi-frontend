# Auktrafi Architecture

## 📁 Project Structure

### Pages

#### 1. **Home Page** (`/`)
- **Purpose**: Landing page with navigation to Admin and Marketplace
- **Features**:
  - Hero section with value proposition
  - Cards to navigate to Admin or Marketplace
  - Feature highlights
  - Wallet connection in header

#### 2. **Admin Panel** (`/admin`)
- **Purpose**: Business management dashboard for property owners
- **Operations**: **WRITE-HEAVY**
- **Features**:
  - Create new property vaults (write operation)
  - Manage existing vaults
  - Fund wallet functionality
  - Monitor vault performance
- **Components**:
  - `CreateVault` - Form to create new vaults
  - `VaultList` - Display user's own vaults
  - `FundWallet` - Funding options

#### 3. **Marketplace** (`/marketplace`)
- **Purpose**: Public marketplace for browsing and participating in auctions
- **Operations**: **READ-HEAVY** (optimized with React Query)
- **Features**:
  - Browse all available auctions (optimized reads)
  - Filter and search functionality
  - Place stakes (write operation)
  - Real-time updates
- **Components**:
  - `MarketplaceList` - Optimized list with caching
  - `AuctionCard` - Individual auction display
  - `AuctionFilters` - Filter sidebar
  - `StakeModal` - Stake placement (write)

## 🔧 Component Architecture

### Read-Optimized Components (Marketplace)

#### `MarketplaceList.tsx`
- Uses **React Query** for data fetching
- Features:
  - Automatic refetching every 30 seconds
  - Data caching (10s stale time)
  - Loading and error states
  - Optimistic UI updates

```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['marketplace-vaults'],
  queryFn: getAllVaults,
  refetchInterval: 30000, // Auto-refresh
  staleTime: 10000, // Cache for 10s
})
```

#### `AuctionCard.tsx`
- Lightweight card component
- Displays auction details
- Opens StakeModal for write operations

### Write-Optimized Components (Admin)

#### `CreateVault.tsx`
- Form for creating new vaults
- Validates inputs
- Handles blockchain transactions
- Success/error feedback

#### `StakeModal.tsx`
- Modal for placing stakes
- Input validation
- Transaction management
- Funding options integrated

## 🎯 Data Flow

### Read Operations (Marketplace)
```
User → Marketplace Page → MarketplaceList (React Query)
     → Contract Read → Cache → Display
     → Auto-refresh every 30s
```

### Write Operations (Admin & Staking)
```
User → Admin/Stake Action → Form Validation
     → Contract Write → Transaction
     → Success/Error → UI Update
     → Cache Invalidation (refetch)
```

## 🔄 State Management

### Global State
- **Privy**: Authentication and wallet management
- **Wagmi**: Blockchain interactions
- **React Query**: Server state and caching

### Local State
- Form inputs (useState)
- Modal visibility (useState)
- Filters (useState)

## 🚀 Performance Optimizations

### Marketplace (Read-Heavy)
1. **React Query Caching**
   - Reduces unnecessary blockchain reads
   - 10-second stale time
   - Background refetching

2. **Query Key Management**
   - Specific query keys for different data
   - Easy cache invalidation

3. **Pagination** (Future)
   - Load auctions in batches
   - Infinite scroll

### Admin (Write-Heavy)
1. **Optimistic Updates**
   - UI updates before blockchain confirmation
   - Rollback on error

2. **Transaction Status**
   - Clear pending/success/error states
   - User feedback

3. **Gas Optimization**
   - Batch operations when possible
   - Gas estimation before transaction

## 🎨 Styling

- **Tailwind CSS**: Utility-first styling
- **Color Themes**:
  - Admin: Blue theme (`bg-blue-600`)
  - Marketplace: Purple theme (`bg-purple-600`)
  - Funding: Green theme (`bg-green-600`)

## 🔐 Security

- **Wallet Connection**: Privy with Passkey support
- **Transaction Signing**: User approval required
- **Input Validation**: Client and contract-side
- **Error Handling**: Comprehensive error boundaries

## 📊 Future Enhancements

### Marketplace
- [ ] Advanced filtering (price, location, date)
- [ ] Sorting options
- [ ] Search functionality
- [ ] Auction history
- [ ] User bid tracking
- [ ] Real-time auction updates (WebSocket)
- [ ] Pagination/Infinite scroll

### Admin
- [ ] Vault analytics dashboard
- [ ] Historical data
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Notifications

### Staking
- [ ] Stake history
- [ ] Automated staking strategies
- [ ] Rewards tracking
- [ ] Withdrawal management

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Privy
- **Blockchain**: Wagmi + Viem
- **State Management**: React Query (TanStack Query)
- **Smart Contracts**: Solidity (Arbitrum/Ethereum)

## 📝 Development Guidelines

### Adding New Features

1. **Read Operations**
   - Use React Query
   - Add appropriate caching strategy
   - Handle loading/error states

2. **Write Operations**
   - Validate inputs
   - Show transaction status
   - Handle errors gracefully
   - Invalidate relevant queries after success

3. **Components**
   - Keep components focused (single responsibility)
   - Use TypeScript for props
   - Add loading states
   - Handle edge cases

### Code Organization

```
src/
├── app/              # Next.js pages
│   ├── page.tsx      # Landing
│   ├── admin/        # Admin panel
│   └── marketplace/  # Marketplace
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature components
├── hooks/           # Custom hooks
├── config/          # Configuration
├── contracts/       # Contract ABIs
└── lib/            # Utilities
```

## 🎯 Key Principles

1. **Separation of Concerns**: Admin (write) vs Marketplace (read)
2. **Performance**: Optimize reads with caching
3. **User Experience**: Clear feedback and loading states
4. **Security**: Proper validation and error handling
5. **Scalability**: Architecture supports growth

