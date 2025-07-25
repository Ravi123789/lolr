# Quick Agent Setup Guide: Build TrustScope

## What You're Building
Create **TrustScope** - a desktop-first Web3 trust analytics platform that's different from EthosRadar. Focus on portfolio management and advanced data visualization instead of mobile Mini App features.

## Key Differences from EthosRadar
- ❌ No Farcaster Mini App integration
- ❌ No mobile-first design  
- ✅ Desktop analytics dashboard
- ✅ Multi-wallet portfolio tracking
- ✅ Advanced charts and visualizations
- ✅ Community research features
- ✅ Material-UI components (not shadcn/ui)

## Core Features to Build

### 1. Portfolio Management
- Track multiple wallets in organized portfolios
- Compare trust scores across wallet groups
- Set alerts for score changes
- Export portfolio analysis data

### 2. Advanced Analytics
- Interactive charts with historical data
- Trust network visualization with D3.js
- Score trend predictions
- Risk assessment tools

### 3. Community Features  
- Share research insights
- Collaborative analysis tools
- Public dashboard for findings

## Tech Stack

```
Frontend: React + TypeScript + Material-UI
Backend: Express + PostgreSQL + Redis
Charts: Recharts + D3.js for networks
State: Redux Toolkit + React Query
```

## Essential Resources

### 🔗 Ethos Protocol APIs
- **Main Documentation**: https://developers.ethos.network/
- **API v1** (search, networks): https://developers.ethos.network/api-documentation/api-v2
- **API v2** (scores, profiles): https://developers.ethos.network/api-documentation/api-v1-deprecated

### 📊 R4R (Reciprocal Review) System
- **R4R GitHub**: https://github.com/trust-ethos/ethos-r4r
- **Live R4R App**: https://ethos-r4r.deno.dev/
- **All Trust-Ethos Tools**: https://github.com/trust-ethos

### 🎯 Reference Applications
- **EthosRadar** (for inspiration): https://ethosradar.com
- **What to avoid**: Don't copy the Mini App features, make it desktop-focused

### 🛠 Development Resources
- **React Query**: https://tanstack.com/query/latest
- **Material-UI**: https://mui.com/material-ui/
- **D3.js**: https://d3js.org/
- **Recharts**: https://recharts.org/

## Quick Start Steps

### 1. Project Setup
```bash
# Create new Replit project with Node.js
# Install core packages
npm install react typescript @mui/material express
npm install @tanstack/react-query recharts d3
npm install drizzle-orm @neondatabase/serverless
```

### 2. Database Schema
Create tables for:
- `users` - User accounts and preferences
- `trust_profiles` - Wallet profiles with scores
- `wallet_portfolios` - Portfolio management
- `vouch_analytics` - Detailed vouch tracking
- `community_insights` - User research sharing

### 3. API Integration
- Connect to Ethos V1 API for trust networks
- Connect to Ethos V2 API for user profiles and scores
- Add CoinGecko for ETH price conversion
- Implement caching with Redis

### 4. Frontend Components
- Portfolio dashboard with charts
- Trust score visualizations
- Network graph with D3.js
- Community insights interface

## Key Implementation Notes

### Authentication & Data
- Use real Ethos Protocol data only
- No mock or placeholder data
- Implement proper error handling
- Add rate limiting for API calls

### UI/UX Design
- Desktop-first responsive design
- Rich data visualizations
- Clean Material-UI components
- Professional analytics interface

### Performance
- Cache frequently accessed data
- Optimize database queries
- Lazy load heavy visualizations
- Background data updates

## Success Criteria

✅ Multi-wallet portfolio tracking works  
✅ Real-time trust score charts display  
✅ Interactive network graphs render  
✅ Community insights can be shared  
✅ Export functionality works  
✅ All data comes from authentic APIs  
✅ Desktop-optimized interface  

## Example API Calls

```javascript
// Get user profile
fetch('https://api.ethos.network/api/v2/users/by/address/0x...')

// Get trust network
fetch('https://api.ethos.network/api/v1/network/0x.../connections')

// Search users
fetch('https://api.ethos.network/api/v2/search/users?query=vitalik')
```

## Development Tips

1. **Start Simple**: Build basic portfolio tracking first
2. **Add Charts**: Implement score visualization early
3. **Network Graphs**: Use D3.js for trust network visualization
4. **Community**: Add sharing features last
5. **Test Thoroughly**: Verify all API integrations work

## Reference Architecture

Look at EthosRadar.com for inspiration but make yours:
- More focused on analytics
- Better for portfolio management
- Desktop-optimized interface
- Community-driven insights

Start building and iterate based on user feedback!