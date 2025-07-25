# EthosRadar Custom Domain Setup Guide

## 🌐 Setting Up ethosradar.com for Farcaster Mini App

### **Step 1: Domain Configuration**

Your Replit app needs to be accessible via `ethosradar.com`. Here are the setup options:

#### **Option A: Replit Custom Domain (Recommended)**
1. Go to your Replit project settings
2. Navigate to "Domains" section  
3. Add custom domain: `ethosradar.com`
4. Follow Replit's DNS configuration instructions
5. Add the required CNAME/A records to your domain registrar

#### **Option B: External Hosting**
Deploy your app to:
- Vercel with custom domain
- Netlify with custom domain  
- AWS/GCP with custom domain
- Any hosting service that supports custom domains

### **Step 2: DNS Records Setup**

Add these DNS records at your domain registrar:

```
Type: CNAME
Name: @ (or root)
Value: [Your-Replit-URL] or hosting provider URL

Type: CNAME  
Name: www
Value: [Your-Replit-URL] or hosting provider URL
```

### **Step 3: SSL Certificate**
Ensure HTTPS is enabled:
- Replit provides automatic SSL for custom domains
- Most hosting providers include free SSL certificates
- Farcaster requires HTTPS for Mini Apps

### **Step 4: Verify Domain Setup**

Test these endpoints once your domain is configured:

```bash
# Test main app
curl -I https://ethosradar.com

# Test Farcaster manifest  
curl https://ethosradar.com/farcaster.json

# Test well-known endpoint
curl https://ethosradar.com/.well-known/farcaster.json

# Test app icon
curl -I https://ethosradar.com/icon.svg
```

### **Step 5: Farcaster Account Association**

Once your domain is live:

1. **Generate Account Association:**
   - Go to: https://farcaster.xyz/~/settings/developer-tools
   - Navigate to **Developer > Domains**
   - Enter domain: `ethosradar.com` (without https://)
   - Click **"Generate Domain Manifest"**
   - Copy the three values: `header`, `payload`, `signature`

2. **Update Your Manifest:**
   Replace the placeholder values in your `/farcaster.json` endpoint with the real values

3. **Verify Account Association:**
   ```bash
   curl https://ethosradar.com/farcaster.json | jq '.accountAssociation'
   ```

### **Step 6: Submit to Farcaster**

With custom domain configured:

1. **Test your manifest:** https://ethosradar.com/farcaster.json
2. **No manual submission needed** - Farcaster automatically discovers your app
3. **Monitor in developer tools:** Track usage and eligibility for rewards

### **Step 7: Update Other Platform Configurations**

**Telegram Mini App:**
```
Bot URL: https://ethosradar.com
Icon URL: https://ethosradar.com/icon.svg
```

**Base/Coinbase Mini App:**
- Uses same Farcaster manifest automatically
- Custom domain provides better branding

## 🔧 Technical Requirements

### **Manifest Endpoints Required:**
- `https://ethosradar.com/farcaster.json` ✓
- `https://ethosradar.com/.well-known/farcaster.json` ✓  
- `https://ethosradar.com/icon.svg` ✓

### **Domain Requirements:**
- Must support HTTPS (SSL certificate)
- Must serve proper Content-Type headers
- Must be accessible without www redirect issues
- Must have stable uptime for Mini App discovery

### **Current Status:**
- ✅ Manifest configured for ethosradar.com
- ✅ Icon endpoint ready
- ✅ Both manifest paths supported
- 🔄 Awaiting domain DNS configuration
- 🔄 Awaiting account association from Farcaster

## 🚀 Next Steps

1. **Configure DNS** for ethosradar.com to point to your hosting
2. **Get account association** from Farcaster developer tools  
3. **Update manifest** with real account association values
4. **Test all endpoints** once domain is live
5. **Your app goes live automatically** on Farcaster

Once your custom domain is configured, EthosRadar will be professionally branded and immediately discoverable across all Mini App platforms!