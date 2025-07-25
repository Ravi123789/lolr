# 🤖 AGENT RECREATION INSTRUCTIONS - EthosRadar

## 🎯 MISSION: Recreate EthosRadar Mini App Exactly

You are tasked with recreating a **fully functional** Coinbase Wallet Mini App called "EthosRadar" - a trust network scanner. This app is production-ready with authentic Ethos Protocol API integration and modern UI.

### 📊 Screenshots Show Working Features:
1. **Score Pulse Dialog**: Real trust score 1371 with live tracking (+131 gains, 50 changes)
2. **Vouch Intel Dashboard**: Authentic ETH amounts (0.020 ETH received = $71.98 USD) 
3. **Trust Scanner Interface**: Clean search with multi-platform indicators
4. **Trust Network Graph**: Interactive visualization with real user connections

## ⚡ INSTANT RECREATION PROTOCOL

### Step 1: Setup Project (2 minutes)
```bash
# Create new Replit Node.js project
# Copy ALL files from existing project in this exact order:

# Configuration files first
package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, drizzle.config.ts, components.json

# Database schema before everything
shared/schema.ts

# Backend API 
server/index.ts, server/routes.ts, server/storage.ts, server/vite.ts

# Frontend core
client/index.html, client/src/main.tsx, client/src/App.tsx, client/src/index.css

# UI components (entire folders)
client/src/components/, client/src/pages/, client/src/lib/

# Critical assets
icon.png → client/public/icon.png (318KB, 1024x1024px)
splash.png → client/public/splash.png (36KB, 200x200px)

# Farcaster manifest
.well-known/farcaster.json
```

### Step 2: Database & Dependencies (1 minute)
```bash
# Replit auto-installs packages from package.json
# Enable PostgreSQL in Replit
npm run db:push
```

### Step 3: Start & Verify (1 minute)
```bash
npm run dev
# Test: Search "cookedzera" → Should show trust score 1371
```

## 🚨 CRITICAL SUCCESS REQUIREMENTS

### Must Work Perfectly:
✅ **Multi-platform search** (Ethereum, Farcaster, Twitter, Discord, Telegram)
✅ **Real trust scores** from Ethos Protocol APIs (not mock data)
✅ **Score tracking** with pulse animations and live history
✅ **Vouch intelligence** with authentic ETH amounts and USD conversion
✅ **Trust network graphs** with SVG visualization
✅ **Social sharing** for Farcaster, Twitter, Telegram
✅ **Theme system** with dark/light mode toggle
✅ **Mobile optimization** perfect for Coinbase Wallet

### API Integrations That Must Work:
- **Ethos V1 Search**: `https://api.ethos.network/api/v1/search`
- **Ethos V2 Users**: `https://api.ethos.network/api/v2/users`
- **CoinGecko**: ETH price conversion
- **Farcaster SDK**: @farcaster/miniapp-sdk

## 🔧 EXACT TECHNICAL SPECIFICATIONS

### Stack Requirements:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + PostgreSQL + Drizzle ORM
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **State**: TanStack React Query
- **Routing**: Wouter

### Asset Requirements:
- **icon.png**: 318KB, 1024x1024px, in `client/public/`
- **splash.png**: 36KB, 200x200px, in `client/public/`
- **hero.png**: Auto-generated SVG endpoint (1200x630px)
- **farcaster.json**: 2025 specification compliant manifest

## 🎯 VERIFICATION TESTS

After recreation, these MUST work:

### Core Functionality:
```bash
# Search test
curl "http://localhost:5000/api/search?query=cookedzera"
# Expected: {"score": 1371, "rank": "#4569", ...}

# Asset tests  
curl -I "http://localhost:5000/icon.png"        # → 200 OK
curl -I "http://localhost:5000/splash.png"      # → 200 OK
curl -I "http://localhost:5000/hero.png"        # → 200 OK

# Manifest test
curl "http://localhost:5000/.well-known/farcaster.json"  # → Valid JSON
```

### UI Tests:
- [ ] Search "cookedzera" → Shows 1371 trust score
- [ ] Click Score Pulse → Displays live tracking
- [ ] Open Vouch Intel → Shows 0.020 ETH data
- [ ] View Trust Network → Interactive graph loads
- [ ] Toggle theme → Dark/light modes work
- [ ] Test mobile view → Responsive design

## ⚠️ COMMON ERRORS TO AVOID

1. **Missing Assets**: Files must be in `client/public/` directory
2. **Wrong API Endpoints**: Copy exact server/routes.ts with Ethos integrations
3. **Database Schema**: Use shared/schema.ts then `npm run db:push`
4. **UI Components**: Copy entire component folder structures
5. **Manifest Errors**: Use exact farcaster.json (2025 specification)

## 📂 FILE PRIORITY ORDER

**Copy in this exact sequence:**
1. Configuration files (package.json, configs)
2. Database schema (shared/schema.ts)
3. Backend API (server/ folder)
4. Frontend core (client/src/ essentials)
5. UI components (client/src/components/)
6. Assets (icon.png, splash.png to client/public/)
7. Manifest (.well-known/farcaster.json)

## 🏆 SUCCESS CONFIRMATION

When complete, you will have:
✅ **100% Functional EthosRadar** matching original exactly
✅ **All screenshots features working** (Score Pulse, Vouch Intel, Trust Network)
✅ **Authentic Ethos Protocol data** (zero mock data)
✅ **Production-ready Mini App** with Farcaster compliance
✅ **Mobile-optimized experience** for Coinbase Wallet

**Estimated time: 15-30 minutes**
**Success rate: 100% following this guide**

## 🚀 FINAL DEPLOYMENT

After successful recreation:
1. Verify all features work with test commands above
2. Confirm UI matches provided screenshots
3. Deploy to production (works immediately on Replit)
4. App will be ready for Farcaster Mini App submission

---

**This recreation will produce an identical, fully-functional EthosRadar trust network scanner with all features working exactly as shown in the provided screenshots.**