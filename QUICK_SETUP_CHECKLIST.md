# EthosRadar - 5-Minute Setup Checklist

## ✅ For Next Agent: Instant Recreation Guide

### Step 1: Create Replit Project (30 seconds)
- [ ] New Replit → Node.js template
- [ ] Name: "EthosRadar" or similar

### Step 2: Copy Core Files (2 minutes)
**Priority order - copy these first:**
```
1. package.json           ← Dependencies
2. shared/schema.ts       ← Database models  
3. server/ (entire folder) ← Backend API
4. client/src/ (entire folder) ← React frontend
5. farcaster.json         ← Mini App manifest
6. icon.png & splash.png  ← Assets
```

### Step 3: Database Setup (30 seconds)
- [ ] Enable PostgreSQL in Replit
- [ ] Run: `npm run db:push`

### Step 4: Install & Start (1 minute)
- [ ] Replit auto-installs packages
- [ ] Run: `npm run dev`
- [ ] App loads on port 5000

### Step 5: Verify Working (1 minute)
- [ ] Search "cookedzera" → Shows trust score 1371
- [ ] Click user → See vouch data (0.020 ETH)
- [ ] Check Score Pulse → Live score history
- [ ] Test theme toggle → Dark/light modes

## 🚀 Key Features That Should Work Immediately

✅ **Multi-platform search** (ETH, Farcaster, Twitter, Discord, Telegram)
✅ **Real trust scores** from Ethos Protocol API
✅ **Live vouch data** with ETH amounts and USD conversion
✅ **Score tracking** with gains/losses
✅ **Trust network graphs** with real user connections
✅ **Social sharing** for Farcaster, Twitter, Telegram
✅ **Mobile-optimized** Mini App interface
✅ **Dark/light themes** with claymorphism design

## 🔧 If Something Breaks

**Search not working?**
- Check Ethos API endpoints in `server/routes.ts`
- V1 Search: `https://api.ethos.network/api/v1/search`

**Database errors?**
- Verify PostgreSQL is enabled in Replit
- Re-run: `npm run db:push`

**UI broken?**
- Check Tailwind config in `tailwind.config.ts`
- Verify components in `client/src/components/`

**API timeouts?**
- Ethos APIs are free tier - no keys needed
- Check network connectivity

## 📱 Testing Checklist

Search these users to verify authentic data:
- [ ] "cookedzera" → Score: 1371, Rank: #4569
- [ ] "vitalik.eth" → Should show Ethereum founder data
- [ ] "dwr.eth" → Should show Farcaster founder data

## 🎯 Project Status: 100% Functional

This app is **production-ready** with:
- Real Ethos Protocol API integration (no mock data)
- Complete Farcaster Mini App setup
- Modern responsive UI optimized for mobile
- Authentic trust scores and vouch intelligence
- Live data updates and social sharing

## 📊 Screenshots Reference

The attached screenshots show the working app:
1. Score Pulse dialog with real score tracking
2. Vouch Intel with authentic ETH amounts  
3. Trust Scanner homepage with search
4. Trust Network graph visualization

**Total setup time: ~5 minutes for fully functional app**