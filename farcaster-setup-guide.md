# Complete Farcaster Mini App Setup Guide

## Step-by-Step Process for /.well-known/farcaster.json

### Current Status ✅
Your app already serves the manifest at:
- `https://ethosradar.com/.well-known/farcaster.json`
- `https://ethosradar.com/farcaster.json` (backup)

### Step 1: Enable Farcaster Developer Mode
1. Go to: https://farcaster.xyz/~/settings/developer-tools
2. Toggle "Developer mode" to ON
3. This unlocks the manifest generation tools

### Step 2: Generate Account Association
1. Navigate to **Developer Tools > Domains**
2. Enter your domain: `ethosradar.com` (no https://)
3. Click **"Generate Domain Manifest"**
4. Copy the generated values:
   - `header`: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9"
   - `payload`: "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSIsInRpbWVzdGFtcCI6MTY..."
   - `signature`: "abc123def456..."

### Step 3: Update Your Manifest
Replace the placeholder values in your server code:

```typescript
"accountAssociation": {
  "header": "REAL_HEADER_FROM_FARCASTER",
  "payload": "REAL_PAYLOAD_FROM_FARCASTER", 
  "signature": "REAL_SIGNATURE_FROM_FARCASTER"
}
```

### Step 4: Test Your Manifest
Once updated, verify your endpoints:

```bash
# Primary endpoint (standard)
curl https://ethosradar.com/.well-known/farcaster.json

# Should return:
{
  "accountAssociation": {
    "header": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9",
    "payload": "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSIs...",
    "signature": "abc123def456..."
  },
  "frame": {
    "version": "1",
    "name": "EthosRadar",
    "iconUrl": "https://ethosradar.com/icon.svg",
    "homeUrl": "https://ethosradar.com",
    ...
  }
}
```

### Step 5: Verify Domain Connection
1. The domain in your account association MUST match exactly
2. Domain: `ethosradar.com` (not www.ethosradar.com)
3. Test that SSL is working (https://)

### Step 6: Automatic Discovery
Once your manifest is live with real account association:
- Your app automatically appears in Farcaster app stores
- No manual submission required
- Eligible for Warpcast Developer Rewards

### Step 7: Monitor Your App
Access analytics at:
- https://farcaster.xyz/~/developers
- View unique users, opens, transactions
- Track reward eligibility

## Required Endpoints for Success:

✅ `/.well-known/farcaster.json` - Primary manifest
✅ `/icon.svg` - App icon (200x200px, PNG/JPG)
✅ Homepage at root domain

## Common Issues:
- Domain mismatch between manifest and account association
- Missing HTTPS/SSL certificate
- Incorrect Content-Type headers
- Invalid JSON format

## Next Action:
1. Configure your custom domain DNS
2. Generate real account association from Farcaster
3. Replace placeholder values
4. Your app goes live immediately!