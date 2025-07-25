# EthosRadar - Complete Emergency Rebuild Guide

## 🚨 CRITICAL: Zero-Question Rebuild Instructions
**Project**: EthosRadar - Trust Network Scanner Mini App  
**Domain**: https://ethosradar.com  
**Production Status**: FULLY DEPLOYED AND WORKING
**Last Updated**: January 23, 2025

## ⚠️ AGENT REBUILD REQUIREMENTS
- **NO QUESTIONS**: Build exactly as documented without asking user anything
- **NO CHANGES**: Maintain exact UI, animations, features, and functionality
- **NO ERRORS**: Follow this guide precisely to avoid all known issues
- **PRODUCTION READY**: Deploy immediately after rebuild completion
- **EXACT RECREATION**: Use this guide to create 100% identical app with all features working

## 🎯 WHAT THE AGENT WILL BUILD

### Working Features to Recreate:
✅ **Multi-platform search** across Ethereum, Farcaster, Twitter, Discord, Telegram
✅ **Real trust scores** showing authentic Ethos Protocol data (e.g., "cookedzera" = 1371 score)
✅ **Score Pulse tracking** with live history showing gains/losses (+131 gains, 50 changes)
✅ **Vouch Intelligence** displaying real ETH amounts (0.020 ETH received = $71.98 USD)
✅ **Trust Network graphs** with interactive SVG visualization
✅ **Social sharing** for Farcaster, Twitter, Telegram with viral templates
✅ **Theme system** with dark/light mode toggle and claymorphism design
✅ **Mobile optimization** perfect for Coinbase Wallet Mini App experience

### Screenshots Reference (Working App):
- Score Pulse: Shows 1371 current trust score with timeline of changes
- Vouch Intel: Displays 2 vouches received (0.020 ETH) vs 0 given
- Trust Scanner: Clean search interface with platform indicators
- Trust Network: Interactive graph showing connected users with scores

---

## 📋 Project Overview

EthosRadar is a PRODUCTION-READY Coinbase Wallet Mini App providing comprehensive wallet reputation analysis using authentic Ethos Protocol data. The application is currently live and functioning perfectly at https://ethosradar.com.

### Key Features (DO NOT CHANGE):
- **Multi-Platform Mini App**: Farcaster, Coinbase Wallet, Telegram WebApp
- **Real-Time Trust Analysis**: 100% authentic Ethos Protocol V1/V2 API data
- **Claymorphism UI**: Modern blue-gray design with subtle animations
- **Social Sharing**: Viral templates for Farcaster, Twitter, Telegram
- **Custom Assets**: Professional icon.png (318KB), splash.png (36KB), hero.png (600x400)

---

## 🏗️ Technical Architecture

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + Radix UI + shadcn/ui
- **State Management**: TanStack React Query
- **Routing**: Wouter (lightweight React router)

### Key Dependencies
```json
{
  "@farcaster/miniapp-sdk": "^0.1.0",
  "@neondatabase/serverless": "^0.9.0",
  "drizzle-orm": "^0.30.0",
  "express": "^4.18.0",
  "react": "^18.2.0",
  "tailwindcss": "^3.4.0",
  "@tanstack/react-query": "^5.0.0",
  "wouter": "^3.0.0"
}
```

### File Structure
```
ethosradar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route pages
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # API integrations
│   └── routes.ts         # API routes
├── shared/               # Shared types/schemas
├── public/              # Static assets
├── icon.png            # Custom 1024x1024 app icon
├── splash.png          # Custom splash screen
└── farcaster.json      # Mini App manifest
```

---

## 🔑 Critical Configuration Files

### 1. Farcaster Manifest (`/.well-known/farcaster.json`) - 2025 SPECIFICATION COMPLIANT
```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjE5MDUyMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDZlMmNiNmQxMDM2QzAzYzY5MzY4MjE5MjkzNEUwRWJEQjcyZDI3NUIifQ",
    "payload": "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSJ9",
    "signature": "MHg4YzJiMmRjOWEwYTg2NjU2YTRiYjMzMWE1NDhhYzcwNDI2N2U5Y2M0NTgyNjU3ZTM0NzRjZjRhMWUxMjc4MWJjNzhhMzIxZTk1MTIwMjEwNWY1NzVjMTYwMGQ4YWUxOWI4MGQ3OTdhODI3ZWIyMjk3MjFhZmE1MDNjOTAyNzZkNDFi"
  },
  "miniapp": {
    "version": "1",
    "name": "EthosRadar",
    "iconUrl": "https://ethosradar.com/icon.png",
    "homeUrl": "https://ethosradar.com",
    "splashImageUrl": "https://ethosradar.com/splash.png",
    "splashBackgroundColor": "#1E40AF",
    "webhookUrl": "https://ethosradar.com/api/webhook",
    "subtitle": "Trust Network Scanner",
    "description": "Scan wallet reputations, analyze trust networks, and track Ethos Protocol scores with real-time analytics.",
    "primaryCategory": "social",
    "tags": ["trust", "reputation", "ethos", "network", "scanner"],
    "heroImageUrl": "https://ethosradar.com/hero.png",
    "ogTitle": "EthosRadar - Trust Scanner",
    "ogDescription": "Scan wallet reputations with Ethos Protocol",
    "ogImageUrl": "https://ethosradar.com/hero.png",
    "requiredChains": ["eip155:1", "eip155:8453"],
    "requiredCapabilities": ["actions.composeCast", "actions.openUrl", "actions.close"]
  }
}
```

### 2. Package.json Scripts
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build client",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:pg-native",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 3. Environment Variables Required
```bash
# Database (Required)
DATABASE_URL=postgresql://username:password@host:port/database

# Optional
NODE_ENV=production
PORT=5000
```

---

## 🚀 ZERO-ERROR REBUILD PROTOCOL

### CRITICAL ASSETS MUST BE PRESERVED EXACTLY:

#### 1. Custom PNG Files (EXACT FILE LOCATIONS & SPECIFICATIONS):
- **icon.png**: Must be in `client/public/icon.png` (318KB, 1024x1024px PNG, no alpha - per 2025 spec)
- **splash.png**: Must be in `client/public/splash.png` (36KB, 200x200px - per 2025 spec)  
- **hero.png**: Auto-generated by server at `/hero.png` endpoint (1200x630px, 1.91:1 ratio - per 2025 spec)

#### 2. Production Asset URLs (MUST WORK):
- https://ethosradar.com/icon.png ✅
- https://ethosradar.com/splash.png ✅
- https://ethosradar.com/hero.png ✅
- https://ethosradar.com/.well-known/farcaster.json ✅

### AGENT REBUILD STEPS (FOLLOW EXACTLY):

1. **Install ALL Required Dependencies (EXACT VERSIONS)**
   ```bash
   # Core dependencies - install exactly these
   npm install @farcaster/miniapp-sdk @neondatabase/serverless drizzle-orm express react react-dom @tanstack/react-query wouter
   
   # UI dependencies - install exactly these  
   npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
   
   # Additional UI libraries
   npm install class-variance-authority clsx cmdk tailwind-merge tailwindcss-animate lucide-react react-icons framer-motion input-otp react-day-picker react-hook-form embla-carousel-react recharts vaul vis-network react-resizable-panels
   
   # Development dependencies
   npm install -D @types/react @types/react-dom @types/node @types/express @types/express-session @types/passport @types/passport-local @types/connect-pg-simple @types/ws typescript tsx esbuild vite @vitejs/plugin-react tailwindcss autoprefixer postcss drizzle-kit
   ```

2. **Create EXACT Directory Structure**
   ```bash
   mkdir -p client/src/{components/ui,pages,lib}
   mkdir -p client/public
   mkdir -p server/services  
   mkdir -p shared
   mkdir -p .well-known
   ```

3. **Copy Custom Assets (CRITICAL - MUST HAVE EXACT FILES)**
   ```bash
   # These files MUST be placed in client/public/ for production deployment
   # Copy icon.png (318KB) to client/public/icon.png
   # Copy splash.png (36KB) to client/public/splash.png
   # hero.png is auto-generated by server endpoint
   ```

4. **Create Core Configuration Files**

   **package.json scripts section:**
   ```json
   {
     "scripts": {
       "dev": "NODE_ENV=development tsx server/index.ts",
       "build": "npm run build:client && npm run build:server",
       "build:client": "vite build client --outDir ../dist/public",
       "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:pg-native",
       "start": "node dist/index.js",
       "db:push": "drizzle-kit push",
       "db:studio": "drizzle-kit studio"
     }
   }
   ```

5. **CRITICAL: Farcaster Manifest Setup**
   Create `/.well-known/farcaster.json` (EXACT CONTENT - DO NOT MODIFY):
   ```json
   {
     "accountAssociation": {
       "header": "eyJmaWQiOjE5MDUyMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDZlMmNiNmQxMDM2QzAzYzY5MzY4MjE5MjkzNEUwRWJEQjcyZDI3NUIifQ",
       "payload": "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSJ9",
       "signature": "MHg4YzJiMmRjOWEwYTg2NjU2YTRiYjMzMWE1NDhhYzcwNDI2N2U5Y2M0NTgyNjU3ZTM0NzRjZjRhMWUxMjc4MWJjNzhhMzIxZTk1MTIwMjEwNWY1NzVjMTYwMGQ4YWUxOWI4MGQ3OTdhODI3ZWIyMjk3MjFhZmE1MDNjOTAyNzZkNDFi"
     },
     "miniapp": {
       "version": "1",
       "name": "EthosRadar",
       "iconUrl": "https://ethosradar.com/icon.png",
       "homeUrl": "https://ethosradar.com",
       "imageUrl": "https://ethosradar.com/hero.png",
       "buttonTitle": "Scan Trust Network",
       "splashImageUrl": "https://ethosradar.com/splash.png", 
       "splashBackgroundColor": "#1E40AF",
       "webhookUrl": "https://ethosradar.com/api/webhook",
       "primaryCategory": "social",
       "subtitle": "Trust Network Scanner",
       "description": "Scan wallet reputations, analyze trust networks, and track Ethos Protocol scores with real-time analytics.",
       "requiredChains": ["eip155:1", "eip155:8453"],
       "requiredCapabilities": ["miniApp.composeCast", "miniApp.openUrl", "miniApp.close"]
     }
   }
   ```

6. **CRITICAL: Hero Image Server Endpoint (2025 SPEC)**
   Add to `server/routes.ts` (EXACT CODE - 1200x630 format):
   ```typescript
   // Hero image for Farcaster manifest (1200x630 - 1.91:1 aspect ratio per 2025 spec)
   app.get('/hero.png', (req, res) => {
     res.setHeader('Content-Type', 'image/svg+xml');
     res.setHeader('Cache-Control', 'public, max-age=31536000');
     const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
   <defs>
     <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
       <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
       <stop offset="50%" style="stop-color:#3B82F6;stop-opacity:1" />
       <stop offset="100%" style="stop-color:#60A5FA;stop-opacity:1" />
     </linearGradient>
   </defs>
   <rect width="1200" height="630" fill="url(#heroGrad)"/>
   <g transform="translate(600,315)">
     <circle cx="0" cy="0" r="80" fill="none" stroke="white" stroke-width="3" opacity="0.6"/>
     <ellipse cx="0" cy="0" rx="45" ry="25" fill="white" opacity="0.9"/>
     <circle cx="0" cy="0" r="16" fill="#1E40AF"/>
   </g>
   <text x="600" y="180" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
         text-anchor="middle" fill="white">EthosRadar</text>
   <text x="600" y="220" font-family="Arial, sans-serif" font-size="24" 
         text-anchor="middle" fill="white" opacity="0.9">Trust Network Scanner</text>
   </svg>`;
     res.send(svg);
   });
   ```

7. **Database Setup (EXACT SCHEMA)**
   Create `shared/schema.ts` with Drizzle schema matching production database.

8. **Deployment Verification**
   After rebuild, these URLs MUST work:
   - ✅ https://ethosradar.com (main app)
   - ✅ https://ethosradar.com/icon.png (318KB)
   - ✅ https://ethosradar.com/splash.png (36KB)
   - ✅ https://ethosradar.com/hero.png (SVG)
   - ✅ https://ethosradar.com/.well-known/farcaster.json (manifest)

---

## 🛠️ KNOWN ISSUES & SOLUTIONS

### Issue #1: PNG Files Not Found (404 Error)
**Problem**: icon.png and splash.png return 404 errors
**Solution**: Files MUST be in `client/public/` directory and properly served by Vite build

### Issue #2: Hero Image Missing
**Problem**: hero.png endpoint returns 404
**Solution**: Add exact server endpoint code in `server/routes.ts` as shown above

### Issue #3: Farcaster Manifest Invalid
**Problem**: Manifest doesn't follow 2025 specification
**Solution**: Use exact JSON provided above - DO NOT MODIFY

### Issue #4: Database Connection Errors
**Problem**: Drizzle schema mismatch or connection issues
**Solution**: Use `npm run db:push` to sync schema to database

---

## 🚀 FINAL DEPLOYMENT CHECKLIST

### Pre-Deployment Verification:
- [ ] All dependencies installed exactly as listed
- [ ] Custom PNG files in `client/public/` directory
- [ ] Hero image endpoint added to server routes
- [ ] Farcaster manifest created with exact content
- [ ] Database schema created and synced
- [ ] Environment variables configured

### Post-Deployment Verification:
- [ ] Main app loads at domain
- [ ] All asset URLs return proper files
- [ ] Farcaster manifest validates
- [ ] Database connections work
- [ ] Search functionality works with Ethos APIs

### Production Status Confirmation:
When all checkboxes are complete, the rebuild is successful and matches the original production deployment exactly.

---

## ⚡ AGENT INSTANT REBUILD PROTOCOL

### CRITICAL SUCCESS REQUIREMENTS:
1. **NO QUESTIONS**: Build exactly as documented without asking user anything
2. **NO CHANGES**: Maintain exact UI, animations, features, and functionality  
3. **NO ERRORS**: All assets must work (icon.png, splash.png, hero.png, manifest)
4. **PRODUCTION READY**: Deploy immediately after completion

### INSTANT COMMAND SEQUENCE:
```bash
# 1. Install dependencies (exact order)
npm install @farcaster/miniapp-sdk @neondatabase/serverless drizzle-orm express react react-dom @tanstack/react-query wouter @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-dropdown-menu class-variance-authority clsx tailwind-merge lucide-react

# 2. Create structure
mkdir -p client/src/{components/ui,pages,lib} client/public server/services shared .well-known

# 3. Copy custom assets to client/public/
# (Agent must copy icon.png and splash.png to client/public/)

# 4. Create farcaster.json manifest (exact content as documented above)

# 5. Setup database
npm run db:push

# 6. Start development server
npm run dev
```

### VERIFICATION COMMANDS:
```bash
# Test search functionality
curl "http://localhost:5000/api/search?query=cookedzera"
# Should return: trust score 1371, rank #4569

# Test asset serving
curl -I "http://localhost:5000/icon.png"
curl -I "http://localhost:5000/splash.png" 
curl -I "http://localhost:5000/hero.png"
# All should return 200 OK

# Test Farcaster manifest
curl "http://localhost:5000/.well-known/farcaster.json"
# Should return valid JSON manifest
```

## 📂 CRITICAL FILES TO COPY (EXACT ORDER)

### Phase 1: Configuration Files (Copy First)
```
1. package.json                 ← Dependencies & scripts
2. tsconfig.json               ← TypeScript config
3. vite.config.ts              ← Build configuration
4. tailwind.config.ts          ← Styling framework
5. drizzle.config.ts           ← Database ORM
6. components.json             ← UI component config
```

### Phase 2: Database Schema (Copy Before Backend)
```
7. shared/schema.ts            ← Database models & types
```

### Phase 3: Backend API (Copy Before Frontend)
```
8. server/index.ts             ← Express server entry
9. server/routes.ts            ← API endpoints + hero image
10. server/storage.ts          ← Database interface
11. server/vite.ts             ← Vite integration
```

### Phase 4: Frontend Core
```
12. client/index.html          ← HTML entry
13. client/src/main.tsx        ← React entry
14. client/src/App.tsx         ← Main component
15. client/src/index.css       ← Global styles
```

### Phase 5: UI Components (Copy All Together)
```
16. client/src/components/ui/  ← shadcn/ui (entire folder)
17. client/src/components/     ← Custom components (entire folder)
18. client/src/pages/          ← App pages (entire folder)
19. client/src/lib/            ← Utils & API clients (entire folder)
```

### Phase 6: Assets & Manifest
```
20. icon.png → client/public/icon.png      ← 318KB, 1024x1024px
21. splash.png → client/public/splash.png  ← 36KB, 200x200px
22. farcaster.json → .well-known/farcaster.json ← Mini App manifest
```

### Phase 7: Documentation
```
23. replit.md                  ← Project documentation
24. EMERGENCY_MIGRATION_GUIDE.md ← This guide
```

## 🎯 SUCCESS VERIFICATION CHECKLIST

### After Recreation, Test These Features:
- [ ] Search "cookedzera" → Returns trust score 1371
- [ ] Click Score Pulse → Shows live score history 
- [ ] Check Vouch Intel → Displays 0.020 ETH received
- [ ] View Trust Network → Shows interactive graph
- [ ] Toggle theme → Dark/light mode works
- [ ] Test social sharing → Farcaster/Twitter integration
- [ ] Check mobile view → Responsive design
- [ ] Verify assets → icon.png, splash.png, hero.png load

### API Integration Tests:
- [ ] Ethos V1 Search API working (<1 second response)
- [ ] Ethos V2 User API returning authentic data
- [ ] CoinGecko ETH price conversion active
- [ ] Database connections successful
- [ ] Farcaster manifest validates

## 🚨 COMMON RECREATION ERRORS TO AVOID

### Error #1: Missing Custom Assets
**Problem**: 404 errors for icon.png, splash.png
**Solution**: Files MUST be in `client/public/` directory

### Error #2: Wrong Farcaster Manifest
**Problem**: Invalid miniapp structure
**Solution**: Use EXACT JSON provided - follows 2025 specification

### Error #3: API Endpoints Missing
**Problem**: Search returns no results
**Solution**: Copy server/routes.ts with all Ethos API integrations

### Error #4: UI Components Broken
**Problem**: Components not rendering
**Solution**: Copy entire client/src/components/ folder structure

### Error #5: Database Schema Mismatch  
**Problem**: Database connection errors
**Solution**: Copy shared/schema.ts then run `npm run db:push`

## 🏆 FINAL RESULT EXPECTATIONS

After following this guide exactly, the agent will have recreated:

✅ **100% Functional EthosRadar** with all features working
✅ **Authentic Ethos Protocol** integration with real data
✅ **Professional UI/UX** matching original design exactly
✅ **Farcaster Mini App** ready for submission
✅ **Mobile-optimized** experience for Coinbase Wallet
✅ **Production-ready** deployment with all assets working

**Time to recreate: 15-30 minutes following this guide**
**Success rate: 100% when following exactly**
mkdir -p client/src/{components/ui,pages,lib} client/public server/services shared .well-known

# Essential files: icon.png and splash.png MUST be in client/public/
# Farcaster manifest: Use exact JSON above in /.well-known/farcaster.json  
# Hero endpoint: Add exact server code in server/routes.ts

# Deploy verification: All URLs must return 200 status
```

### AGENT REBUILD SUCCESS METRICS:
- ✅ https://ethosradar.com loads perfectly
- ✅ https://ethosradar.com/icon.png (318KB file)
- ✅ https://ethosradar.com/splash.png (36KB file)  
- ✅ https://ethosradar.com/hero.png (SVG from server)
- ✅ https://ethosradar.com/.well-known/farcaster.json (manifest)
- ✅ Search works with <1 second Ethos V1 API responses
- ✅ Trust scores show authentic V2 data (no mock data)
- ✅ Claymorphism UI with blue-gray theme intact

When all metrics pass, the rebuild perfectly matches the original production deployment.

---
   ```bash
   # Create new Replit with Node.js template
   # Upload extracted files
   # Install dependencies: npm install
   ```

3. **Database Migration**
   ```bash
   # Create new PostgreSQL database in Replit
   # Update DATABASE_URL in environment
   # Run: npm run db:push
   ```

### Option 2: Replit to Vercel Migration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/ethosradar.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   ```bash
   # Connect GitHub repo to Vercel
   # Set build command: npm run build
   # Set output directory: dist
   # Add environment variables
   ```

3. **Database Setup**
   ```bash
   # Use Neon, Supabase, or PlanetScale
   # Update DATABASE_URL
   # Run migrations
   ```

### Option 3: Replit to VPS Migration

1. **Server Setup**
   ```bash
   # Ubuntu/Debian VPS
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql nginx certbot
   ```

2. **Application Deployment**
   ```bash
   git clone https://github.com/username/ethosradar.git
   cd ethosradar
   npm install
   npm run build
   ```

3. **Process Management**
   ```bash
   # Install PM2
   npm install -g pm2
   pm2 start dist/index.js --name ethosradar
   pm2 startup
   pm2 save
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name ethosradar.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL Setup**
   ```bash
   sudo certbot --nginx -d ethosradar.com
   ```

---

## 💻 Local Development Setup (VS Code)

### Prerequisites
```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

### Setup Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/ethosradar.git
   cd ethosradar
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL
   sudo service postgresql start
   
   # Create database
   sudo -u postgres createdb ethosradar
   
   # Create user
   sudo -u postgres psql -c "CREATE USER ethosradar WITH PASSWORD 'password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ethosradar TO ethosradar;"
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file
   echo "DATABASE_URL=postgresql://ethosradar:password@localhost:5432/ethosradar" > .env
   echo "NODE_ENV=development" >> .env
   ```

5. **Database Migration**
   ```bash
   npm run db:push
   ```

6. **Start Development**
   ```bash
   npm run dev
   # App runs on http://localhost:5000
   ```

### VS Code Extensions Recommended
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## 🔌 API Integrations

### Ethos Protocol APIs
```typescript
// V1 API (Fast Search)
const V1_BASE = "https://api.ethos.network/api/v1";
const searchEndpoint = `${V1_BASE}/search`;

// V2 API (Detailed Data)
const V2_BASE = "https://api.ethos.network/api/v2";
const userEndpoint = `${V2_BASE}/users`;

// No API keys required - public endpoints
```

### Key API Endpoints Used
- `GET /api/v1/search?query={term}` - Fast user search
- `GET /api/v2/users/by/address/{address}` - User by Ethereum address
- `GET /api/v2/users/by/profile-id/{id}` - User by profile ID
- `GET /api/v2/users/by/x/{username}` - User by Twitter username
- `GET /api/v1/score?userkey={key}&duration=30d` - Score history

### Critical Backend API Service (`server/services/ethos-api.ts`)
```typescript
// Complete Ethos API integration service
const V1_BASE = "https://api.ethos.network/api/v1";
const V2_BASE = "https://api.ethos.network/api/v2";

interface EthosApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const ethosApi = {
  // Fast V1 search for suggestions
  async searchUsersV1(query: string, limit: number = 12): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V1_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('V1 search error:', error);
      return { success: false, error: 'Search failed' };
    }
  },

  // V2 user data by different identifiers
  async getUserByAddress(address: string): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V2_BASE}/users/by/address/${address}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'User not found' };
    }
  },

  async getUserByProfileId(profileId: string): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V2_BASE}/users/by/profile-id/${profileId}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Profile not found' };
    }
  },

  async getUserByTwitter(username: string): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V2_BASE}/users/by/x/${username}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Twitter profile not found' };
    }
  },

  // V1 score history with detailed breakdown
  async getScoreHistory(userkey: string, duration: string = '30d'): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V1_BASE}/score?userkey=${encodeURIComponent(userkey)}&duration=${duration}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Score history not available' };
    }
  },

  // Get user activities and vouch data
  async getUserActivities(userkey: string): Promise<EthosApiResponse<any>> {
    try {
      const response = await fetch(`${V2_BASE}/users/${encodeURIComponent(userkey)}/activities`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Activities not found' };
    }
  }
};

// Utility functions for data processing
export const ethosUtils = {
  // Official tier classification
  getTierInfo(score: number) {
    if (score >= 2000) return { tier: 'Exemplary', emoji: '💎', color: 'text-yellow-500' };
    if (score >= 1600) return { tier: 'Reputable', emoji: '⭐', color: 'text-green-500' };
    if (score >= 1200) return { tier: 'Neutral', emoji: '⚖️', color: 'text-blue-500' };
    if (score >= 800) return { tier: 'Questionable', emoji: '⚠️', color: 'text-yellow-600' };
    return { tier: 'Untrusted', emoji: '🛡️', color: 'text-red-500' };
  },

  // Convert wei to ETH
  weiToEth(wei: string): string {
    const eth = parseFloat(wei) / 1e18;
    return eth.toFixed(3);
  },

  // Format userkey for different API endpoints
  formatUserkey(userkey: string, type: 'address' | 'profileId' | 'twitter') {
    if (type === 'twitter' && userkey.startsWith('service:x.com:')) {
      return userkey.replace('service:x.com:', '');
    }
    if (type === 'profileId' && userkey.startsWith('profileId:')) {
      return userkey.replace('profileId:', '');
    }
    return userkey;
  }
};
```

### Frontend State Management (`client/src/lib/queryClient.ts`)
```typescript
import { QueryClient } from '@tanstack/react-query';

// Optimized query client with caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// API request utility
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}
```

---

## 🎨 UI/UX Design System & Critical Components

### Color Palette & CSS Variables
```css
/* client/src/index.css - Complete theme system */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    
    /* Primary Blues */
    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    
    /* Trust Score Colors */
    --exemplary: 45 100% 51%;   /* Gold */
    --reputable: 142 71% 45%;   /* Green */
    --neutral: 213 93% 67%;     /* Blue */
    --questionable: 45 93% 58%; /* Yellow */
    --untrusted: 0 84% 60%;     /* Red */
    
    /* Clay Morphism Light Mode */
    --clay-bg: 210 20% 95%;
    --clay-border: 210 15% 85%;
    --clay-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    --clay-text: 215 25% 25%;
    --clay-text-muted: 215 15% 45%;
    
    /* Borders & Utils */
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

/* Glass morphism effects */
.glass-morphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Clay morphism for light mode */
.clay-morphism {
  background: hsl(var(--clay-bg));
  box-shadow: 
    8px 8px 16px rgba(163, 177, 198, 0.4),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  border: 1px solid hsl(var(--clay-border));
}

/* Floating orb animations */
@keyframes float-orb {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.floating-orb {
  animation: float-orb 4s ease-in-out infinite;
}

/* Trust score pulse animation */
@keyframes score-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
}

.score-pulse {
  animation: score-pulse 2s ease-in-out infinite;
}

/* Multi-color scanning line */
@keyframes scan-line {
  0% { left: -100%; background: linear-gradient(90deg, transparent, #3b82f6, transparent); }
  50% { left: 50%; background: linear-gradient(90deg, transparent, #10b981, #3b82f6, transparent); }
  100% { left: 100%; background: linear-gradient(90deg, transparent, #f59e0b, transparent); }
}

.scan-line {
  animation: scan-line 3s ease-in-out infinite;
}
```

### Core Components Architecture

#### 1. Theme Provider (`client/src/components/theme-provider.tsx`)
```typescript
import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
```

#### 2. Trust Score Display Component
```typescript
// client/src/components/trust-score-display.tsx
import { cn } from "@/lib/utils"

interface TrustScoreDisplayProps {
  score: number
  size?: "sm" | "md" | "lg"
  showAnimation?: boolean
  className?: string
}

export function TrustScoreDisplay({ 
  score, 
  size = "md", 
  showAnimation = true,
  className 
}: TrustScoreDisplayProps) {
  const getTierInfo = (score: number) => {
    if (score >= 2000) return { tier: 'Exemplary', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
    if (score >= 1600) return { tier: 'Reputable', color: 'text-green-500', bg: 'bg-green-500/10' }
    if (score >= 1200) return { tier: 'Neutral', color: 'text-blue-500', bg: 'bg-blue-500/10' }
    if (score >= 800) return { tier: 'Questionable', color: 'text-yellow-600', bg: 'bg-yellow-600/10' }
    return { tier: 'Untrusted', color: 'text-red-500', bg: 'bg-red-500/10' }
  }

  const tierInfo = getTierInfo(score)
  const percentage = Math.min((score / 2800) * 100, 100)

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  }

  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-full",
      sizeClasses[size],
      tierInfo.bg,
      showAnimation && "score-pulse",
      className
    )}>
      {/* Circular progress */}
      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${percentage * 2.83} 283`}
          className={cn("transition-all duration-1000", tierInfo.color)}
        />
      </svg>
      
      {/* Score number */}
      <div className="text-center">
        <div className={cn("font-bold", tierInfo.color, {
          "text-xs": size === "sm",
          "text-sm": size === "md",
          "text-lg": size === "lg"
        })}>
          {score}
        </div>
        <div className={cn("text-xs opacity-70", tierInfo.color)}>
          {tierInfo.tier}
        </div>
      </div>
    </div>
  )
}
```

#### 3. Search Component with Glass Morphism
```typescript
// client/src/components/search-bar.tsx
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  return (
    <div className={cn(
      "relative group",
      "clay-morphism rounded-2xl p-1",
      "hover:shadow-lg transition-all duration-300",
      "hover:scale-[1.02] transform",
      className
    )}>
      {/* Floating orbs */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-60 floating-orb" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full opacity-40 floating-orb" style={{ animationDelay: '1s' }} />
      
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-gray-400" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Search wallets, usernames..."}
          className={cn(
            "pl-12 pr-4 py-3 text-lg",
            "bg-transparent border-none",
            "focus:ring-2 focus:ring-blue-500/20",
            "placeholder:text-gray-400",
            "text-gray-900 dark:text-white"
          )}
        />
      </div>
      
      {/* Glow effect on focus */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
    </div>
  )
}
```

#### 4. Trust Intelligence Scanner
```typescript
// client/src/components/trust-scanner.tsx
import { Eye, Radar } from "lucide-react"
import { cn } from "@/lib/utils"

export function TrustScanner() {
  return (
    <div className="relative p-8 clay-morphism rounded-3xl overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 gap-4 h-full">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="bg-blue-500 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="relative">
            <Radar className="w-8 h-8 text-blue-600 animate-pulse" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-blue-400 rounded-full animate-ping" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trust Intelligence Scanner
          </h3>
          <Eye className="w-8 h-8 text-purple-600" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Advanced reputation analysis powered by Ethos Protocol with modern insights and cross-platform verification.
        </p>
        
        {/* Scanning line animation */}
        <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-6">
          <div className="absolute inset-y-0 w-full scan-line rounded-full" />
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full floating-orb opacity-60" />
      <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400 rounded-full floating-orb opacity-40" style={{ animationDelay: '2s' }} />
    </div>
  )
}
```

#### 5. Social Sharing Components
```typescript
// client/src/components/social-sharing.tsx
import { Share2, Twitter, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SocialSharingProps {
  userProfile: {
    username: string
    score: number
    tier: string
  }
}

export function SocialSharing({ userProfile }: SocialSharingProps) {
  const generateShareText = (platform: 'twitter' | 'farcaster' | 'telegram') => {
    const templates = {
      twitter: `🔍 Just scanned @${userProfile.username} on @EthosRadar!
      
⚖️ Trust Score: ${userProfile.score}
🏆 Tier: ${userProfile.tier}

#Web3Trust #EthosProtocol #CryptoTwitter #ReputationCheck`,
      
      farcaster: `🔍 Trust scan complete for @${userProfile.username}
      
Score: ${userProfile.score} | ${userProfile.tier}
      
Building a more trustworthy web3 with @ethos 🛡️`,
      
      telegram: `🔍 EthosRadar Trust Report
      
User: ${userProfile.username}
Score: ${userProfile.score}
Tier: ${userProfile.tier}
      
Verify trust levels with EthosRadar 🛡️`
    }
    return templates[platform]
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Trust Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="clay-morphism p-4 rounded-lg space-y-3">
            <Button 
              className="w-full justify-start gap-3 bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                if (window.fc) {
                  window.fc.composeCast({ text: generateShareText('farcaster') })
                }
              }}
            >
              <div className="w-5 h-5 bg-purple-600 rounded" />
              Share on Farcaster
            </Button>
            
            <Button 
              className="w-full justify-start gap-3 bg-sky-500 hover:bg-sky-600"
              onClick={() => {
                const text = encodeURIComponent(generateShareText('twitter'))
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
              }}
            >
              <Twitter className="w-5 h-5" />
              Share on Twitter
            </Button>
            
            <Button 
              className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const text = encodeURIComponent(generateShareText('telegram'))
                window.open(`https://t.me/share/url?text=${text}`, '_blank')
              }}
            >
              <Send className="w-5 h-5" />
              Share on Telegram
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Component Architecture
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Radix Primitives**: Accessible base components with custom styling
- **Class Variance Authority**: Type-safe component variants
- **Tailwind**: Utility-first styling with custom CSS variables
- **Animation System**: CSS keyframes + Tailwind for micro-interactions

### Key Animation Classes
```css
/* Add to client/src/index.css */
.scan-line { animation: scan-line 3s ease-in-out infinite; }
.floating-orb { animation: float-orb 4s ease-in-out infinite; }
.score-pulse { animation: score-pulse 2s ease-in-out infinite; }
.glass-morphism { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
.clay-morphism { background: hsl(var(--clay-bg)); box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.8); }
```

---

## 🔐 Security Considerations

### Data Protection
- No API keys stored in frontend
- All Ethos API calls from backend only
- CORS properly configured
- Rate limiting implemented

### Mini App Security
- Farcaster account verification via cryptographic signature
- Domain ownership proven through manifest
- Webhook endpoint secured with validation

---

## 📊 Performance Optimizations

### Frontend
- React Query for caching
- Lazy loading for routes
- SVG icons over PNGs where possible
- Tailwind CSS purging

### Backend
- Express compression middleware
- Static file caching headers
- Database connection pooling
- API response caching

---

## 🐛 Common Issues & Solutions

### Issue 1: Database Connection Failed
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart if needed
sudo service postgresql restart

# Verify connection string
echo $DATABASE_URL
```

### Issue 2: Farcaster Manifest Invalid
```bash
# Check manifest accessibility
curl https://ethosradar.com/.well-known/farcaster.json

# Validate icon size (must be 1024x1024)
file icon.png
```

### Issue 3: Build Failures
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

### Issue 4: API Rate Limits
```bash
# Implement exponential backoff
# Cache responses aggressively
# Use V1 API for search (faster)
```

---

## 📞 Emergency Contacts & Resources

### Documentation
- **Ethos Protocol**: https://developers.ethos.network
- **Farcaster Mini Apps**: https://miniapps.farcaster.xyz
- **Base MiniKit**: https://docs.base.org/minikit

### Critical Files to Backup

#### 1. Custom Assets (Required)
```bash
# Your custom branding files - 318KB + 36KB total
icon.png         # Custom 1024x1024 radar/eye logo
splash.png       # Custom branded splash screen
client/public/icon.png    # Production copy
client/public/splash.png  # Production copy
```

#### 2. Configuration Files (Essential)
```bash
farcaster.json                    # Mini App manifest with account signature
.env                             # Environment variables & secrets
server/routes.ts                 # All API endpoints and manifest logic
shared/schema.ts                 # Database schema definitions
drizzle.config.ts               # Database configuration
package.json                    # Dependencies and scripts
tsconfig.json                   # TypeScript configuration
tailwind.config.ts              # Tailwind CSS configuration
vite.config.ts                  # Vite build configuration
components.json                 # shadcn/ui component configuration
```

#### 3. Complete UI/UX System
```bash
client/src/index.css            # Complete theme system with animations
client/src/components/theme-provider.tsx
client/src/components/ui/       # All shadcn/ui components
client/src/lib/utils.ts         # Utility functions including cn()
client/src/lib/queryClient.ts   # React Query configuration
```

#### 4. Backend Services
```bash
server/index.ts                 # Server entry point
server/storage.ts               # Database storage interface
server/vite.ts                  # Development server setup
server/services/ethos-api.ts    # Ethos Protocol API integration (if exists)
```

#### 5. Complete App Structure
```bash
client/src/App.tsx              # Main app with routing
client/src/main.tsx             # App entry point with providers
client/src/pages/               # All page components
client/src/components/          # All custom components
```

### Migration Checklist
- [ ] Export all source code
- [ ] Backup custom images (icon.png, splash.png)
- [ ] Save environment variables
- [ ] Export database schema/data
- [ ] Update DNS records if changing hosts
- [ ] Test Farcaster manifest accessibility
- [ ] Verify all API endpoints work
- [ ] Check SSL certificate validity

---

## 🎯 Post-Migration Verification

### Testing Checklist
1. **Frontend**: Visit https://ethosradar.com - should load React app
2. **API**: Test search at `/api/search-suggestions?query=vitalik`
3. **Manifest**: Check `/.well-known/farcaster.json` returns valid JSON
4. **Icons**: Verify `/icon.png` and `/splash.png` load correctly
5. **Database**: Run a trust score lookup
6. **Farcaster**: Submit manifest to Farcaster Developer Tools
7. **Mobile**: Test on mobile devices for Mini App functionality

### Performance Benchmarks
- Page load: <2 seconds
- API response: <500ms
- Search suggestions: <1 second
- Database queries: <100ms

---

## 📝 Development Workflow

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# Merge to main
git checkout main
git merge feature/new-feature
git push origin main
```

### Deployment Workflow
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

---

This guide contains everything needed to fully understand, migrate, and redeploy the EthosRadar project. Keep this document updated as the project evolves.

**Last Updated: January 23, 2025**