# 🚨 CRITICAL BOOKING FLOW BUG

## The Problem

### Current (BROKEN) Flow:
```
1. Approve PYUSD to FACTORY ❌
2. getOrCreateNightVault() ✅
3. ❌ NEVER calls createReservation()
```

### Result:
- Sub-vault created ✅
- NO reservation/stake created ❌
- User's PYUSD approved to wrong contract ❌

---

## The Correct Flow

### What MUST Happen:
```
For EACH night selected:

1. Call factory.getOrCreateNightVault(vaultId, nightNumber, masterCode)
   → Returns sub-vault address
   
2. Approve PYUSD to SUB-VAULT address (not factory!)
   → User approves sub-vault to pull their PYUSD
   
3. Call subVault.createReservation(stakeAmount, checkInDate, checkOutDate)
   → Creates the actual reservation and stakes PYUSD
```

---

## Required Changes

### 1. Update `useDailyVaultActions.ts`

Add function to get sub-vault address after creation:

```typescript
const getSubVaultAddress = async (nightNumber: number): Promise<Address> => {
  const address = await readContract({
    address: contractAddress,
    abi: DigitalHouseFactoryABI,
    functionName: 'getNightSubVault',
    args: [parentVaultId, BigInt(nightNumber)]
  })
  return address as Address
}
```

### 2. Update `DailyBookingFlow.tsx`

Change to multi-step approval:

```typescript
// For EACH night:
const nightNumber = dateToNightNumber(selectedDate)

// Step 1: Create sub-vault
await createSubVault(nightNumber, masterCode)
await waitForConfirmation()

// Step 2: Get sub-vault address  
const subVaultAddress = await getSubVaultAddress(nightNumber)

// Step 3: Approve PYUSD to SUB-VAULT
await approvePYUSD(subVaultAddress, dailyPrice)
await waitForApprovalConfirmation()

// Step 4: Create reservation on SUB-VAULT
await subVault.createReservation(
  dailyPrice,           // stakeAmount
  checkInTimestamp,     // checkInDate
  checkOutTimestamp     // checkOutDate
)
```

---

## Alternative: Single Transaction Approach

Check if factory has a combined function like:
```solidity
function getOrCreateNightVaultAndReserve(
  string vaultId,
  uint256 nightDate, 
  string masterAccessCode,
  uint256 stakeAmount,
  uint256 checkInDate,
  uint256 checkOutDate
) external
```

If this exists, use it! Otherwise, implement the multi-step flow above.

---

## Urgency: 🔴 CRITICAL

Without this fix:
- ❌ No reservations can be created
- ❌ No staking happens
- ❌ No auction state triggered
- ❌ No payment distribution
- ❌ Entire booking system broken

**This must be fixed immediately!**

