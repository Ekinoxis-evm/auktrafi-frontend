# ✅ Privy Configuration Checklist

Use this checklist to verify your Privy App Client is configured correctly.

## 🎯 App ID Verification
    
- [ ] Located at: Configuration → Settings → App info

---

## 🌐 Domain Configuration

### Allowed Domains (WITHOUT https://)

Go to: **Configuration → Basic configuration → Allowed domains**

Required entries (add each one, press Enter, then Save):

- [ ] `www.auktrafi.xyz`
- [ ] `auktrafi.xyz`
- [ ] `localhost:3000`

⚠️ **Format:** Just the domain, NO `https://` or `http://`

**Screenshot Example:**
```
Allowed domains
┌─────────────────────────────────────┐
│ www.auktrafi.xyz                    │
│ auktrafi.xyz                        │
│ localhost:3000                      │
└─────────────────────────────────────┘
```

---

### Allowed Origins (WITH https://)

Go to: **Configuration → Basic configuration → Allowed origins**

Required entries (add each one, press Enter, then Save):

- [ ] `https://www.auktrafi.xyz`
- [ ] `https://auktrafi.xyz`
- [ ] `http://localhost:3000`

⚠️ **Format:** Include `https://` (or `http://` for localhost)

**Screenshot Example:**
```
Allowed origins
┌─────────────────────────────────────┐
│ https://www.auktrafi.xyz            │
│ https://auktrafi.xyz                │
│ http://localhost:3000               │
└─────────────────────────────────────┘
```

---

## 🔐 Login Methods

Go to: **Configuration → Login methods**

Required login methods (must be ENABLED/ACTIVE):

- [ ] **Email** - Status: Active ✅
- [ ] **Wallet** - Status: Active ✅
- [ ] **Google** - Status: Active ✅
- [ ] **Passkey** - Status: Active ✅

If any shows "Disabled" or grayed out:
1. Click on it
2. Toggle to "Enable"
3. Click "Save"

---

## 💼 Embedded Wallets

Go to: **Configuration → Embedded wallets**

- [ ] Embedded wallets: **ENABLED** ✅
- [ ] Create wallet for: "Users without wallets"
- [ ] Wallet type: Ethereum

---

## 🚀 After Configuration

Once you've checked all boxes above:

### 1. Save All Changes
Click **Save** button at the bottom of each section.

### 2. Wait for Propagation
⏱️ Wait **3-5 minutes** for Privy to update their CDN globally.

### 3. Verify in Vercel
Check your Vercel environment variables include:
```
NEXT_PUBLIC_PRIVY_APP_ID=cmh36h6zr00p5ju0di3cmzegm
```

### 4. Clear Browser Cache
- Open: `https://www.auktrafi.xyz`
- Press `F12`
- Right-click refresh button → "Empty Cache and Hard Reload"
- OR use Incognito: `Ctrl/Cmd + Shift + N`

### 5. Test Connection
- Go to: `https://www.auktrafi.xyz`
- Click "Connect with Passkey"
- Modal should open without errors

---

## 🐛 Still Not Working?

### Check Console Errors

Press `F12` → Console tab

**Expected (Good):**
```
✅ Privy App ID configured
🌐 Current Domain: https://www.auktrafi.xyz
✅ Base Account SDK Initialized
```

**Error (Bad):**
```
❌ TypeError: i is not iterable
```

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `i is not iterable` | Domains not configured | Check Allowed Domains & Origins |
| `Invalid app ID` | Wrong App ID in .env | Verify App ID matches |
| `Login method not enabled` | Method disabled in Privy | Enable in Login methods |
| Modal doesn't open | Cache issue | Hard refresh or incognito |

---

## 📸 Need Help?

If still not working, share these screenshots:

1. **Configuration → Allowed domains** (full list)
2. **Configuration → Allowed origins** (full list)
3. **Configuration → Login methods** (enabled methods)
4. **Browser Console** (F12 → Console tab with errors)

And we'll diagnose the exact issue.

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ No console errors about "i is not iterable"
2. ✅ Privy modal opens smoothly
3. ✅ Can login with any method (email, wallet, google, passkey)
4. ✅ Wallet connects and shows balance
5. ✅ No "Application error" page

---

**Last updated:** After deployment to `www.auktrafi.xyz`

