# 💰 Balance Module Documentation

## Overview

El módulo de balances (`BalanceCard`) proporciona una vista completa de los fondos del usuario con capacidad de cambio de red entre Ethereum Mainnet y Arbitrum.

## Características

### 📊 **Saldos Mostrados**

1. **ETH (Ethereum) / ARB (Arbitrum)**
   - Balance nativo de la red
   - Valor en USD
   - Precio actual por token

2. **PYUSD (PayPal USD)**
   - Balance de stablecoin
   - Valor en USD (siempre $1.00)
   - Total en PYUSD

3. **Balance Total en USD**
   - Suma de todos los tokens
   - Formato: $X,XXX.XX

### 🔄 **Cambio de Red**

El componente permite cambiar entre:
- **Ethereum Mainnet** (producción) / **Sepolia** (desarrollo)
- **Arbitrum** (producción) / **Arbitrum Sepolia** (desarrollo)

**Beneficios:**
- Menores costos de gas en Arbitrum
- Mayor velocidad de transacciones
- Misma funcionalidad en ambas redes

### ⚡ **Actualización en Tiempo Real**

- **Precios**: Se actualizan cada 60 segundos
- **Balances**: Botón de refresh manual
- **Network Switch**: Cambio instantáneo

## Integración

### Ubicaciones

El `BalanceCard` está integrado en:

1. **Admin Panel** (`/admin`)
   ```tsx
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
     <BalanceCard />
     <FundWallet />
   </div>
   ```

2. **Marketplace** (`/marketplace`)
   ```tsx
   <div className="sticky top-8 space-y-6">
     {isConnected && <BalanceCard />}
     <AuctionFilters />
   </div>
   ```

## Tecnologías Utilizadas

### Wagmi Hooks

```typescript
// Balance nativo (ETH/ARB)
const { data: nativeBalance } = useBalance({
  address: address,
})

// Balance de tokens ERC-20 (PYUSD)
const { data: pyusdBalance } = useBalance({
  address: address,
  token: PYUSD_ADDRESSES[chain.id],
})

// Cambio de red
const { switchChain } = useSwitchChain()
switchChain({ chainId: arbitrum.id })
```

### React Query

```typescript
// Precios de tokens (actualización cada minuto)
const { data: prices } = useQuery({
  queryKey: ['token-prices'],
  queryFn: fetchPrices,
  refetchInterval: 60000,
})
```

## Estructura Visual

```
┌─────────────────────────────────────┐
│ 💰 Your Balances        🔄         │
│ Network: Arbitrum Sepolia           │
├─────────────────────────────────────┤
│                                     │
│  Total Balance (USD)                │
│  $3,542.50                          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ETH    Ethereum      0.9842 ETH    │
│         $3,445.70     @ $3,500      │
│                                     │
│  PYUSD  PayPal USD    96.80 PYUSD   │
│         $96.80        @ $1.00       │
│                                     │
├─────────────────────────────────────┤
│  Switch Network                     │
│  [🔷 Ethereum]  [🔵 Arbitrum]       │
├─────────────────────────────────────┤
│  [💸 Add Funds] [📋 Copy Address]  │
├─────────────────────────────────────┤
│  Your Address                       │
│  0x1234...5678                      │
└─────────────────────────────────────┘
```

## Funciones Clave

### 1. **handleFund()**
Abre el modal de Privy para agregar fondos

```typescript
const handleFund = () => {
  if (address) {
    fundWallet({ address })
  }
}
```

### 2. **handleRefresh()**
Actualiza los balances manualmente

```typescript
const handleRefresh = () => {
  refetchNative()
  refetchPyusd()
}
```

### 3. **switchChain()**
Cambia entre redes

```typescript
switchChain({ 
  chainId: process.env.NODE_ENV === 'production' 
    ? arbitrum.id 
    : arbitrumSepolia.id 
})
```

## Configuración de Tokens

### PYUSD Addresses

Definido en `src/config/wagmi.ts`:

```typescript
export const PYUSD_ADDRESSES = {
  [sepolia.id]: '0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9',
  [arbitrumSepolia.id]: '0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1',
  [mainnet.id]: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
  [arbitrum.id]: '0x...', // TODO: Add production address
}
```

## API de Precios

### Integración Futura

Actualmente usa precios mock. Para producción, integrar con:

#### 1. **CoinGecko API**
```typescript
const fetchPrices = async () => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,arbitrum&vs_currencies=usd'
  )
  return response.json()
}
```

#### 2. **CoinMarketCap API**
```typescript
const fetchPrices = async () => {
  const response = await fetch(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY
      }
    }
  )
  return response.json()
}
```

#### 3. **Chainlink Price Feeds** (On-chain)
```typescript
import { useContractRead } from 'wagmi'

const { data: ethPrice } = useContractRead({
  address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
  abi: chainlinkABI,
  functionName: 'latestRoundData',
})
```

## Estilos y Temas

### Gradientes
- Background: `from-indigo-50 to-purple-50`
- Total USD: `border-indigo-200`
- Botones: `from-green-600 to-emerald-600`

### Responsive Design
- Desktop: Grid 2 columnas en Admin
- Tablet/Mobile: Stack vertical

## Mejoras Futuras

### 1. **Más Tokens**
- [ ] USDC
- [ ] USDT
- [ ] DAI
- [ ] Tokens personalizados

### 2. **Gráficos**
- [ ] Histórico de balance
- [ ] Chart de distribución
- [ ] Cambios en 24h

### 3. **Notificaciones**
- [ ] Alertas de balance bajo
- [ ] Cambios de precio significativos
- [ ] Transacciones entrantes

### 4. **Multi-Wallet**
- [ ] Ver balances de múltiples wallets
- [ ] Comparar balances
- [ ] Consolidar vista

### 5. **Export**
- [ ] Exportar histórico a CSV
- [ ] Reportes PDF
- [ ] Tax reporting

## Troubleshooting

### Balance no se actualiza
```typescript
// Forzar actualización
handleRefresh()
```

### Red incorrecta
```typescript
// Verificar conexión
console.log(chain?.id)

// Cambiar manualmente
switchChain({ chainId: targetChainId })
```

### Precio no disponible
```typescript
// Fallback a valores por defecto
const price = prices?.eth || 0
```

## Seguridad

- ✅ No expone claves privadas
- ✅ Solo lectura de balances
- ✅ Wallet connection requerida
- ✅ Validación de red
- ✅ Manejo de errores

## Performance

- **React Query**: Caching automático
- **Stale Time**: 10 segundos
- **Refetch**: Cada 60 segundos (precios)
- **Lazy Loading**: Solo carga cuando conectado

## Conclusión

El módulo de balances proporciona una experiencia completa para que los usuarios:
- Vean sus fondos en tiempo real
- Cambien entre redes fácilmente
- Agreguen fondos cuando necesiten
- Monitoreen su portfolio en USD

Es una pieza fundamental para la experiencia de usuario en Auktrafi.

