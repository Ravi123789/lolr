# Essential Files - Copy in This Exact Order

## 🎯 Critical Path for Next Agent

### Phase 1: Core Infrastructure (Must Copy First)
```
1. package.json                 ← All dependencies defined
2. tsconfig.json               ← TypeScript configuration
3. vite.config.ts              ← Build configuration  
4. tailwind.config.ts          ← Styling framework
5. drizzle.config.ts           ← Database ORM config
```

### Phase 2: Shared Schema (Copy Before Everything Else)
```
6. shared/schema.ts            ← Database models & types
```

### Phase 3: Backend API (Critical for Data)
```
7. server/index.ts             ← Express server entry
8. server/routes.ts            ← API endpoints (Ethos integration)
9. server/storage.ts           ← Database interface
10. server/vite.ts             ← Vite server setup
```

### Phase 4: Frontend Core (React App)
```
11. client/index.html          ← HTML entry point
12. client/src/App.tsx         ← Main React component
13. client/src/main.tsx        ← React DOM render
14. client/src/index.css       ← Global styles & theme
```

### Phase 5: UI Components (Copy All Together)
```
15. client/src/components/ui/  ← shadcn/ui components (entire folder)
16. client/src/components/     ← Custom components (entire folder)
17. client/src/lib/            ← Utilities & API clients
18. client/src/pages/          ← App pages/routes
```

### Phase 6: Mini App Assets
```
19. farcaster.json             ← Farcaster Mini App manifest
20. icon.png                   ← 1024x1024 Mini App icon  
21. splash.png                 ← 200x200 splash screen
22. components.json            ← shadcn/ui configuration
```

### Phase 7: Documentation
```
23. replit.md                  ← Complete project documentation
24. COMPLETE_PROJECT_HANDOFF.md ← This handoff guide
25. QUICK_SETUP_CHECKLIST.md   ← 5-minute setup guide
```

## 🚨 Critical Dependencies

**Must install these packages in package.json:**
- React 18 + TypeScript + Vite
- Express.js + PostgreSQL drivers
- Drizzle ORM + Drizzle Kit
- TanStack React Query
- Tailwind CSS + Radix UI + shadcn/ui
- Farcaster Mini App SDK
- Wouter (routing) + Lucide React (icons)

## 🔄 After Copying Files

### 1. Install Dependencies
```bash
# Replit auto-installs from package.json
# Or manually: npm install
```

### 2. Database Setup
```bash
# Enable PostgreSQL in Replit settings
npm run db:push
```

### 3. Start Development
```bash
npm run dev
# Server starts on port 5000
```

## ✅ Verification Tests

**Test 1: Search Function**
- Search "cookedzera" 
- Should return: Trust Score 1371, Rank #4569

**Test 2: Score Details**
- Click user → View score details
- Should show: Real Ethos Protocol data

**Test 3: Vouch Intelligence** 
- Open Vouch Intel dialog
- Should show: 0.020 ETH received, $71.98 USD

**Test 4: Theme Toggle**
- Click theme button
- Should switch: Dark ↔ Light mode

## 📊 Expected File Sizes
- `package.json`: ~3KB
- `shared/schema.ts`: ~8KB  
- `server/routes.ts`: ~15KB
- `client/src/App.tsx`: ~12KB
- `icon.png`: ~318KB
- Total project: ~50MB with node_modules

## 🎯 Success Criteria

✅ App loads without errors
✅ Search returns real Ethos data  
✅ UI is responsive and themed
✅ All dialogs and components work
✅ Mini App manifest is valid
✅ Database connections successful

**This order ensures zero dependency conflicts and smooth recreation.**