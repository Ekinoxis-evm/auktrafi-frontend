# 📚 Auktrafi Documentation

Welcome to the Auktrafi documentation! This directory contains comprehensive guides for understanding, setting up, and troubleshooting the platform.

## 📖 Core Documentation

### [Architecture Overview](./ARCHITECTURE.md)
Complete system architecture including:
- Module structure (Admin Panel, Marketplace, Landing Page)
- Component hierarchy
- Data flow and state management
- Smart contract integration
- Technology stack breakdown

### [Balance Module](./BALANCE_MODULE.md)
Multi-token balance management:
- ETH, ARB, PYUSD balance tracking
- USD conversion and display
- Network switching (Ethereum ↔ Arbitrum)
- Funding integration
- Price feed implementation

### [Vault Management](./VAULT_MANAGEMENT.md)
Vault creation and bidding system:
- Create and manage property vaults
- View and track bids
- Transfer bids between participants
- Admin controls and permissions
- Security considerations

### [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
Technical implementation details:
- Component implementations
- Hook usage patterns
- State management strategies
- API integration
- Performance optimizations

---

## ⚙️ Setup & Configuration

### [Vercel Deployment](./setup/VERCEL_SETUP.md)
Step-by-step deployment guide:
- Environment variable setup
- Build configuration
- Domain configuration
- Continuous deployment
- Troubleshooting deployment issues

### [Privy Domain Configuration](./setup/PRIVY_DOMAIN_CONFIG.md)
Configure Privy authentication:
- Allowed Domains setup
- Allowed Origins configuration
- Redirect URIs
- Testing authentication
- Common domain configuration errors

### [Privy App Client Setup](./setup/PRIVY_APP_CLIENT_SETUP.md)
Complete Privy setup guide:
- Create Privy account
- Configure app client
- Set up login methods
- Enable funding options
- Security best practices

### [Cache Troubleshooting](./setup/CLEAR_CACHE.md) 🚨
**Fix wallet connection issues:**
- Clear browser cache effectively
- Diagnose Privy errors
- Verify domain configuration
- Force Vercel redeploy
- Step-by-step debugging

---

## 🔍 Quick Links by Task

### I want to...

**Deploy to production**
1. [Vercel Deployment](./setup/VERCEL_SETUP.md)
2. [Privy Domain Config](./setup/PRIVY_DOMAIN_CONFIG.md)
3. [Cache Troubleshooting](./setup/CLEAR_CACHE.md) (if issues)

**Understand the architecture**
1. [Architecture Overview](./ARCHITECTURE.md)
2. [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

**Set up authentication**
1. [Privy App Client Setup](./setup/PRIVY_APP_CLIENT_SETUP.md)
2. [Privy Domain Config](./setup/PRIVY_DOMAIN_CONFIG.md)

**Fix wallet not connecting**
1. [Cache Troubleshooting](./setup/CLEAR_CACHE.md) ⭐ Start here
2. [Privy Domain Config](./setup/PRIVY_DOMAIN_CONFIG.md)

**Add new features**
1. [Architecture Overview](./ARCHITECTURE.md) - understand structure
2. [Balance Module](./BALANCE_MODULE.md) - example implementation
3. [Vault Management](./VAULT_MANAGEMENT.md) - another example

---

## 🆘 Getting Help

### Common Issues

| Issue | Solution |
|-------|----------|
| "Application error: a client-side exception has occurred" | [Cache Troubleshooting](./setup/CLEAR_CACHE.md) |
| "TypeError: i is not iterable" | [Privy Domain Config](./setup/PRIVY_DOMAIN_CONFIG.md) |
| Wallet not connecting after deployment | [Cache Troubleshooting](./setup/CLEAR_CACHE.md) |
| Build errors on Vercel | [Vercel Deployment](./setup/VERCEL_SETUP.md) |
| Authentication not working | [Privy App Client Setup](./setup/PRIVY_APP_CLIENT_SETUP.md) |

### Support Channels

- **GitHub Issues**: [Report bugs](https://github.com/Ekinoxis-evm/auktrafi-frontend/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/Ekinoxis-evm/auktrafi-frontend/discussions)
- **Documentation**: You're here! 📚

---

## 📝 Contributing to Docs

Found an error or want to improve the documentation?

1. Fork the repository
2. Make your changes
3. Submit a pull request

All documentation improvements are welcome!

---

[← Back to Main README](../README.md)

