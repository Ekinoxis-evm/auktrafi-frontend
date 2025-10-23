# 🏗️ Auktrafi Frontend Architecture

Complete architecture documentation for the modular Auktrafi frontend application.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page with navigation
│   ├── ownerships/
│   │   └── page.tsx               # Create & manage user's vaults
│   ├── reserves/
│   │   └── page.tsx               # View user's reservations
│   └── marketplace/
│       ├── page.tsx               # Browse all vaults
│       └── [vaultId]/
│           └── page.tsx           # Vault detail with flows
├── components/
│   ├── ui/
│   │   └── Button.tsx             # Reusable button component
│   ├── vault/
│   │   ├── VaultCard.tsx          # Vault display card
│   │   ├── ReservationFlow.tsx    # First staker flow
│   │   └── AuctionFlow.tsx        # Bidding & cession flow
│   ├── WalletConnect.tsx          # Privy wallet connection
│   ├── VaultList.tsx              # Legacy vault list
│   └── CreateVault.tsx            # Create new vault form
├── hooks/
│   ├── useVaultInfo.ts            # Read vault information
│   ├── useReservation.ts          # Read reservation data
│   ├── useAuction.ts              # Read auction/bids data
│   ├── useVaultActions.ts         # Write operations
│   ├── useDigitalHouseFactory.ts  # Factory interactions
│   └── useDigitalHouseVault.ts    # Legacy vault hook
├── contracts/
│   ├── DigitalHouseFactory.json   # Factory ABI
│   └── DigitalHouseVault.json     # Vault ABI
└── config/
    └── wagmi.ts                   # Blockchain configuration
```

## 🎯 User Flows

### 1. Ownerships Flow
**Purpose**: Create and manage your own property vaults

**Route**: `/ownerships`

**Features**:
- ✅ Create new vaults (ownerships)
- ✅ View only vaults owned by connected wallet
- ✅ Manage individual vault settings
- ✅ Quick access to vault management

**Components**:
- `CreateVault` - Form to create new vault
- `VaultCard` - Display vault with "Manage" button
- Owner filtering logic

### 2. My Reserves Flow
**Purpose**: Track all active reservations

**Route**: `/reserves`

**Features**:
- ✅ View all vaults where user is the current booker
- ✅ See reservation details (check-in, check-out, stake)
- ✅ Quick access to manage reservations
- ✅ Direct link to vault details

**Components**:
- `VaultCard` - Display reserved vaults
- Booker filtering logic

### 3. Marketplace Flow
**Purpose**: Browse and participate in all property auctions

**Route**: `/marketplace`

**Features**:
- ✅ Browse ALL available vaults
- ✅ Filter by status (Available, Active Auction, Occupied)
- ✅ View vault details
- ✅ Create reservations
- ✅ Place bids

**Components**:
- `VaultCard` - Display all vaults
- Status filter buttons
- Grid layout with responsive design

### 4. Vault Detail Flow
**Purpose**: Interact with specific vault (two flows)

**Route**: `/marketplace/[vaultId]`

**Two Main Flows**:

#### A. Reservation Flow (FREE State)
When vault is available for first reservation:

**Features**:
- ✅ Display vault information
- ✅ Form with stake amount, check-in, check-out
- ✅ Call `createReservation()`
- ✅ Transaction confirmation
- ✅ Automatic state update to AUCTION

**Component**: `ReservationFlow`

**User Actions**:
1. Enter stake amount (≥ base price)
2. Select check-in date (future)
3. Select check-out date (after check-in)
4. Submit transaction
5. Wait for confirmation

#### B. Auction Flow (AUCTION State)
When vault has active reservation:

**Features**:
- ✅ Display current reservation details
- ✅ List all active bids
- ✅ Place new bids (for non-bookers)
- ✅ Cede reservation (for booker, 24h before check-in)
- ✅ Withdraw bids
- ✅ Check-in (on check-in date)
- ✅ Check-out (on check-out date)

**Component**: `AuctionFlow`

**User Actions**:

**For Bidders (Non-booker)**:
1. View current reservation
2. Place bid higher than current stake
3. Withdraw own active bids

**For Booker (Reservation holder)**:
1. View all bids on their reservation
2. Cede to highest bidder (within 24h of check-in)
   - Earn citizen value (30% of additional value)
3. Check-in on arrival date
4. Check-out after stay
5. Cancel reservation (if needed)

## 🔧 Modular Hooks Architecture

### Read Hooks (Data Fetching)

#### `useVaultInfo(vaultAddress)`
Read basic vault information:
- `vaultId` - Vault identifier
- `propertyDetails` - Property description
- `basePrice` - Minimum stake amount
- `currentState` - FREE (0), AUCTION (1), SETTLED (2)
- `owner` - Vault owner address

#### `useReservation(vaultAddress)`
Read current reservation:
- `booker` - Current reservation holder
- `stakeAmount` - Amount staked
- `checkInDate` - Check-in timestamp
- `checkOutDate` - Check-out timestamp
- `hasActiveReservation` - Boolean flag
- `refetch()` - Refresh data

#### `useAuction(vaultAddress)`
Read auction bids:
- `bids` - All bids (active & inactive)
- `activeBids` - Only active bids
- `highestBid` - Highest active bid
- `refetch()` - Refresh data

### Write Hook (Transactions)

#### `useVaultActions(vaultAddress)`
All write operations:
- `createReservation(stake, checkIn, checkOut)` - First staker
- `placeBid(amount)` - Place competitive bid
- `cedeReservation(bidIndex)` - Cede to bidder
- `withdrawBid(bidIndex)` - Withdraw own bid
- `checkIn()` - Arrival check-in
- `checkOut()` - Departure check-out
- `cancelReservation()` - Cancel reservation

**Transaction State**:
- `isPending` - Transaction preparing
- `isConfirming` - On-chain confirmation
- `isConfirmed` - Transaction confirmed
- `hash` - Transaction hash
- `error` - Error if any

## 🎨 UI/UX Design

### Color Coding

**Vault States**:
- 🟢 **Available** (FREE) - Green theme
- 🟡 **Active Auction** (AUCTION) - Yellow theme
- 🔴 **Occupied** (SETTLED) - Red theme

**Sections**:
- **Ownerships** - Blue gradient
- **My Reserves** - Emerald/Teal gradient
- **Marketplace** - Purple/Pink gradient

### Animations
- `animate-fade-in` - Smooth content appearance
- `animate-slide-up` - Upward slide animation
- Hover effects on cards
- Transform scale on buttons

### Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Sticky navigation
- Touch-friendly buttons

## 🔐 Security & Best Practices

### Wallet Integration
- ✅ Privy authentication with Passkeys
- ✅ Multiple login methods (email, Google, wallet)
- ✅ Embedded wallet creation
- ✅ Fund wallet integration

### Transaction Safety
- ✅ All amounts in correct decimals (PYUSD = 6)
- ✅ Input validation before submission
- ✅ Transaction state tracking
- ✅ Error handling with user feedback
- ✅ Confirmation waiting

### Data Fetching
- ✅ Automatic refetch after transactions
- ✅ Loading states for UX
- ✅ Error states with retry
- ✅ Filtering at component level

## 📊 State Management

### Vault States Flow
```
FREE → (createReservation) → AUCTION → (checkIn) → SETTLED → (checkOut) → FREE
                                 ↓
                            (cancelReservation)
                                 ↓
                               FREE
```

### Reservation State
```
No Reservation → Create → Active → Ceded/Checked-in → Completed
                                ↓
                           Cancelled
```

### Bid State
```
No Bid → Placed → Active → Withdrawn/Accepted
```

## 🚀 Development Workflow

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

## 📱 Routes Summary

| Route | Purpose | Main Feature |
|-------|---------|--------------|
| `/` | Landing | Navigation hub |
| `/ownerships` | Create & Manage | Owner's vaults only |
| `/reserves` | My Reservations | Booker's vaults only |
| `/marketplace` | Browse All | All vaults with filters |
| `/marketplace/[vaultId]` | Vault Detail | Reservation/Auction flows |

## 🎯 Key Differentiators

### Ownerships vs Reserves
- **Ownerships**: Vaults you **created** (owner)
- **Reserves**: Vaults you **booked** (booker)

### Reservation vs Auction
- **Reservation Flow**: First user stakes (vault is FREE)
- **Auction Flow**: Competitive bidding (vault is AUCTION)

## 📈 Future Enhancements

- [ ] Search functionality
- [ ] Advanced filtering (price range, dates)
- [ ] Notifications for bid updates
- [ ] History of past reservations
- [ ] Analytics dashboard
- [ ] Mobile app version

---

<div align="center">

**Built with modular architecture for scalability and maintainability** 🚀

</div>

