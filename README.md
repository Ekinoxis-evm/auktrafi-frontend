# 🏠 Auktrafi - Digital House Frontend

Plataforma descentralizada para gestionar propiedades tokenizadas con sistema de reservas y subastas en blockchain.

## 🎉 Recent Updates (October 2025)

### ✨ Authentication & Landing Page
- 🆕 **New Landing Page**: Beautiful "Go to App" entry point with Privy authentication
- 🔒 **AuthGuard Component**: All app pages now protected with authentication
- ♻️ **Auto-redirect**: Authenticated users go straight to /marketplace
- 🎨 **Animated UI**: Gradient background, smooth transitions, fade-in effects

### 🏗️ Ownerships Improvements  
- ⚡ **Performance**: Now uses `getOwnerVaults()` directly from factory contract
- 🚀 **Faster Loading**: No manual filtering needed
- 🎯 **Accurate**: Shows only vaults owned by connected wallet
- 💫 **Loading States**: Better UX with skeleton loaders

### 📋 Navigation Updates
- 🔄 **Renamed**: `/reserves` → `/reservations` for consistency
- 👤 **Profile in Navbar**: Profile page now accessible from navigation
- 💼 **Wallet Display**: Shows connected address in navbar (desktop)
- 📱 **Mobile Optimized**: Compact nav with icons for small screens

### 🔑 Access Code
- ✅ **Already Implemented**: Captures access code after check-in
- 📺 **Prominent Display**: Shows 6-digit code with copy/share options
- 🎯 **User-friendly**: Clear instructions and visual feedback

### 🗺️ Current Routes
- ✅ `/` - Landing Page (public)
- 🔒 `/marketplace` - Browse vaults (protected)
- 🔒 `/ownerships` - Manage properties (protected)
- 🔒 `/reservations` - View bookings (protected)
- 🔒 `/profile` - User profile (protected)

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Páginas](#páginas)
- [Componentes](#componentes)
- [Hooks Personalizados](#hooks-personalizados)
- [Configuración](#configuración)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)

---

## 🎯 Descripción General

Auktrafi es una aplicación Web3 que permite a los usuarios:

- **Crear vaults** de propiedades tokenizadas
- **Realizar reservas** con staking de PYUSD
- **Participar en subastas** para obtener reservas
- **Gestionar sus propiedades** y reservas activas
- **Conectar wallets** con autenticación segura vía Privy

### Flujo de Usuario

1. **Propietarios**: Crean vaults con precio base y detalles de la propiedad
2. **Reservantes**: Hacen stake de PYUSD para reservar una propiedad
3. **Subastadores**: Compiten con bids más altos para obtener la reserva
4. **Check-in/Check-out**: Sistema automatizado de entrada y salida

---

## 🛠 Tecnologías

### Core
- **Next.js 16** (App Router) - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos

### Web3
- **Wagmi** - React Hooks para Ethereum
- **Viem** - Cliente Ethereum TypeScript
- **Privy** - Autenticación y gestión de wallets
- **OnchainKit** (configurado) - SDK de Coinbase para dApps

### Blockchain
- **Ethereum Mainnet**
- **Arbitrum**
- **Sepolia Testnet**
- **Arbitrum Sepolia Testnet**

### Tokens
- **PYUSD** (PayPal USD) - Token principal para reservas y bids

---

## 📁 Estructura del Proyecto

```
digitalhouse-frontend/
├── src/
│   ├── app/                        # Rutas de Next.js App Router
│   │   ├── layout.tsx             # Layout raíz con providers
│   │   ├── page.tsx               # 🆕 Landing page con "Go to App"
│   │   ├── marketplace/           # 🔒 Marketplace de vaults (protected)
│   │   │   ├── page.tsx          # Lista de vaults (MarketplacePage)
│   │   │   └── [vaultId]/        # 🔒 Detalle de vault (protected)
│   │   │       └── page.tsx      # VaultDetailPage
│   │   ├── ownerships/            # 🔒 Propiedades del usuario (protected)
│   │   │   └── page.tsx          # ⭐ OwnershipsPage (improved)
│   │   ├── reservations/          # 🔒 Reservas del usuario (protected)
│   │   │   └── page.tsx          # 🔄 ReservationsPage (renamed)
│   │   └── profile/               # 🔒 Perfil de usuario (protected)
│   │       └── page.tsx          # ⭐ ProfilePage (now in navbar)
│   │
│   ├── components/                # Componentes React
│   │   ├── ui/                    # Componentes UI básicos
│   │   │   └── Button.tsx
│   │   ├── vault/                 # Componentes de vaults
│   │   │   ├── VaultCard.tsx
│   │   │   ├── OwnerVaultCard.tsx # 🆕 Card para owners
│   │   │   ├── ReservationFlow.tsx
│   │   │   └── AuctionFlow.tsx
│   │   ├── AuthGuard.tsx          # 🆕 Authentication guard
│   │   ├── Layout.tsx             # ⭐ Layout con auth & navbar
│   │   ├── WalletConnect.tsx      # Botón de conexión de wallet
│   │   ├── NetworkSwitcher.tsx    # Selector de red
│   │   ├── CreateVault.tsx        # Formulario crear vault
│   │   ├── BalanceCard.tsx        # Tarjeta de balances
│   │   └── FundWallet.tsx         # Opciones de fondeo
│   │
│   ├── hooks/                   # Hooks personalizados
│   │   ├── useDigitalHouseFactory.ts
│   │   ├── useDigitalHouseVault.ts
│   │   ├── useVaultInfo.ts
│   │   ├── useVaultActions.ts
│   │   ├── useReservation.ts
│   │   ├── useAuction.ts
│   │   └── usePYUSDApproval.ts
│   │
│   ├── config/                  # Configuración
│   │   └── wagmi.ts            # Configuración de Wagmi
│   │
│   ├── contracts/               # ABIs de contratos
│   │   ├── DigitalHouseFactory.json
│   │   └── DigitalHouseVault.json
│   │
│   ├── providers/               # Providers de React
│   │   └── PrivyProvider.tsx   # Configuración de Privy
│   │
│   └── lib/                     # Utilidades
│       └── utils.ts
│
├── public/                      # Archivos estáticos
├── .env.local                   # Variables de entorno (no versionado)
├── env.example                  # Ejemplo de variables de entorno
└── package.json
```

---

## 📄 Páginas

### 🏠 Landing Page (`/`) - **PUBLIC**
**Componente**: `page.tsx`

**Nueva landing page de autenticación con "Go to App"**:
- Diseño moderno con gradientes y animaciones
- Botón principal "Go to App"
- Trigger de autenticación Privy
- Auto-redirect a `/marketplace` si ya está autenticado
- Features grid mostrando las capacidades de la app

**Flujo de autenticación**:
1. Usuario ve landing page
2. Click en "Go to App"
3. Modal de Privy para login/signup
4. Redirect automático a `/marketplace`

**Características**:
- 🎨 Gradiente animado de fondo
- 📱 Completamente responsive
- 🔐 Integración con Privy Auth
- ✨ Animaciones suaves (fade-in, slide-up)
- 🏗️ 📋 🏆 Feature cards

### 🏆 Marketplace (`/marketplace`) - **PROTECTED**
**Componente**: `MarketplacePage`

**⚠️ Requires Authentication**: Wrapped with `AuthGuard`

**Características**:
- Lista todos los vaults disponibles
- Filtros por estado: FREE, AUCTION, OCCUPIED
- Botón de refresh para actualizar datos
- Cards con información resumida de cada vault

**Datos mostrados**:
- ID del vault
- Detalles de la propiedad
- Estado actual (FREE/AUCTION/OCCUPIED)
- Precio base en PYUSD

### 📋 Detalle de Vault (`/marketplace/[vaultId]`) - **PROTECTED**
**Componente**: `VaultDetailPage`

**⚠️ Requires Authentication**: Wrapped with `AuthGuard` via Layout

**Información del Vault**:
- ID y dirección del vault
- Detalles completos de la propiedad
- Estado actual con indicador visual
- Precio base
- Dirección del propietario

**Flujos según estado**:

1. **Estado FREE** (Disponible):
   - Muestra `ReservationFlow`
   - Permite crear primera reserva
   - Requiere stake >= precio base

2. **Estado AUCTION** (En subasta):
   - Muestra `AuctionFlow`
   - Tarjeta "Active Auction" con:
     - Booker (primer reservante)
     - Total PYUSD staked
     - Fechas de check-in/check-out
     - Duración de la estancia
   - Formulario para colocar bids
   - Lista de bids activos
   - Acciones del booker (si es el usuario):
     - Check-in
     - Check-out
     - Cancelar reserva
     - Ceder reserva (24h antes del check-in)
   - Acciones de bidders:
     - Retirar bid

3. **Estado OCCUPIED** (Ocupado):
   - Mensaje de propiedad ocupada
   - No permite acciones

### 🏗️ Ownerships (`/ownerships`) - **PROTECTED**
**Componente**: `OwnershipsPage`

**⚠️ Requires Authentication**: Wrapped with `AuthGuard` via Layout

**🎯 NUEVA IMPLEMENTACIÓN**:
- Usa `getOwnerVaults(address)` directamente del factory contract
- No requiere filtrado manual
- Carga solo los vaults del usuario conectado
- Performance mejorado

**Características**:
- 💼 **Wallet Address Display**: Muestra la wallet conectada con botón de copia rápida
- 🏗️ **Create Vault Form**: Formulario completo con tooltips explicativos
- 📋 **Properties List**: Cargada directamente desde el contrato
- ⏳ **Loading States**: Muestra skeleton mientras carga
- 🏘️ **Empty State**: Mensaje amigable si no hay properties

**Wallet Address Section**:
```typescript
- Muestra address completa en formato monospace
- Botón "Copy" para copiar al clipboard
- Explicación: "Use this address as Real Estate Address to receive vault earnings"
- Background azul claro para destacar
```

**Create Vault Form**:
- **Vault ID**: Identificador único (ej: "APT-NYC-101")
- **Property Details**: Descripción de la propiedad (textarea)
- **Base Price**: Precio mínimo en PYUSD (con 6 decimales)
- **Real Estate Address**: 
  - 💡 Tooltip explicativo: "Payment Destination - This wallet address will receive all PYUSD payments"
  - 💼 Botón "Use My Wallet" para auto-rellenar con wallet conectada
  - 📋 Hint: "Use the address shown at the top to receive payments"

**Implementación**:
```typescript
const { useOwnerVaults } = useDigitalHouseFactory()
const { data: ownerVaultIds } = useOwnerVaults(address || '')
// Returns only vaults owned by the user
```

**Estados visuales**:
- ⏳ Loading: "Loading your properties..."
- 🏘️ Empty: "No properties yet - Create your first vault"
- ✅ Loaded: Grid de OwnerVaultCard components

### 📋 Reservations (`/reservations`) - **PROTECTED**
**Componente**: `ReservationsPage` (formerly ReservesPage)

**⚠️ Requires Authentication**: Wrapped with `AuthGuard` via Layout

**🔄 RENAMED**: `/reserves` → `/reservations` para consistencia

**Características**:
- Muestra vaults donde el usuario está participando
- Incluye reservas activas y bids activos

**Criterios de filtrado**:
```typescript
Usuario aparece si:
- Es el booker (primer reservante) con reserva activa
- Tiene bids activos en el vault
```

**Componentes especiales**:
- `useUserVaultParticipation`: Hook que verifica participación
- Maneja tanto formato array como object de contratos
- Debug logs para troubleshooting

### 👤 Profile (`/profile`) - **PROTECTED**
**Componente**: `ProfilePage`

**⚠️ Requires Authentication**: Wrapped with `AuthGuard` via Layout

**✨ NOW IN NAVBAR**: Accessible via navbar link "👤 Profile"

**Información del Usuario**:
- Email de autenticación
- Dirección de wallet
- Tipo de wallet (Privy embedded, MetaMask, etc.)
- Fecha de registro
- ID de usuario de Privy

**Funcionalidades**:
- Ver balances por red:
  - ETH/ARB nativo
  - PYUSD
  - Valor en USD
- Fondear wallet (transfer, bridging, copy address)
- Exportar wallet privada (solo embedded wallets)
- Logout

**Selector de Red**:
- Cambiar entre Mainnet, Arbitrum, Sepolia, Arbitrum Sepolia
- Balances se actualizan automáticamente

---

## 🔐 Sistema de Autenticación

### AuthGuard Component
**Archivo**: `src/components/AuthGuard.tsx`

**Propósito**: Proteger rutas y garantizar que solo usuarios autenticados accedan a las páginas de la app.

**Funcionalidad**:
```typescript
- Verifica autenticación con Privy (ready & authenticated)
- Redirige a landing (/) si no está autenticado
- Muestra loading state mientras verifica
- Permite acceso si está autenticado
```

**Estados**:
1. **Loading**: `!ready` → Muestra spinner "Loading..."
2. **Redirecting**: `ready && !authenticated` → "Redirecting to login..."
3. **Authenticated**: `ready && authenticated` → Renderiza children

**Uso**:
```typescript
<AuthGuard>
  <YourProtectedContent />
</AuthGuard>
```

**Integración**:
- Envuelve el contenido en `Layout.tsx`
- Todas las páginas con Layout están protegidas
- Landing page (`/`) NO usa Layout (pública)

### Flujo de Autenticación Completo

```
┌─────────────────────────────────────────┐
│  1. Usuario visita /                    │
│     → Landing Page (pública)            │
│     → Muestra "Go to App" button        │
└─────────────────┬───────────────────────┘
                  │
                  ▼ Click "Go to App"
┌─────────────────────────────────────────┐
│  2. Privy Login Modal                   │
│     → Email, Google, Phone, etc.        │
│     → Crea/Conecta wallet               │
└─────────────────┬───────────────────────┘
                  │
                  ▼ Authenticated
┌─────────────────────────────────────────┐
│  3. Redirect to /marketplace            │
│     → AuthGuard permite acceso          │
│     → Navbar visible                    │
│     → Wallet conectada                  │
└─────────────────┬───────────────────────┘
                  │
                  ▼ Navegación
┌─────────────────────────────────────────┐
│  4. App Pages (todas protegidas)       │
│     → /marketplace                      │
│     → /ownerships                       │
│     → /reservations                     │
│     → /profile                          │
└─────────────────────────────────────────┘
```

### Páginas Públicas vs Protegidas

**Públicas** (No requieren auth):
- ✅ `/` - Landing Page

**Protegidas** (Requieren auth via AuthGuard):
- 🔒 `/marketplace` - Ver properties
- 🔒 `/ownerships` - Gestionar properties
- 🔒 `/reservations` - Ver reservas
- 🔒 `/profile` - Perfil usuario
- 🔒 `/marketplace/[vaultId]` - Detalle vault

---

## 🧩 Componentes

### 🔐 Componentes de Autenticación

#### `AuthGuard.tsx`
Ya documentado en la sección de Sistema de Autenticación ↑

### 🎨 Componentes de UI

#### `Button.tsx`
Botón reutilizable con variantes y tamaños.

**Props**:
```typescript
{
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
}
```

### 🏦 Componentes de Vault

#### `OwnerVaultCard.tsx` ⭐ NEW - For Property Owners
**Tarjeta completa con toda la información para propietarios de vaults.**

**Uso**: En la página `/ownerships` para mostrar vaults del owner con detalles completos.

**Props**:
```typescript
{
  vaultAddress: Address
  vaultId: string
}
```

**Secciones incluidas**:

1. **👑 Owner Badge Header**
   - Gradient azul/índigo premium
   - Corona indicando propiedad
   - Estado del vault (FREE/AUCTION/OCCUPIED)
   - "You own this property" label

2. **💰 Floor Price** (Green Card)
   - `basePrice` del contrato
   - "Minimum stake required"
   - Formato: XX.XX PYUSD

3. **📦 Current Stake** (Blue Card)
   - `stakeAmount` de reserva activa
   - Status: "Active reservation" / "No stake yet"
   - Formato: XX.XX PYUSD

4. **💎 Additional Value from Bids** (Purple Card - conditional)
   - Solo aparece si hay bids activos
   - Cálculo: `TVL - stakeAmount`
   - Muestra número de bids
   - "Beyond floor price" indicator

5. **🔒 Total Value Locked** (Emerald/Teal Card)
   - Balance real de PYUSD en vault
   - Direct read: `PYUSD.balanceOf(vaultAddress)`
   - Métrica más importante
   - Formato grande: XXX PYUSD

6. **📅 Active Reservation** (Yellow Card - conditional)
   - Solo si `hasActiveReservation === true`
   - Muestra:
     * 👤 Booker: shortened address
     * 🏨 Check-in: formatted date/time
     * 🚪 Check-out: formatted date/time
     * ⏱️ Duration: calculated days

7. **🔑 Access Link**
   - Shareable URL to marketplace page
   - Copy button with feedback
   - Full URL visible en monospace
   - Tip: "Share with potential bookers"

8. **🔧 Vault Address**
   - Contract address completa
   - Para verificación on-chain

9. **👁️ Action Button**
   - Link to public marketplace page
   - "View Public Page"

**Hooks utilizados**:
```typescript
useVaultInfo()       // propertyDetails, basePrice, currentState
useReservation()     // stakeAmount, dates, booker
useAuction()         // activeBids
useReadContract()    // PYUSD balance (TVL)
```

**Cálculos automáticos**:
```typescript
totalValueLocked = PYUSD.balanceOf(vaultAddress)
additionalValue = totalValueLocked - stakeAmount
duration = (checkOutDate - checkInDate) / 86400 // days
accessLink = `${origin}/marketplace/${vaultId}`
```

**Estados visuales**:
- Loading: Skeleton animation
- No reservation: Muestra solo financial info
- Active reservation: Muestra todo + yellow card
- Has bids: Muestra purple card adicional

#### `VaultCard.tsx`
Tarjeta que muestra información resumida de un vault (versión pública).

**Props**:
```typescript
{
  vaultAddress: Address
  vaultId: string
  showManageButton?: boolean
}
```

**Información mostrada**:
- ID del vault
- Detalles de la propiedad
- Estado actual con color
- Precio base
- Dirección del propietario
- Link al detalle

#### `ReservationFlow.tsx`
Flujo completo para crear una reserva.

**Características**:
- Multi-step process:
  1. INPUT - Formulario de datos
  2. APPROVING - Aprobación de PYUSD
  3. CREATING - Creación de reserva
  4. SUCCESS - Confirmación

**Validaciones**:
- Balance suficiente de PYUSD
- Stake amount >= base price
- Fechas válidas (check-in < check-out)
- Aprobación de PYUSD si es necesario

**Horas por Defecto**:
- ⏰ Check-in: **14:00** (2:00 PM)
- ⏰ Check-out: **12:00** (Noon/Mediodía)

**Props**:
```typescript
{
  vaultAddress: Address
  basePrice: bigint
  onSuccess?: () => void
}
```

#### `AuctionFlow.tsx`
Flujo para subastas y gestión de reservas activas.

**Características**:
- Tarjeta "Active Auction" con datos del booker
- Formulario para colocar bids (multi-step con aprobación)
- Lista de bids activos
- Acciones del booker
- Acciones de bidders

**Estados de Bid**:
1. INPUT - Ingresar monto
2. APPROVING - Aprobar PYUSD
3. BIDDING - Colocar bid
4. SUCCESS - Confirmación

**Props**:
```typescript
{
  vaultAddress: Address
  onSuccess?: () => void
}
```

### 🔗 Componentes de Conexión

#### `WalletConnect.tsx`
Botón simple de conexión/desconexión de wallet.

**Funcionalidad**:
- Conectar: Abre modal de Privy
- Desconectar: Logout y desconecta wallet

#### `NetworkSwitcher.tsx`
Selector de red blockchain.

**Redes soportadas**:
- Ethereum Mainnet (1)
- Arbitrum (42161)
- Sepolia Testnet (11155111)
- Arbitrum Sepolia (421614)

**Visual**:
- Dropdown con nombre y chain ID
- Indicador de red actual
- Switching instantáneo

### 💰 Componentes Financieros

#### `BalanceCard.tsx`
Tarjeta que muestra balances del usuario.

**Tokens mostrados**:
- Nativo (ETH en Mainnet/Sepolia, ARB en Arbitrum)
- PYUSD (ERC20)
- Conversión a USD (aproximada)

**Features**:
- Auto-refresh al cambiar de red
- Loading states
- Formato de números con decimales

#### `FundWallet.tsx`
Opciones para fondear la wallet.

**Métodos disponibles** (vía Privy):
- Transfer desde otra wallet
- Bridging entre cadenas
- Copy address para recibir fondos

### 🏭 Componentes de Creación

#### `CreateVault.tsx`
Formulario mejorado para crear nuevos vaults con tooltips y asistencia.

**Props**:
```typescript
{
  userWallet?: `0x${string}`  // Wallet del usuario para auto-rellenar
}
```

**Campos**:
- **Vault ID**: Identificador único (ej: "CASA01", "APT-NYC-101")
- **Property Details**: Descripción detallada (textarea, 3 rows)
- **Base Price**: Precio base en PYUSD (6 decimales, step 0.01)
- **Real Estate Address**: 
  - Wallet que recibirá los pagos
  - 💡 Tooltip interactivo (hover)
  - 💼 Botón "Use My Wallet" para auto-completar
  - 📋 Hint debajo del campo

**Tooltip "What's this?"**:
```
💰 Payment Destination
This wallet address will receive all PYUSD payments from 
reservations and bids. We recommend using your own wallet 
address for easy access to your earnings.
```

**Funcionalidades**:
- Auto-fill con wallet conectada
- Validación de formato de address (0x...)
- Estados visuales: Preparing → Confirming → Success
- Muestra transaction hash
- Mensaje de éxito con checkmark

**Validaciones**:
- Todos los campos requeridos
- Base price > 0
- Address formato válido (0x...)
- ID único (no duplicado)

**Proceso**:
1. Usuario completa formulario
2. Puede usar "Use My Wallet" para Real Estate Address
3. Submit → `createVault(vaultId, details, basePrice, realEstateAddress)`
4. Muestra transaction hash
5. Confirma en blockchain
6. Success message
7. Auto-refresh de la lista de properties

### 📐 Componentes de Layout

#### `Layout.tsx` ⭐ UPDATED
Layout unificado con navbar, AuthGuard y wallet display.

**🔒 INCLUYE AuthGuard**: Todas las páginas que usan Layout están protegidas

**Estructura**:
```
┌──────────────────────────────────────┐
│         HEADER (Sticky)              │
│  Logo | Nav | WalletAddr | Connect   │
├──────────────────────────────────────┤
│                                      │
│      CONTENT (children)              │
│      Protected by AuthGuard          │
│                                      │
└──────────────────────────────────────┘
```

**Navigation Links**:
- 🏗️ **Ownerships** → `/ownerships`
- 📋 **Reservations** → `/reservations` (renamed from Reserves)
- 🏆 **Marketplace** → `/marketplace`
- 👤 **Profile** → `/profile` (NEW in navbar)

**Header Derecha**:
1. **Wallet Address Display** (Desktop only):
   ```
   Connected
   0x123...abc
   ```
2. **WalletConnect Button**: Connect/Disconnect

**Mobile Navigation**:
- Icons + short labels
- 4 links: Own | Book | Market | Profile
- Compact design for small screens

**Props**:
```typescript
{
  children: React.ReactNode
}
```

**Características**:
- ✅ Sticky header (top: 0, z-50)
- ✅ Backdrop blur effect
- ✅ Auth protection via AuthGuard
- ✅ Wallet address display (desktop)
- ✅ Responsive navigation
- ✅ Profile link en navbar

---

## 🪝 Hooks Personalizados

### `useDigitalHouseFactory.ts`
Interactúa con el contrato Factory.

**Funciones read**:
- `allVaultIds` - Lista todos los IDs de vaults
- `useVaultAddress(vaultId)` - Obtiene dirección de un vault
- `useVaultInfo(vaultId)` - Info completa del vault
- `useOwnerVaults(owner)` - Vaults de un propietario

**Funciones write**:
- `createVault(vaultId, details, basePrice, realEstateAddress)` - Crear vault

### `useDigitalHouseVault.ts`
Interactúa con contratos de Vault individuales.

**Funciones read**:
- `getAuctionBids` - Lista de bids
- `basePrice` - Precio base
- `vaultInfo` - Información del vault
- `currentState` - Estado actual (FREE/AUCTION/OCCUPIED)
- `getCurrentReservation` - Reserva activa
- `propertyDetails` - Detalles de la propiedad

**Funciones write**:
- `placeBid(amount)` - Colocar bid
- `withdrawBid(bidIndex)` - Retirar bid
- `cedeReservation(bidIndex)` - Ceder a un bidder
- `createReservation(stake, checkIn, checkOut)` - Crear reserva
- `cancelReservation()` - Cancelar reserva
- `checkIn()` - Hacer check-in
- `checkOut()` - Hacer check-out

### `useVaultInfo.ts`
Hook simplificado para obtener info de un vault.

**Returns**:
```typescript
{
  vaultId: string
  propertyDetails: string
  basePrice: bigint
  owner: Address
  currentState: VaultState
  isLoading: boolean
}
```

**Helper functions**:
- `getVaultStateLabel(state)` - Texto del estado
- `getVaultStateColor(state)` - Color para UI
- `getVaultStateIcon(state)` - Emoji del estado

### `useVaultActions.ts`
Hook consolidado para acciones de vault.

**Returns**:
```typescript
{
  createReservation(stake, checkIn, checkOut): Promise<void>
  placeBid(amount): Promise<void>
  cedeReservation(bidIndex): Promise<void>
  withdrawBid(bidIndex): Promise<void>
  checkIn(): Promise<void>
  checkOut(): Promise<void>
  cancelReservation(): Promise<void>
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash?: Hash
}
```

### `useReservation.ts`
Hook para obtener datos de la reserva activa.

**Returns**:
```typescript
{
  reservation: any
  hasActiveReservation: boolean
  booker: Address
  stakeAmount: bigint
  shares: bigint
  checkInDate: bigint (timestamp)
  checkOutDate: bigint (timestamp)
  nonce: bigint
  isActive: boolean
  isLoading: boolean
  refetch(): void
}
```

**Características**:
- Maneja formato array y object
- Safe parsing de tipos
- Fallbacks para datos undefined

### `useAuction.ts`
Hook para datos de la subasta.

**Returns**:
```typescript
{
  bids: Bid[]
  activeBids: Bid[]
  highestBid: Bid | null
  isLoading: boolean
  refetch(): void
}
```

**Bid Type**:
```typescript
{
  bidder: Address
  amount: bigint
  timestamp: bigint
  isActive: boolean
}
```

### `usePYUSDApproval.ts`
Hook para gestionar aprobaciones de PYUSD.

**Returns**:
```typescript
{
  approve(amount): Promise<void>
  needsApproval(amount): Promise<boolean>
  hasSufficientBalance(amount): boolean
  allowance: bigint
  balance: bigint
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash?: Hash
}
```

**Uso típico**:
```typescript
const { needsApproval, approve, hasSufficientBalance } = usePYUSDApproval(userAddress, spenderAddress)

// Check si necesita aprobación
const needsApprove = await needsApproval(amount)
if (needsApprove) {
  await approve(amount)
}
```

---

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# RPC URLs (opcional, usa públicos por defecto)
NEXT_PUBLIC_MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-key
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/your-key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-key
NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your-key
```

### Privy Dashboard

1. Ir a [dashboard.privy.io](https://dashboard.privy.io)
2. Crear/seleccionar app
3. Configurar:
   - **Allowed domains**: Tu dominio (ej: `www.auktrafi.xyz`, `localhost:3000`)
   - **Allowed origins**: Mismo que domains
   - **Redirect URIs**: `https://tudominio.com/*`
4. Copiar App ID a `.env.local`

### Direcciones de Contratos

En `src/config/wagmi.ts`:

```typescript
export const FACTORY_ADDRESS = {
  [mainnet.id]: '0x...' as `0x${string}`,
  [arbitrum.id]: '0x...' as `0x${string}`,
  [sepolia.id]: '0x...' as `0x${string}`,
  [arbitrumSepolia.id]: '0x...' as `0x${string}`,
}

export const PYUSD_ADDRESS = {
  [mainnet.id]: '0x...' as `0x${string}`,
  [arbitrum.id]: '0x...' as `0x${string}`,
  [sepolia.id]: '0x...' as `0x${string}`,
  [arbitrumSepolia.id]: '0x...' as `0x${string}`,
}
```

---

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/Ekinoxis-evm/auktrafi-frontend.git
cd auktrafi-frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env.local

# Editar .env.local con tus valores
nano .env.local
```

---

## 💻 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### Scripts disponibles

```bash
npm run dev      # Desarrollo en puerto 3000
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linter de código
```

---

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

### Variables de entorno en Vercel

```
NEXT_PUBLIC_PRIVY_APP_ID=xxx
```

### Configuración de Privy para Producción

1. Agregar dominio de producción en "Allowed domains"
2. Agregar origin en "Allowed origins"
3. Agregar redirect URI: `https://tudominio.com/*`

---

## 🐛 Troubleshooting

### Wallet no conecta

- Verificar Privy App ID
- Verificar dominio en Privy Dashboard
- Verificar que no haya errores en consola

### Transacciones fallan

- Verificar balance suficiente (gas + tokens)
- Verificar aprobación de PYUSD
- Verificar parámetros correctos

### Datos no cargan

- Verificar dirección del contrato
- Verificar red seleccionada
- Verificar RPC funcional
- Ver console logs de debug

### Página de Reservas vacía

- Verificar que hay una reserva activa o bid
- Ver console log de `useUserVaultParticipation`
- Verificar formato de datos del contrato

---

## 📝 Notas de Desarrollo

### PYUSD Decimals

PYUSD usa **6 decimales** (no 18 como ETH):

```typescript
// Correcto
const amount = parseUnits('100', 6) // 100 PYUSD

// Incorrecto
const amount = parseUnits('100', 18) // Error!
```

### Timestamps

Los contratos devuelven timestamps en **segundos**, JavaScript usa **milisegundos**:

```typescript
// Convertir para JavaScript Date
const jsTimestamp = Number(contractTimestamp) * 1000
const date = new Date(jsTimestamp)
```

### Check-in / Check-out Times

Las horas están **predefinidas** en el sistema:

```typescript
// Check-in siempre a las 14:00 (2:00 PM)
const checkInTimestamp = BigInt(Math.floor(new Date(`${checkInDate}T14:00:00`).getTime() / 1000))

// Check-out siempre a las 12:00 (Noon)
const checkOutTimestamp = BigInt(Math.floor(new Date(`${checkOutDate}T12:00:00`).getTime() / 1000))
```

**Estándar hotelero**:
- 🏨 Check-in: 14:00 (2:00 PM) - Entrada después del mediodía
- 🚪 Check-out: 12:00 (Noon) - Salida antes del mediodía

### Contract Data Formats

Los datos del contrato pueden venir como **array** o **object**:

```typescript
// Siempre manejar ambos casos
if (Array.isArray(data)) {
  value = data[0]
} else if (typeof data === 'object') {
  value = data.field || data[0]
}
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

MIT License - ver archivo LICENSE

---

## 👥 Equipo

- Desarrollado por Ekinoxis
- Repositorio: [github.com/Ekinoxis-evm/auktrafi-frontend](https://github.com/Ekinoxis-evm/auktrafi-frontend)

---

## 📞 Soporte

- Email: support@auktrafi.xyz
- Discord: [Enlace]
- Twitter: [@auktrafi]

---

**Última actualización**: Octubre 2025
