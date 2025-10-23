# 📊 Vault Management Module

## Overview

El módulo de gestión de vaults permite a los administradores visualizar y gestionar las pujas (bids) realizadas en sus vaults, incluyendo la capacidad de transferir bids entre participantes.

## 🎯 Funcionalidades Implementadas

### 1. **Página de Gestión de Vault** (`/admin/vault/[vaultId]`)

Página dedicada para gestionar un vault específico con:
- ✅ Información completa del vault (ID, precio base, dirección del inmueble)
- ✅ Estado del vault (activo/inactivo)
- ✅ Estadísticas en tiempo real (total bids, highest bid)
- ✅ Acciones rápidas (refresh, analytics, pause/activate)

### 2. **Lista de Bids** (`BidsList.tsx`)

Componente visual para mostrar todas las pujas:
- ✅ **Ranking visual**: 🏆 1st, 🥈 2nd, 🥉 3rd
- ✅ **Información detallada**: Dirección del bidder, monto, timestamp
- ✅ **Estado de bid**: Active/Inactive
- ✅ **Ordenamiento**: Highest bid first
- ✅ **Diseño destacado**: Highest bid con fondo verde
- ✅ **Acciones por bid**: Transfer Bid, View Details

### 3. **Modal de Transferencia** (`TransferBidModal.tsx`)

Interfaz completa para transferir bids:
- ✅ **Validación de dirección**: Verifica formato Ethereum válido (0x...)
- ✅ **Información del bid actual**: Vault ID, monto, bidder actual
- ✅ **Campo de razón**: Opcional, para documentar la transferencia
- ✅ **Resumen visual**: From → To con iconos
- ✅ **Advertencias**: Información importante antes de transferir
- ✅ **Confirmación**: Botón con loading state

### 4. **Componente de Gestión** (`VaultManagement.tsx`)

Coordinador principal que integra:
- ✅ Información del vault (desde contract)
- ✅ Lista de bids
- ✅ Modal de transferencia
- ✅ Estadísticas y analytics
- ✅ Quick actions

## 📁 Estructura de Archivos

```
src/
├── app/
│   └── admin/
│       └── vault/
│           └── [vaultId]/
│               └── page.tsx          # Página principal de gestión
├── components/
│   ├── VaultManagement.tsx           # Componente coordinador
│   ├── BidsList.tsx                  # Lista de bids
│   ├── TransferBidModal.tsx          # Modal de transferencia
│   └── VaultList.tsx                 # Lista de vaults (actualizado)
```

## 🎨 UI/UX Design

### Color Scheme

- **Highest Bid**: Verde (`bg-green-50`, `border-green-200`)
- **Rankings**:
  - 1st: `bg-green-600` 🏆
  - 2nd: `bg-gray-400` 🥈
  - 3rd: `bg-orange-400` 🥉
- **Transfer Button**: Azul (`bg-blue-600`)
- **Status Active**: Verde (`text-green-600`)
- **Status Inactive**: Gris (`text-gray-500`)

### Layout

```
┌─────────────────────────────────────────────┐
│ 🏠 Vault Header                             │
│ ├─ Vault ID: NIDOSTAKE                     │
│ ├─ Status: ✓ Active                        │
│ ├─ Base Price: $1000 PYUSD                │
│ ├─ Total Bids: 3                           │
│ └─ Highest Bid: $2000                      │
├─────────────────────────────────────────────┤
│ Quick Actions                               │
│ [🔄 Refresh] [📊 Analytics] [⏸️ Pause]      │
├─────────────────────────────────────────────┤
│ 📋 Bids Management                          │
│ ┌───────────────────────────────────────┐  │
│ │ 🏆 HIGHEST │ ● Active                 │  │
│ │ 0x1234...5678                         │  │
│ │ $2000 PYUSD │ Oct 23, 2025 2:30 PM   │  │
│ │ [🔄 Transfer Bid] [📋 View Details]    │  │
│ └───────────────────────────────────────┘  │
│ ┌───────────────────────────────────────┐  │
│ │ 🥈 2nd │ ● Active                     │  │
│ │ 0x2345...6789                         │  │
│ │ $1800 PYUSD │ Oct 23, 2025 1:15 PM   │  │
│ └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## 🔄 Flujo de Usuario

### Ver Bids de un Vault

1. Usuario va a **Admin Panel** (`/admin`)
2. En la lista de vaults, click en **"📊 Manage Bids"**
3. Se abre `/admin/vault/[vaultId]`
4. Ve lista completa de bids con rankings

### Transferir un Bid

1. En la lista de bids, click en **"🔄 Transfer Bid"**
2. Se abre el modal de transferencia
3. Ingresa la dirección del nuevo bidder (0x...)
4. Opcionalmente agrega razón de transferencia
5. Revisa el resumen de transferencia
6. Click en **"🔄 Confirm Transfer"**
7. Transacción se procesa
8. Modal se cierra y lista se actualiza

## 💾 Datos Actuales

### Mock Data

Actualmente usa datos de prueba:

```typescript
const mockBids = [
  {
    bidder: '0x1234567890123456789012345678901234567890',
    amount: '1500',
    timestamp: Date.now() - 86400000,
    status: 'active'
  },
  // ...
]
```

### Integración con Smart Contract

**TODO**: Reemplazar mock data con:
1. **Contract Events**: Leer eventos de `BidPlaced` del contrato
2. **The Graph**: Usar subgraph para queries optimizados
3. **Real-time**: WebSocket para updates en vivo

## 🔧 APIs y Hooks

### useDigitalHouseFactory

Hook existente que se usa:

```typescript
const { useVaultInfo } = useDigitalHouseFactory()
const { data: vaultInfo, refetch } = useVaultInfo(vaultId)
```

**Retorna**:
- `creator`: Address del creador
- `details`: Descripción de la propiedad
- `basePrice`: Precio base en PYUSD
- `realEstateAddress`: Dirección del inmueble
- `active`: Estado del vault

### Funciones a Implementar

```typescript
// En useDigitalHouseFactory.ts
const getBidsForVault = async (vaultId: string) => {
  // Leer eventos BidPlaced del contrato
  // Retornar array de bids
}

const transferBid = async (
  vaultId: string,
  fromBidder: string,
  toBidder: string
) => {
  // Llamar función de contrato para transferir bid
}
```

## 📋 Interfaz de Datos

### Bid Type

```typescript
interface Bid {
  bidder: string        // Address del bidder
  amount: string        // Monto en PYUSD
  timestamp: number     // Unix timestamp
  status: string        // 'active' | 'inactive' | 'transferred'
}
```

### BidsListProps

```typescript
interface BidsListProps {
  bids: Bid[]
  onTransfer: (bidderAddress: string) => void
}
```

### TransferBidModalProps

```typescript
interface TransferBidModalProps {
  vaultId: string
  bidderAddress: string
  bidAmount: string
  onClose: () => void
}
```

## 🎯 Navegación

### Rutas

- **Lista de Vaults**: `/admin`
- **Gestión de Vault**: `/admin/vault/[vaultId]`
  - Ejemplo: `/admin/vault/NIDOSTAKE`

### Breadcrumb

```
Admin Panel > Vault Management > NIDOSTAKE
```

## 🚀 Siguientes Pasos

### Funcionalidades Pendientes

1. **Integración con Smart Contract**
   - [ ] Leer bids reales del contrato
   - [ ] Implementar función de transferencia
   - [ ] Manejar estados de transacción

2. **Analytics Dashboard**
   - [ ] Gráficos de histórico de bids
   - [ ] Estadísticas avanzadas
   - [ ] Export de datos

3. **Real-time Updates**
   - [ ] WebSocket para bids en vivo
   - [ ] Notificaciones de nuevos bids
   - [ ] Auto-refresh inteligente

4. **Filtros y Búsqueda**
   - [ ] Filtrar por rango de monto
   - [ ] Buscar por dirección de bidder
   - [ ] Ordenar por diferentes campos

5. **Historial de Transferencias**
   - [ ] Log de todas las transferencias
   - [ ] Razones documentadas
   - [ ] Timeline visual

6. **Permisos y Roles**
   - [ ] Solo owner puede transferir bids
   - [ ] Verificar permisos antes de acciones
   - [ ] Audit log de acciones

## 🔐 Seguridad

### Validaciones Implementadas

- ✅ Validación de formato de dirección Ethereum (42 chars, starts with 0x)
- ✅ Verificación de wallet conectada
- ✅ Advertencias antes de transferencia
- ✅ Loading states para prevenir doble-click

### Validaciones Pendientes

- [ ] Verificar que el usuario es el owner del vault
- [ ] Confirmar que la dirección destino no es el mismo bidder
- [ ] Validar que el bid existe y está activo
- [ ] Límite de rate para prevenir spam

## 📱 Responsive Design

El módulo es completamente responsive:

- **Desktop**: Grid de 3 columnas para información de bids
- **Tablet**: Grid de 2 columnas
- **Mobile**: Stack vertical con scroll

## 🎨 Componentes Reutilizables

Usa componentes existentes:
- `Button` - Botones con variants (default, outline)
- `WalletConnect` - Header de conexión
- `Link` (Next.js) - Navegación

## 📚 Referencias

- **Admin Panel**: `/admin`
- **Vault List**: `src/components/VaultList.tsx`
- **Contract Hook**: `src/hooks/useDigitalHouseFactory.ts`
- **Contract ABI**: `src/contracts/DigitalHouseFactory.json`

---

## 🎉 Resumen

El módulo de gestión de vaults está completamente implementado con:
- ✅ UI/UX profesional y moderna
- ✅ Visualización clara de bids con rankings
- ✅ Sistema de transferencia de bids
- ✅ Validaciones y seguridad
- ✅ Diseño responsive
- ⏳ Listo para integración con smart contract

**Próximo paso**: Conectar con el smart contract para reemplazar mock data con datos reales.

