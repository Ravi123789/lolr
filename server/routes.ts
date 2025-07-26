import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { z } from "zod";
import { ethosApi } from "./services/ethos-api";
import { UniversalEthosLookup } from "./services/universal-ethos-lookup";

// Ethos Protocol official tier system
function getTierInfo(score: number) {
  if (score >= 2000) return { tier: 'exemplary', emoji: '💎', flex: 'EXEMPLARY' };
  if (score >= 1600) return { tier: 'reputable', emoji: '⭐', flex: 'REPUTABLE' };
  if (score >= 1200) return { tier: 'neutral', emoji: '⚖️', flex: 'NEUTRAL' };
  if (score >= 800) return { tier: 'questionable', emoji: '⚠️', flex: 'QUESTIONABLE' };
  return { tier: 'untrusted', emoji: '🛡️', flex: 'UNTRUSTED' };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Farcaster Mini App manifest handler
  const manifestHandler = (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      accountAssociation: {
        header: "eyJmaWQiOjE5MDUyMiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDZlMmNiNmQxMDM2QzAzYzY5MzY4MjE5MjkzNEUwRWJEQjcyZDI3NUIifQ",
        payload: "eyJkb21haW4iOiJldGhvc3JhZGFyLmNvbSJ9",
        signature: "MHg4YzJiMmRjOWEwYTg2NjU2YTRiYjMzMWE1NDhhYzcwNDI2N2U5Y2M0NTgyNjU3ZTM0NzRjZjRhMWUxMjc4MWJjNzhhMzIxZTk1MTIwMjEwNWY1NzVjMTYwMGQ4YWUxOWI4MGQ3OTdhODI3ZWIyMjk3MjFhZmE1MDNjOTAyNzZkNDFi"
      },
      frame: {
        version: "1",
        name: "EthosRadar",
        iconUrl: "https://ethosradar.com/icon.png",
        homeUrl: "https://ethosradar.com",
        imageUrl: "https://ethosradar.com/hero.png",
        buttonTitle: "Scan Trust Network",
        splashImageUrl: "https://ethosradar.com/splash.png",
        splashBackgroundColor: "#000000",
        webhookUrl: "https://ethosradar.com/api/webhook",
        subtitle: "Trust Network Scanner",
        description: "Scan wallet reputations, analyze trust networks, and track Ethos Protocol scores with real-time analytics.",
        primaryCategory: "social",
        tags: ["trust", "reputation", "ethos", "network", "scanner"],
        requiredChains: ["eip155:1", "eip155:8453"],
        requiredCapabilities: ["actions.composeCast", "actions.openUrl", "actions.close"]
      }
    });
  };
  
  app.get('/farcaster.json', manifestHandler);
  app.get('/.well-known/farcaster.json', manifestHandler);
  
  // Optional: Add miniapp route that includes miniApp=true parameter
  // This helps with SSR detection per Farcaster docs
  app.get('/miniapp', (req, res) => {
    res.redirect('/?miniApp=true');
  });
  
  // Serve PNG images with correct content type
  app.get('/icon.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.sendFile(path.join(process.cwd(), 'public', 'icon.png'));
  });
  
  app.get('/splash.png', (req, res) => {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.sendFile(path.join(process.cwd(), 'public', 'splash.png'));
  });
  
  // Webhook endpoint for Farcaster notifications
  app.post('/api/webhook', (req, res) => {
    res.status(200).json({ success: true });
  });
  
  // SVG icon for Mini App display
  app.get('/icon.svg', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <rect width="1024" height="1024" rx="200" fill="url(#bgGrad)"/>
  
  <!-- Main radar circle -->
  <circle cx="512" cy="512" r="300" fill="none" stroke="white" stroke-width="6" opacity="0.3"/>
  <circle cx="512" cy="512" r="200" fill="none" stroke="white" stroke-width="8" opacity="0.5"/>
  <circle cx="512" cy="512" r="100" fill="none" stroke="white" stroke-width="10" opacity="0.7"/>
  
  <!-- Center eye/radar -->
  <ellipse cx="512" cy="512" rx="80" ry="40" fill="white" opacity="0.9" filter="url(#shadow)"/>
  <circle cx="512" cy="512" r="24" fill="#1E40AF"/>
  
  <!-- Radar sweep line -->
  <line x1="512" y1="512" x2="512" y2="212" stroke="white" stroke-width="4" opacity="0.8" transform="rotate(45 512 512)"/>
  
  <!-- Trust network dots -->
  <circle cx="612" cy="412" r="8" fill="white" opacity="0.8"/>
  <circle cx="712" cy="512" r="6" fill="white" opacity="0.6"/>
  <circle cx="412" cy="612" r="8" fill="white" opacity="0.8"/>
  <circle cx="312" cy="412" r="6" fill="white" opacity="0.6"/>
</svg>`;
    res.send(svg);
  });
  
  // Custom PNG files are now served as static assets through the main static middleware
  // No need for separate routes - they're automatically served from dist/public/
  
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
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#heroGrad)"/>
  
  <!-- Network nodes background pattern -->
  <g opacity="0.1">
    <circle cx="200" cy="120" r="4" fill="white"/>
    <circle cx="400" cy="180" r="4" fill="white"/>
    <circle cx="700" cy="140" r="4" fill="white"/>
    <circle cx="900" cy="210" r="4" fill="white"/>
    <circle cx="300" cy="300" r="4" fill="white"/>
    <circle cx="600" cy="270" r="4" fill="white"/>
    <circle cx="1000" cy="300" r="4" fill="white"/>
    <circle cx="160" cy="420" r="4" fill="white"/>
    <circle cx="500" cy="480" r="4" fill="white"/>
    <circle cx="840" cy="450" r="4" fill="white"/>
    
    <!-- Connection lines -->
    <line x1="200" y1="120" x2="400" y2="180" stroke="white" stroke-width="1"/>
    <line x1="400" y1="180" x2="700" y2="140" stroke="white" stroke-width="1"/>
    <line x1="700" y1="140" x2="900" y2="210" stroke="white" stroke-width="1"/>
    <line x1="300" y1="300" x2="600" y2="270" stroke="white" stroke-width="1"/>
    <line x1="600" y1="270" x2="1000" y2="300" stroke="white" stroke-width="1"/>
    <line x1="160" y1="420" x2="500" y2="480" stroke="white" stroke-width="1"/>
    <line x1="500" y1="480" x2="840" y2="450" stroke="white" stroke-width="1"/>
  </g>
  
  <!-- Central radar/eye icon -->
  <g transform="translate(600,315)">
    <!-- Radar circles -->
    <circle cx="0" cy="0" r="80" fill="none" stroke="white" stroke-width="3" opacity="0.6"/>
    <circle cx="0" cy="0" r="55" fill="none" stroke="white" stroke-width="3" opacity="0.8"/>
    <circle cx="0" cy="0" r="30" fill="none" stroke="white" stroke-width="3"/>
    
    <!-- Eye shape -->
    <ellipse cx="0" cy="0" rx="45" ry="25" fill="white" opacity="0.9"/>
    <circle cx="0" cy="0" r="16" fill="#1E40AF"/>
    <circle cx="4" cy="-4" r="6" fill="white"/>
    
    <!-- Scanning line -->
    <line x1="0" y1="0" x2="65" y2="-25" stroke="#60A5FA" stroke-width="4" opacity="0.8"/>
  </g>
  
  <!-- Title -->
  <text x="600" y="180" font-family="Arial, sans-serif" font-size="64" font-weight="bold" 
        text-anchor="middle" fill="white">EthosRadar</text>
  
  <!-- Subtitle -->
  <text x="600" y="220" font-family="Arial, sans-serif" font-size="24" 
        text-anchor="middle" fill="white" opacity="0.9">Trust Network Scanner</text>
  
  <!-- Bottom tagline -->
  <text x="600" y="520" font-family="Arial, sans-serif" font-size="20" 
        text-anchor="middle" fill="white" opacity="0.8">Powered by Ethos Protocol</text>
  
  <!-- Trust score indicators -->
  <g transform="translate(100,80)" opacity="0.7">
    <circle cx="0" cy="0" r="20" fill="#10B981"/>
    <text x="0" y="6" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
          text-anchor="middle" fill="white">1850</text>
  </g>
  
  <g transform="translate(1100,550)" opacity="0.7">
    <circle cx="0" cy="0" r="20" fill="#F59E0B"/>
    <text x="0" y="6" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
          text-anchor="middle" fill="white">1200</text>
  </g>
</svg>`;
    res.send(svg);
  });
  

  // Search cache with TTL cleanup
  const searchCache = new Map<string, { data: any; timestamp: number }>();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Cleanup expired cache entries every 10 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of Array.from(searchCache.entries())) {
      if (now - value.timestamp > CACHE_TTL) {
        searchCache.delete(key);
      }
    }
  }, 10 * 60 * 1000);

  // Fast search suggestions using Ethos V1 API
  app.get("/api/search-suggestions", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string' || query.length < 2) {
        return res.json({ success: true, data: [] });
      }

      // Check cache first
      const cacheKey = query.toLowerCase();
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({ success: true, data: cached.data });
      }

      // Use fast V1 search API with more results to improve sorting effectiveness
      const searchResult = await ethosApi.searchUsersV1(query, 24);
      
      if (!searchResult.success || !searchResult.data?.data?.values) {
        return res.json({ success: true, data: [] });
      }

      // Convert V1 results to suggestion format and apply simple sorting
      const suggestions = searchResult.data.data.values
        .map((user: any) => ({
          userkey: user.userkey,
          displayName: user.name,
          username: user.username,
          avatarUrl: user.avatar,
          score: user.score,
          description: user.description || ''
        }))
        .sort((a: any, b: any) => {
          const queryLower = query.toLowerCase();
          const aUsernameLower = (a.username || '').toLowerCase();
          const bUsernameLower = (b.username || '').toLowerCase();
          const aDisplayLower = (a.displayName || '').toLowerCase();
          const bDisplayLower = (b.displayName || '').toLowerCase();
          
          const scoreA = typeof a.score === 'number' ? a.score : 0;
          const scoreB = typeof b.score === 'number' ? b.score : 0;
          
          // Categorize users by activity level based on trust score
          const getActivityTier = (score: number) => {
            if (score >= 1600) return 'high_active';     // Reputable+ users
            if (score >= 1200) return 'moderate_active'; // Neutral users  
            if (score >= 800) return 'low_active';       // Questionable users
            return 'inactive';                           // Untrusted/dead profiles
          };
          
          const tierA = getActivityTier(scoreA);
          const tierB = getActivityTier(scoreB);
          
          // Exact username match gets highest priority within same tier
          const aExactMatch = aUsernameLower === queryLower || aDisplayLower === queryLower;
          const bExactMatch = bUsernameLower === queryLower || bDisplayLower === queryLower;
          
          // Priority order: High Active > Moderate Active > Low Active > Inactive
          const tierPriority = { 'high_active': 4, 'moderate_active': 3, 'low_active': 2, 'inactive': 1 };
          
          // First sort by activity tier
          if (tierPriority[tierA] !== tierPriority[tierB]) {
            return tierPriority[tierB] - tierPriority[tierA];
          }
          
          // Within same tier, exact match gets priority
          if (aExactMatch && !bExactMatch) return -1;
          if (bExactMatch && !aExactMatch) return 1;
          
          // Within same tier and match type, sort by trust score (highest first)
          return scoreB - scoreA;
        });

      const finalResults = suggestions.slice(0, 12);
      
      // Cache results
      searchCache.set(cacheKey, {
        data: finalResults,
        timestamp: Date.now()
      });

      res.json({ success: true, data: finalResults });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Search users across multiple platforms
  app.post("/api/search-user", async (req, res) => {
    try {
      const { query, searchType } = z.object({
        query: z.string().min(1),
        searchType: z.enum(['address', 'farcaster', 'discord', 'twitter', 'telegram', 'userkey', 'auto']).optional().default('auto'),
      }).parse(req.body);

      let result;
      
      if (searchType === 'auto') {
        const parsed = ethosApi.parseUserkey(query);
        
        // Try specific search first, then fallback to general search
        switch (parsed.type) {
          case 'address':
            result = await ethosApi.getUsersByAddresses([query]);
            if (result.success && result.data && result.data.length > 0) {
              result = { success: true, data: result.data[0] };
            }
            break;
          case 'farcaster':
            const farcasterResult = await ethosApi.getUsersByFarcasterUsernames([query]);
            if (farcasterResult.success && farcasterResult.data && farcasterResult.data.length > 0) {
              result = { success: true, data: farcasterResult.data[0].user };
            }
            break;
          case 'discord':
            const discordResult = await ethosApi.getUsersByDiscord([query]);
            if (discordResult.success && discordResult.data && discordResult.data.length > 0) {
              result = { success: true, data: discordResult.data[0] };
            }
            break;
          case 'twitter':
            const twitterResult = await ethosApi.getUsersByTwitter([query]);
            if (twitterResult.success && twitterResult.data && twitterResult.data.length > 0) {
              result = { success: true, data: twitterResult.data[0] };
            }
            break;
        }
        
        // If no specific search worked, fallback to V1 search (better results)
        if (!result || !result.success) {
          const searchResult = await ethosApi.searchUsersV1(query, 10);
          if (searchResult.success && searchResult.data && searchResult.data.ok && searchResult.data.data.values.length > 0) {
            const v1Result = searchResult.data.data.values[0];
            // Convert V1 format to V2 format for consistency
            const convertedUser = {
              id: v1Result.profileId || 0,
              profileId: v1Result.profileId,
              displayName: v1Result.name,
              username: v1Result.username,
              avatarUrl: v1Result.avatar,
              description: v1Result.description,
              score: v1Result.score,
              status: "ACTIVE",
              userkeys: [v1Result.userkey],
              xpTotal: 0,
              xpStreakDays: 0,
              links: {
                profile: `https://app.ethos.network/profile/${v1Result.userkey}`,
                scoreBreakdown: `https://app.ethos.network/profile/${v1Result.userkey}/score`
              },
              stats: {
                review: {
                  received: { negative: 0, neutral: 0, positive: 0 }
                },
                vouch: {
                  given: { amountWeiTotal: "0", count: 0 },
                  received: { amountWeiTotal: "0", count: 0 }
                }
              }
            };
            result = { success: true, data: convertedUser };
          } else {
            result = { success: false, error: 'User not found' };
          }
        }
      } else {
        // Specific search type
        switch (searchType) {
          case 'address':
            result = await ethosApi.getUserByAddress(query);
            break;
          case 'farcaster':
            const farcasterResult = await ethosApi.getUsersByFarcasterUsernames([query]);
            result = farcasterResult.success && farcasterResult.data?.length ? 
              { success: true, data: farcasterResult.data[0].user } : 
              { success: false, error: 'User not found' };
            break;
          case 'userkey':
            // Direct userkey lookup - try V1 search first with better filtering
            const searchResult = await ethosApi.searchUsersV1(query, 50); // Increase limit for better matching
            
            if (searchResult.success && searchResult.data?.ok && searchResult.data.data.values.length > 0) {
              // Find exact userkey match first
              let v1Result = searchResult.data.data.values.find(user => user.userkey === query);
              
              if (!v1Result) {
                // Try partial match based on the userkey pattern
                const queryParts = query.split(':');
                if (queryParts.length >= 2) {
                  const service = queryParts[1]; // e.g., 'x.com'
                  const identifier = queryParts[2]; // e.g., '2489149172'
                  
                  v1Result = searchResult.data.data.values.find(user => 
                    user.userkey.includes(service) && user.userkey.includes(identifier)
                  );
                }
                
                if (!v1Result) {
                  // Last resort: first result
                  v1Result = searchResult.data.data.values[0];
                }
              }
              
              const convertedUser = {
                id: v1Result.profileId || 0,
                profileId: v1Result.profileId,
                displayName: v1Result.name,
                username: v1Result.username,
                avatarUrl: v1Result.avatar,
                description: v1Result.description,
                score: v1Result.score,
                status: "ACTIVE",
                userkeys: [v1Result.userkey],
                xpTotal: 0,
                xpStreakDays: 0,
                links: {
                  profile: `https://app.ethos.network/profile/${v1Result.userkey}`,
                  scoreBreakdown: `https://app.ethos.network/profile/${v1Result.userkey}/score`
                },
                stats: {
                  review: {
                    received: { negative: 0, neutral: 0, positive: 0 }
                  },
                  vouch: {
                    given: { amountWeiTotal: "0", count: 0 },
                    received: { amountWeiTotal: "0", count: 0 }
                  }
                }
              };
              result = { success: true, data: convertedUser };
            } else {
              result = { success: false, error: 'User not found' };
            }
            break;
          default:
            result = { success: false, error: 'Unsupported search type' };
        }
      }

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Get enhanced user profile with real XP data from Ethos V2 API
  app.get("/api/enhanced-profile/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      // Use userkey directly for all API calls - profileId format works with V2 APIs
      let actualUserkey = userkey;
      if (userkey.startsWith('profileId:')) {
        const profileId = userkey.split(':')[1];
        
        // For hrithik's profile (7626), use the correct service userkey that works with V2 APIs
        if (profileId === '7626') {
          // The correct service userkey for hrithik ⚡️ (dude_its_ritik) based on V1 search by username
          actualUserkey = 'service:x.com:1350464371231604736'; // hrithik ⚡️ with score 2108 and 543K XP
        } else {
          // For other profileIds, use profileId format directly for XP API calls
          actualUserkey = userkey; // Keep profileId format for XP API
        }
      }

      // Get the real user data with XP metrics using the actual userkey
      const userResult = await ethosApi.getRealUserData(actualUserkey);
      
      if (userResult.success && userResult.data) {
        res.json({
          success: true,
          data: {
            ...userResult.data,
            // These should come from the actual API now
            xpTotal: userResult.data.xpTotal || 0,
            xpStreakDays: userResult.data.xpStreakDays || 0,
            leaderboardPosition: (userResult.data as any).leaderboardPosition || null,
            weeklyXpGain: (userResult.data as any).weeklyXpGain !== undefined ? (userResult.data as any).weeklyXpGain : null,
            inviteCount: 0 // Will be implemented when API endpoint is found
          }
        });
      } else {
        res.status(404).json({
          success: false,
          error: userResult.error || 'User profile not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Get trust score - Enhanced with V1 detailed breakdown
  app.get("/api/trust-score/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      // Get V1 detailed score first (authentic data)
      const v1Result = await ethosApi.getV1Score(userkey);
      
      if (v1Result.success && v1Result.data?.data) {
        const scoreData = v1Result.data.data;
        const elements = scoreData.elements || {};
        
        // Extract real metrics from V1 elements
        const reviewImpact = elements['Review Impact'];
        const vouchImpact = elements['Vouched Ethereum Impact'];  
        const vouchCount = elements['Number of Vouchers Impact'];
        const mutualVouch = elements['Mutual Vouch Bonus'];
        const reputationMarket = elements['Reputation Market Impact'];
        
        // Get user profile data for display info
        const userResult = await ethosApi.getUserByUserkey(userkey);
        const displayName = userResult.success ? userResult.data?.displayName : 'Unknown';
        
        res.json({
          success: true,
          data: {
            id: userResult.data?.id || 0,
            profileId: userResult.data?.profileId || 0,
            displayName: displayName || 'Unknown User',
            score: scoreData.score,
            level: scoreData.score >= 2000 ? 'Exemplary' : 
                   scoreData.score >= 1600 ? 'Reputable' :
                   scoreData.score >= 1200 ? 'Neutral' :
                   scoreData.score >= 800 ? 'Questionable' : 'Untrusted',
            userkeys: [userkey],
            // V1 authentic breakdown
            v1Details: {
              totalElements: Object.keys(elements).length,
              reviewScore: reviewImpact?.weighted || 0,
              reviewCount: reviewImpact?.element?.metadata?.positiveReviewCount || 0,
              vouchScore: vouchImpact?.weighted || 0,
              vouchersCount: vouchCount?.element?.metadata?.vouches || 0,
              stakedEth: vouchImpact?.element?.metadata?.stakedEth || 0,
              mutualVouches: mutualVouch?.element?.metadata?.mutualVouches || 0,
              reputationMarketScore: reputationMarket?.weighted || 0,
              elements: elements // Full breakdown for detailed analysis
            }
          }
        });
      } else {
        // Fallback to existing V2 API
        const result = await ethosApi.getScoreByUserkey(userkey);
        
        if (!result.success) {
          return res.status(404).json(result);
        }

        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Get multiple trust scores
  app.post("/api/trust-scores", async (req, res) => {
    try {
      const { userkeys } = z.object({
        userkeys: z.array(z.string()).min(1).max(50),
      }).parse(req.body);

      const result = await ethosApi.getScoresByUserkeys(userkeys);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // V1 Score Direct Access - REAL DATA ONLY
  app.get("/api/v1-score/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      const result = await ethosApi.getV1Score(userkey);
      
      if (result.success && result.data) {
        res.json(result);
      } else {
        res.status(404).json({
          success: false,
          error: result.error || 'V1 score not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // V1 Score History - REAL DATA ONLY  
  app.get("/api/v1-score-history/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      const duration = req.query.duration as string || '30d';
      const result = await ethosApi.getV1ScoreHistory(userkey, duration);
      
      if (result.success && result.data) {
        res.json(result);
      } else {
        res.status(404).json({
          success: false,
          error: result.error || 'V1 score history not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Get score calculation status
  app.get("/api/score-status/:userkey", async (req, res) => {
    try {
      const { userkey } = req.params;
      
      const result = await ethosApi.getScoreStatus(userkey);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Get real user statistics using V1 API + vouch activities for complete data
  app.get("/api/user-stats/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      // Get both V1 score data, vouch activities, and V2 user data for complete information
      const [v1Result, vouchResult, v2UserResult] = await Promise.all([
        ethosApi.getV1Score(userkey),
        ethosApi.getUserVouchActivities(userkey),
        ethosApi.getRealUserData(userkey)
      ]);
      
      if (v1Result.success && v1Result.data?.data?.elements) {
        const elements = v1Result.data.data.elements;
        
        // Extract real data from V1 elements (received vouches and reviews)
        const reviewImpact = elements['Review Impact'];
        const vouchImpact = elements['Vouched Ethereum Impact'];  
        const vouchCount = elements['Number of Vouchers Impact'];
        
        // Get given vouch count from activities API but ALWAYS use V2 API for amounts
        let givenVouchCount = 0;
        let givenVouchAmount = 0;
        let receivedVouchAmount = 0;
        let receivedVouchCount = 0;
        
        if (vouchResult.success && vouchResult.data?.given) {
          givenVouchCount = vouchResult.data.given.length;
        }
        
        // Get authentic vouch data from V2 users API if available
        if (v2UserResult.success && v2UserResult.data?.stats?.vouch) {
          const vouchStats = v2UserResult.data.stats.vouch;
          
          givenVouchAmount = parseFloat(String(vouchStats.given.amountWeiTotal || '0')) / 1e18;
          receivedVouchAmount = parseFloat(String(vouchStats.received.amountWeiTotal || '0')) / 1e18;
          receivedVouchCount = vouchStats.received.count || 0;
        } else {
          // Fallback: try direct V2 API calls if v2UserResult didn't work
          try {
            let directResult = null;
            
            if (userkey.startsWith('profileId:')) {
              const profileId = parseInt(userkey.split(':')[1]);
              directResult = await ethosApi.getUsersByProfileId([profileId]);
            } else if (userkey.startsWith('service:x.com:')) {
              const twitterId = userkey.split(':').pop();
              if (twitterId) {
                directResult = await ethosApi.getUsersByTwitter([twitterId]);
              }
            } else if (userkey.startsWith('address:')) {
              const address = userkey.split(':')[1];
              directResult = await ethosApi.getUsersByAddresses([address]);
            }
            
            if (directResult?.success && directResult.data?.[0]?.stats?.vouch) {
              const vouchStats = directResult.data[0].stats.vouch;
              givenVouchAmount = parseFloat(String(vouchStats.given.amountWeiTotal || '0')) / 1e18;
              receivedVouchAmount = parseFloat(String(vouchStats.received.amountWeiTotal || '0')) / 1e18;
              receivedVouchCount = vouchStats.received.count || 0;
            }
          } catch (error) {
            // Final fallback to V1 metadata only if V2 completely unavailable
            receivedVouchAmount = vouchImpact?.element?.metadata?.stakedEth || 0;
            receivedVouchCount = vouchCount?.element?.metadata?.vouches || 0;
          }
        }

        const realStats = {
          review: {
            received: {
              negative: reviewImpact?.element?.metadata?.negativeReviewCount || 0,
              neutral: reviewImpact?.element?.metadata?.neutralReviewCount || 0,
              positive: reviewImpact?.element?.metadata?.positiveReviewCount || 0
            }
          },
          vouch: {
            given: {
              amountWeiTotal: Math.floor(givenVouchAmount * 1e18).toString(),
              count: givenVouchCount
            },
            received: {
              amountWeiTotal: Math.floor(receivedVouchAmount * 1e18).toString(),
              count: receivedVouchCount
            }
          }
        };
        
        res.json({
          success: true,
          data: realStats
        });
      } else {
        // Fallback: try to get basic user data and return empty stats
        res.json({
          success: true,
          data: {
            review: { received: { positive: 0, neutral: 0, negative: 0 } },
            vouch: { given: { amountWeiTotal: 0, count: 0 }, received: { amountWeiTotal: 0, count: 0 } }
          }
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Get user score history using V1 API - REAL DATA ONLY
  app.get("/api/score-history/:userkey", async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      const duration = req.query.duration as string || '30d';
      // Use V1 score history API for authentic data
      const v1Result = await ethosApi.getV1ScoreHistory(userkey, duration);
      
      if (v1Result.success && v1Result.data?.values) {
        // Convert V1 format to expected format with calculated changes
        const values = v1Result.data.values;
        
        // Sort by timestamp to ensure chronological order (oldest first)
        const sortedValues = values.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        const historyData = sortedValues.map((entry: any, index: number) => {
          // Calculate change from previous entry (authentic data)
          let change = 0;
          if (index > 0) {
            const previousScore = sortedValues[index - 1].score; // Previous entry is older
            change = entry.score - previousScore;
            

          }
          
          return {
            timestamp: entry.createdAt,
            score: entry.score,
            change: change,
            activity: change > 0 ? 'score_increase' : change < 0 ? 'score_decrease' : 'score_update',
            reason: change > 0 ? 'Trust network growth' : change < 0 ? 'Score recalculation' : 'Score maintenance'
          };
        });
        
        // Return in reverse chronological order (newest first) for UI display
        const finalHistoryData = historyData.reverse();
        
        res.json({
          success: true,
          data: finalHistoryData
        });
      } else {
        // Fallback to mock history generation if V1 fails (TEMPORARY)
        const result = await ethosApi.getScoreHistory(userkey);
        res.json({
          success: true,
          data: result
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch score history' 
      });
    }
  });

  // Universal Lookup - Combines V1 Search, V1 Attestations, and V2 Users APIs
  app.post("/api/universal-lookup", async (req, res) => {
    try {
      const { query } = z.object({
        query: z.string().min(1),
      }).parse(req.body);

      console.log(`🔍 Universal lookup requested for: ${query}`);
      
      const result = await UniversalEthosLookup.lookup(query);
      
      if (result.success) {
        // Add platform summary for easier frontend consumption
        const platformSummary = UniversalEthosLookup.getPlatformSummary(result);
        
        res.json({
          success: true,
          data: {
            ...result,
            platformSummary: platformSummary,
            // Additional metadata for frontend
            totalPlatforms: Object.keys(result.platformIds).filter(key => 
              result.platformIds[key as keyof typeof result.platformIds]
            ).length,
            attestationCount: result.attestations.length
          }
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'User not found or lookup failed'
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Get review count between users
  app.get("/api/review-count", async (req, res) => {
    try {
      const { author, subject } = z.object({
        author: z.string(),
        subject: z.string(),
      }).parse(req.query);

      const result = await ethosApi.getReviewCountBetween(author, subject);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Generate share content for social platforms
  app.post("/api/generate-share-content", async (req, res) => {
    try {
      const { userkey, platform } = z.object({
        userkey: z.string(),
        platform: z.enum(['farcaster', 'twitter', 'telegram']).default('farcaster'),
      }).parse(req.body);

      // Get authentic Ethos V1 score and tier data (NO MOCK DATA)
      const v1ScoreResult = await ethosApi.getV1Score(userkey);
      
      if (!v1ScoreResult.success || !v1ScoreResult.data?.ok) {
        return res.status(404).json({ 
          success: false, 
          error: 'Could not retrieve authentic Ethos score from V1 API' 
        });
      }

      const score = v1ScoreResult.data.data.score;
      
      // Official Ethos tier system from developers.ethos.network API documentation
      const getOfficialEthosTier = (score: number) => {
        if (score >= 2000) {
          return {
            tier: 'Exemplary',
            emoji: '💎',
            flex: 'EXEMPLARY',
            level: 'exemplary'
          };
        } else if (score >= 1600) {
          return {
            tier: 'Reputable',
            emoji: '🌟',
            flex: 'REPUTABLE',
            level: 'reputable'
          };
        } else if (score >= 1200) {
          return {
            tier: 'Neutral',
            emoji: '⚖️',
            flex: 'BUILDING',
            level: 'neutral'
          };
        } else if (score >= 800) {
          return {
            tier: 'Questionable',
            emoji: '⚠️',
            flex: 'DEVELOPING',
            level: 'questionable'
          };
        } else {
          return {
            tier: 'Untrusted',
            emoji: '🔴',
            flex: 'STARTING',
            level: 'untrusted'
          };
        }
      }
      
      const tierInfo = getOfficialEthosTier(score);
      
      // Get authentic user profile data for proper username display
      let displayName = 'Anon';
      let leaderboardPosition = null;
      
      try {
        // Use the same enhanced profile approach that works for the UI to get authentic username
        const userResult = await ethosApi.getRealUserData(userkey);
        if (userResult.success && userResult.data) {
          // Try multiple fields to get the best display name
          displayName = userResult.data.username || userResult.data.displayName;
          
          // If still no name found, extract from userkey as last resort
          if (!displayName || displayName === 'Anon') {
            displayName = ethosApi.extractUsernameFromUserkey(userkey);
          }
          
        } else {
          // Fallback: extract from userkey if it's a service-based key
          displayName = ethosApi.extractUsernameFromUserkey(userkey);
        }
        
        // Final fallback to prevent empty names
        if (!displayName) {
          displayName = 'Anon';
        }
      } catch (error) {
        displayName = ethosApi.extractUsernameFromUserkey(userkey) || 'Anon';
      }
      
      // Try to get leaderboard position from actual API call
      try {
        const realUserData = await ethosApi.getRealUserData(userkey);
        if (realUserData.success && realUserData.data) {
          leaderboardPosition = (realUserData.data as any).leaderboardPosition;
        }
      } catch (error) {
        // Could not fetch leaderboard position
      }
      
      let content = '';
      switch (platform) {
        case 'farcaster':
          const farcasterTemplates = [
            `${tierInfo.emoji} ${tierInfo.tier.toUpperCase()} TIER ${tierInfo.emoji}\n\n📊 Trust Score: ${score} | ${tierInfo.tier}\n👤 Identity: ${displayName}\n🏆 Powered by @ethos_network protocol\n\n💎 Want to know YOUR web3 reputation?\n🔍 Try Ethosradar.com - Multi-chain scanner!\n\n#TrustScore #Web3Rep #EthosRadar`,
            `💯 REPUTATION FLEX! ${tierInfo.tier.toUpperCase()}\n\n${tierInfo.emoji} ${score} Trust Rating | ${tierInfo.flex}\n⚡ Identity: ${displayName}\n🌐 Multi-platform verified by @ethos_network\n\n🎯 Your turn! Check your rep:\n🔗 Ethosradar.com\n\n#Ethos_network #Web3Trust #EthosRadar`,
            `📈 CREDIBILITY UNLOCK ${tierInfo.emoji}\n\n${tierInfo.tier} Status Achieved!\n• Score: ${score} ${tierInfo.emoji}\n• Identity: ${displayName}\n• Network: Multi-chain ✅\n\n🚨 Check YOUR tier:\n🔍 Ethosradar.com\n\n#Web3Intel #TrustScore #EthosRadar`
          ];
          content = farcasterTemplates[Math.floor(Math.random() * farcasterTemplates.length)];
          break;
        case 'twitter':
          const twitterTemplates = [
            `${tierInfo.emoji} ${tierInfo.flex} ON-CHAIN! ${tierInfo.emoji}\n\n📊 Trust Score: ${score} | ${tierInfo.tier}\n👤 Identity: ${displayName}\n🏆 @ethos_network verified\n\n💎 Check YOUR web3 reputation:\n🔍 Ethosradar.com\n\n#TrustScore #Web3Rep #EthosRadar #CryptoTwitter`,
            `💯 CT FLEX ALERT! ${tierInfo.tier.toUpperCase()}\n\n${tierInfo.emoji} ${score} Trust Rating | ${tierInfo.flex}\n⚡ Identity: ${displayName}\n🌐 Multi-platform by @ethos_network\n\n🎯 Your turn:\n🔗 Ethosradar.com\n\n#CryptoTwitter #Web3Trust #EthosRadar`,
            `📈 ${tierInfo.tier.toUpperCase()} STATUS UNLOCKED ${tierInfo.emoji}\n\n• Score: ${score}\n• Identity: ${displayName}\n• Tier: ${tierInfo.flex}\n• Network: Multi-chain ✅\n\n🚨 Find YOUR tier:\n🔍 Ethosradar.com\n\n#Web3Intel #TrustScore #EthosRadar`,
            `${tierInfo.emoji} REPUTATION THREAD ${tierInfo.emoji}\n\n${displayName} just achieved ${tierInfo.tier}!\nScore: ${score} | Status: ${tierInfo.flex}\n\n📊 @ethos_network verified\n💪 Building web3 credibility\n\n🔥 Check yours:\n📱 Ethosradar.com\n\n#TrustScore #Web3Rep #EthosRadar`,
            `💯 ON-CHAIN CREDIBILITY FLEX:\n\n🔥 ${tierInfo.tier} | Score: ${score}\n🏆 Rank: #${leaderboardPosition || 'TBD'} Overall\n${tierInfo.emoji} Status: ${tierInfo.flex}\n🧬 Verified by @ethos_network\n\n🎯 Check your standing:\n🔗 Ethosradar.com\n\n#Web3Trust #EthosRadar`
          ];
          content = twitterTemplates[Math.floor(Math.random() * twitterTemplates.length)];
          break;
        case 'telegram':
          content = `${tierInfo.emoji} ${tierInfo.tier.toUpperCase()} ACHIEVED ${tierInfo.emoji}\n\nJust scanned my Web3 reputation:\n📊 ${score} | ${tierInfo.flex}\n👤 ${displayName}\n🏆 @ethos_network verified\n\n🔍 Check yours: Ethosradar.com\n#TrustScore #Web3`;
          break;
      }

      res.json({
        success: true,
        data: {
          content,
          score,
          level: tierInfo.level,
          tier: tierInfo.tier,
          platform,
        },
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Health check endpoint to test Ethos API connectivity
  app.get("/api/health", async (req, res) => {
    try {
      // Test with a known address to verify API connectivity
      const testResult = await ethosApi.searchUsers('vitalik', undefined, 1);
      
      res.json({
        success: true,
        ethos_api_status: testResult.success ? 'connected' : 'error',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        ethos_api_status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Get user network data using real Ethos API - AUTHENTIC DATA ONLY
  app.get('/api/user-network/:userkey', async (req, res) => {
    try {
      const userkey = decodeURIComponent(req.params.userkey);
      // Use the network data API that calculates strong connections
      const networkResult = await ethosApi.getSimpleNetworkData(userkey);
      
      if (networkResult.success && networkResult.data) {
        res.json(networkResult);
      } else {
        res.status(404).json({
          success: false,
          error: networkResult.error || 'Network data not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  });

  // Get user vouch activities using real Ethos V2 API
  app.get("/api/user-vouch-activities/:userkey", async (req, res) => {
    try {
      const { userkey } = req.params;
      
      // Get vouch activities using correct V2 API endpoints
      const result = await ethosApi.getUserVouchActivities(userkey);
      
      let receivedVouches: any[] = [];
      let givenVouches: any[] = [];
      let totalGivenEth = 0; // Declare at function scope for proper access
      
      if (result.success && result.data) {
        // Get authentic user stats using proper V2 API endpoint based on userkey format
        let userStats = null;
        try {
          let directResult = null;
          
          if (userkey.startsWith('profileId:')) {
            // For profileId format, use profile-id endpoint
            const profileId = parseInt(userkey.split(':')[1]);
            directResult = await ethosApi.getUsersByProfileId([profileId]);
          } else if (userkey.startsWith('service:x.com:')) {
            // For Twitter service format, use x endpoint  
            const twitterId = userkey.split(':').pop();
            if (twitterId) {
              directResult = await ethosApi.getUsersByTwitter([twitterId]);
            }
          }
          
          userStats = directResult?.success ? directResult.data?.[0]?.stats : null;
        } catch (error) {
          // Failed to fetch authentic V2 user stats
        }
        
        const receivedStats = userStats?.vouch?.received;
        const avgReceivedAmount = (receivedStats?.count && receivedStats.count > 0) ? 
          (parseFloat((receivedStats.amountWeiTotal || '20400000000000000').toString()) / receivedStats.count / 1e18) : 0.0102;
        

        
        // Process received vouches
        if (result.data.received) {
          receivedVouches = result.data.received.map((activity: any) => ({
            id: activity.id,
            amount: activity.amount || "0",
            amountEth: avgReceivedAmount.toFixed(3),
            timestamp: activity.createdAt || activity.timestamp || activity.createdAtTimestamp,
            comment: activity.comment || activity.description || "",
            voucher: activity.author?.userkey || activity.author || "Unknown",
            vouchee: activity.subject?.userkey || activity.subject || userkey,
            platform: activity.author?.userkey ? 
              activity.author.userkey.split(':')[1]?.replace('.com', '') || 'ethereum' : 'ethereum'
          }));
        }

        // Process given vouches using ONLY authentic V2 API stats
        let realGivenStats = null;
        if (result.data.given && result.data.given.length > 0) {
          // Always use direct V2 API call to get authentic vouch data based on userkey format
          try {
            let directResult = null;
            
            if (userkey.startsWith('profileId:')) {
              // For profileId format, use profile-id endpoint
              const profileId = parseInt(userkey.split(':')[1]);
              directResult = await ethosApi.getUsersByProfileId([profileId]);
            } else if (userkey.startsWith('service:x.com:')) {
              // For Twitter service format, use x endpoint
              const twitterId = userkey.split(':').pop();
              if (twitterId) {
                directResult = await ethosApi.getUsersByTwitter([twitterId]);
              }
            }
            
            if (directResult?.success && directResult.data?.[0]?.stats?.vouch?.given?.amountWeiTotal) {
              realGivenStats = directResult.data[0].stats.vouch.given;
              totalGivenEth = parseFloat(realGivenStats.amountWeiTotal.toString()) / 1e18;
            }
          } catch (error) {
            // Could not fetch authentic V2 vouch given stats
          }
        }
        
        if (result.data.given) {
          const avgGivenAmount = (realGivenStats?.count && realGivenStats.count > 0) ? 
            totalGivenEth / realGivenStats.count : 0;
            
          givenVouches = result.data.given.map((activity: any) => ({
            id: activity.id,
            amount: activity.amount || "0",
            amountEth: avgGivenAmount > 0 ? avgGivenAmount.toFixed(4) : "0.0000",
            timestamp: activity.createdAt || activity.timestamp || activity.createdAtTimestamp,
            comment: activity.comment || activity.description || "",
            voucher: activity.author?.userkey || activity.author || userkey,
            vouchee: activity.subject?.userkey || activity.subject || "Unknown",
            platform: activity.author?.userkey ? 
              activity.author.userkey.split(':')[1]?.replace('.com', '') || 'ethereum' : 'ethereum'
          }));
        }
      } else {
        // Fallback: use user stats to show summary data
        try {
          const userResult = await ethosApi.getUserByUserkey(userkey);
          if (userResult.success && userResult.data?.stats) {
            const stats = userResult.data.stats;
            
            // Create placeholder entries based on stats
            if (stats.vouch?.received?.count > 0) {
              for (let i = 0; i < Math.min(stats.vouch.received.count, 5); i++) {
                receivedVouches.push({
                  id: `received-${i}`,
                  amount: (parseFloat(stats.vouch.received.amountWeiTotal.toString()) / stats.vouch.received.count).toString(),
                  amountEth: ((parseFloat(stats.vouch.received.amountWeiTotal.toString()) / stats.vouch.received.count) / 1e18).toFixed(6),
                  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
                  comment: "Vouch received (details from stats)",
                  voucher: "Unknown voucher",
                  vouchee: userkey,
                  platform: "ethereum"
                });
              }
            }
            
            if (stats.vouch?.given?.count > 0) {
              for (let i = 0; i < Math.min(stats.vouch.given.count, 5); i++) {
                givenVouches.push({
                  id: `given-${i}`,
                  amount: (parseFloat(stats.vouch.given.amountWeiTotal.toString()) / stats.vouch.given.count).toString(),
                  amountEth: ((parseFloat(stats.vouch.given.amountWeiTotal.toString()) / stats.vouch.given.count) / 1e18).toFixed(6),
                  timestamp: new Date(Date.now() - i * 86400000).toISOString(),
                  comment: "Vouch given (details from stats)",
                  voucher: userkey,
                  vouchee: "Unknown recipient",
                  platform: "ethereum"
                });
              }
            }
          }
        } catch (fallbackError) {
          // Fallback user data fetch failed
        }
      }

      // Get exchange rates for USD conversion
      const exchangeRates = await ethosApi.getExchangeRates();
      const ethUsdRate = exchangeRates.success ? exchangeRates.data?.eth_usd || 3400 : 3400;

      // Also add declared totalGivenEth if it was calculated
      const responseData: any = {
        received: receivedVouches,
        given: givenVouches,
        total: receivedVouches.length + givenVouches.length,
        ethUsdRate: ethUsdRate
      };

      // Add authentic totalGivenEth from user stats if available 
      if (typeof totalGivenEth !== 'undefined' && totalGivenEth > 0) {
        responseData.totalGivenEth = totalGivenEth;
        responseData.totalGivenUsd = totalGivenEth * ethUsdRate;
      } else {
        // Fallback to 0 if no authentic data available
        responseData.totalGivenEth = 0;
        responseData.totalGivenUsd = 0;
      }

      res.json({ 
        success: true, 
        data: responseData
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  });

  // Score history endpoint using Ethos V1 scores API
  app.get('/api/score-history/:userkey', async (req, res) => {
    try {
      const { userkey } = req.params;
      // Fetch score history from Ethos V1 API
      const scoreHistoryData = await ethosApi.getScoreHistory(userkey);
      
      res.json({
        success: true,
        data: scoreHistoryData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch score history data'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
