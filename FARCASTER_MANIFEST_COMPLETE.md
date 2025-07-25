# Complete Farcaster Mini App Manifest for EthosRadar

## Current Manifest Analysis

Your current `farcaster.json` uses the **deprecated "frame" structure**. The latest 2025 specification requires the **"miniapp" structure**.

### Issues with Current Manifest:
1. ❌ Uses deprecated `"frame"` wrapper instead of `"miniapp"`
2. ❌ Missing required `accountAssociation` for domain verification
3. ❌ Icon URLs point to `.replit.app` domain instead of `ethosradar.com`
4. ❌ Uses SVG icons instead of required PNG format
5. ❌ Missing proper splash screen configuration
6. ❌ Category should be "social" for trust/reputation tools, not "finance"

---

## ✅ Correct 2025 Manifest Structure

### Manual Manifest Template for EthosRadar

```json
{
  "accountAssociation": {
    "header": "YOUR_BASE64_HEADER_HERE",
    "payload": "YOUR_BASE64_PAYLOAD_HERE", 
    "signature": "YOUR_BASE64_SIGNATURE_HERE"
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
    "requiredChains": ["eip155:1", "eip155:8453"],
    "requiredCapabilities": [
      "miniApp.composeCast",
      "miniApp.openUrl",
      "miniApp.close"
    ]
  }
}
```

---

## 🔧 Step-by-Step Manual Creation Process

### Step 1: Generate Account Association

You need to generate the `accountAssociation` using Farcaster Developer Tools:

1. **Enable Developer Mode** in Warpcast:
   - Go to Settings → Advanced → Enable developer features

2. **Access Domain Manifest Tool**:
   - Go to Settings → Developer → Domains
   - Enter your domain: `ethosradar.com`
   - Click "Generate Domain Manifest"

3. **Copy the Generated Values**:
   ```json
   {
     "accountAssociation": {
       "header": "COPY_FROM_TOOL",
       "payload": "COPY_FROM_TOOL",
       "signature": "COPY_FROM_TOOL"
     }
   }
   ```

### Step 2: Asset Requirements

Your assets are already correctly configured:

✅ **Icon**: `https://ethosradar.com/icon.png` (318KB, 1024x1024 PNG) ✅  
✅ **Splash**: `https://ethosradar.com/splash.png` (36KB, custom branded) ✅  
⚠️ **Hero Image**: Need to create `hero.png` (3:2 aspect ratio, <10MB)

### Step 3: Property Explanations

#### Required Properties:
- **version**: Always "1" for current spec
- **name**: "EthosRadar" (under 32 chars) ✅
- **iconUrl**: Your custom 1024x1024 PNG icon ✅
- **homeUrl**: Main app URL ✅

#### Optional but Recommended:
- **imageUrl**: Hero/preview image (3:2 ratio) - needs creation
- **buttonTitle**: "Scan Trust Network" (action-oriented)
- **splashImageUrl**: Your custom splash screen ✅
- **splashBackgroundColor**: Blue theme color ✅

#### Advanced Features:
- **webhookUrl**: For notifications (already implemented in your app)
- **requiredChains**: Ethereum mainnet + Base chain
- **requiredCapabilities**: SDK methods your app uses

---

## 🎯 Complete Working Manifest

Here's your complete, production-ready manifest:

```json
{
  "accountAssociation": {
    "header": "REPLACE_WITH_GENERATED_HEADER",
    "payload": "REPLACE_WITH_GENERATED_PAYLOAD",
    "signature": "REPLACE_WITH_GENERATED_SIGNATURE"
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
    "requiredChains": [
      "eip155:1",
      "eip155:8453"
    ],
    "requiredCapabilities": [
      "miniApp.composeCast",
      "miniApp.openUrl",
      "miniApp.close"
    ]
  }
}
```

---

## 📋 Deployment Checklist

### Before Publishing:
1. ✅ Generate account association via Warpcast Developer Tools
2. ⚠️ Create hero.png image (3:2 aspect ratio)
3. ✅ Verify all URLs are accessible:
   - https://ethosradar.com/icon.png
   - https://ethosradar.com/splash.png
   - https://ethosradar.com/hero.png (after creation)
4. ✅ Update farcaster.json with new structure
5. ✅ Test manifest at: https://ethosradar.com/.well-known/farcaster.json

### After Publishing:
1. Submit to Farcaster App Store
2. Test in Warpcast Mini App environment
3. Verify webhook functionality
4. Monitor for any validation errors

---

## 🔍 Validation Commands

```bash
# Check manifest accessibility
curl https://ethosradar.com/.well-known/farcaster.json

# Validate JSON structure
cat farcaster.json | jq .

# Check required assets
curl -I https://ethosradar.com/icon.png
curl -I https://ethosradar.com/splash.png
curl -I https://ethosradar.com/hero.png
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Domain verification failed"
**Solution**: Ensure the domain in your account association exactly matches `ethosradar.com`

### Issue 2: "Invalid icon format"
**Solution**: Your PNG icon is already correct (1024x1024, 318KB) ✅

### Issue 3: "Manifest not found"
**Solution**: Verify file is at `/.well-known/farcaster.json` (already implemented) ✅

### Issue 4: "Invalid webhook URL"
**Solution**: Webhook endpoint already exists at `/api/webhook` ✅

---

## 🎯 Your Current Status

### ✅ Already Implemented:
- Custom PNG icon (318KB, 1024x1024)
- Custom splash screen (36KB)
- Proper domain (ethosradar.com)
- Webhook endpoint (/api/webhook)
- Production deployment working

### ⚠️ Needs Update:
- Manifest structure (frame → miniapp)
- Account association generation
- Hero image creation (optional but recommended)

### 🚀 Ready for Production:
Once you generate the account association and update the manifest structure, your Mini App will be ready for Farcaster submission.

---

**Last Updated**: January 23, 2025  
**Specification Version**: Farcaster Mini Apps 2025