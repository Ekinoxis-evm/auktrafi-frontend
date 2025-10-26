# Transaction Debugging Guide

## For Users Unable to Sign Transactions

If you're experiencing issues where transactions won't sign (wallet doesn't pop up), check the browser console for these debug logs:

### 1. Night Booking Transaction Debug Logs

Look for these logs when trying to book nights:

```
🌙 Starting multi-night booking:
  - vaultId: [parent vault ID]
  - contractAddress: [factory contract address]
  - chainId: [network chain ID]
  - dates: [array of selected dates]
  - count: [number of nights]
  - masterCode: ***[last 4 chars]

🌙 Initiating transaction for night 1 of X:
  - date: [date string]
  - timestamp: [unix timestamp]
  - parentVaultId: [vault ID]
  - contractAddress: [factory address]
  - functionName: "getOrCreateNightVault"
  - args: [parentVaultId, timestamp, masterCode]
```

### 2. Common Issues and Solutions

#### Issue: "Contract address not found for current chain"
**Solution**: 
- Make sure you're connected to Sepolia or Arbitrum Sepolia
- Check that your wallet is on the correct network

#### Issue: "Master access code is required"
**Solution**:
- The parent vault's master access code couldn't be loaded
- Try clicking the "🔄 Retry" button in the confirmation step
- Refresh the page and try again

#### Issue: Transaction doesn't pop up
**Check Console For**:
- Any red "❌" error messages
- The exact error message will help identify the problem

#### Issue: "Invalid parameters" or similar contract errors
**Possible Causes**:
- The dates you selected might not be available anymore
- The parent vault might have restrictions
- Insufficient PYUSD balance (even if approved)

### 3. Master Code Access

#### For Vault Owners:
- Master code is displayed in your vault card on the "My Properties" page
- You can update it using the "✏️ Update" button
- Code must be 4-12 characters

#### For Guests/Reservers:
- Master code is shown after check-in
- Available on the "My Reservations" page
- Copy it using the "📋 Copy" button

### 4. Debug Checklist

Before reporting an issue, please verify:

- [ ] Wallet is connected
- [ ] On correct network (Sepolia or Arbitrum Sepolia)
- [ ] Sufficient PYUSD balance for booking
- [ ] PYUSD approval completed
- [ ] Master access code loaded (check confirmation step)
- [ ] No console errors before transaction attempt
- [ ] Browser allows pop-ups from the site

### 5. Console Commands for Manual Debugging

Open browser console and try:

```javascript
// Check contract address
console.log('Contract:', CONTRACT_ADDRESSES[chainId])

// Check master code
console.log('Master Code Status:', masterCode, hasValidMasterCode)

// Check wallet connection
console.log('Connected Address:', address)
console.log('Connected Chain:', chainId)
```

### 6. Getting Help

When reporting transaction signing issues, please include:

1. Screenshot of browser console showing all logs
2. The exact step where it fails
3. Network you're connected to
4. Browser and wallet you're using
5. The full error message (if any)

