// Universal Ethos Lookup Service
// Combines V1 Search, V1 Attestations, and V2 Users APIs for comprehensive user data

interface UniversalLookupResult {
  success: boolean;
  query: string;
  profileId: number;
  summary: {
    displayName: string;
    username: string;
    score: number;
    primaryAddress: string;
  };
  attestations: any[];
  platformIds: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    farcaster: string | null;
  };
  detailedPlatformData: {
    twitter?: any;
    discord?: any;
    telegram?: any;
    farcaster?: any;
  };
}

export class UniversalEthosLookup {
  private static cache = new Map<string, { data: UniversalLookupResult; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static async lookup(searchQuery: string): Promise<UniversalLookupResult> {
    // Check cache first
    const cached = this.cache.get(searchQuery.toLowerCase());
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`🎯 Universal lookup cache hit for: ${searchQuery}`);
      return cached.data;
    }

    console.log(`🔍 Starting universal lookup for: ${searchQuery}`);
    
    try {
      // Step 1: V1 Search API - Find user across all platforms
      console.log("Step 1: Searching across all platforms...");
      const searchUrl = `https://api.ethos.network/api/v1/search?query=${encodeURIComponent(searchQuery)}&limit=1`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (!searchData.ok || searchData.data.values.length === 0) {
        throw new Error("User not found in search");
      }
      
      const user = searchData.data.values[0];
      const profileId = user.profileId || user.id;
      
      if (!profileId) {
        throw new Error("User found but no profileId available");
      }
      
      console.log(`✅ Found user: ${user.name} (${user.username}) - Profile ID: ${profileId}`);
      
      // Step 2: V1 Attestations API - Get all connected accounts
      console.log("Step 2: Getting all attestations...");
      const attestationsResponse = await fetch("https://api.ethos.network/api/v1/attestations/extended", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileIds: [profileId],
          limit: 100,
          offset: 0
        })
      });
      
      const attestationsData = await attestationsResponse.json();
      console.log(`✅ Found ${attestationsData.data.total} attestations`);
      
      // Extract all platform IDs
      const platformIds = {
        twitter: null as string | null,
        discord: null as string | null,
        telegram: null as string | null,
        farcaster: null as string | null
      };
      
      attestationsData.data.values.forEach((item: any) => {
        const service = item.attestation.service;
        const accountId = item.attestation.account;
        
        switch(service) {
          case 'x.com':
            platformIds.twitter = accountId;
            break;
          case 'discord':
            platformIds.discord = accountId;
            break;
          case 'telegram':
            platformIds.telegram = accountId;
            break;
          case 'farcaster':
            platformIds.farcaster = accountId;
            break;
        }
      });
      
      console.log("📋 Platform IDs extracted:", platformIds);
      
      // Step 3: V2 Users APIs - Get detailed data for each platform
      console.log("Step 3: Fetching detailed data from V2 APIs...");
      
      const detailedPlatformData: any = {};
      
      // Twitter/X data (can use username or ID)
      if (platformIds.twitter) {
        try {
          const twitterResponse = await fetch("https://api.ethos.network/api/v2/users/by/x", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountIdsOrUsernames: [platformIds.twitter] })
          });
          const twitterData = await twitterResponse.json();
          if (twitterData.length > 0) {
            detailedPlatformData.twitter = twitterData[0];
            console.log("✅ Twitter data retrieved");
          }
        } catch (e) {
          console.log("❌ Twitter data failed:", (e as Error).message);
        }
      }
      
      // Discord data (requires ID)
      if (platformIds.discord) {
        try {
          const discordResponse = await fetch("https://api.ethos.network/api/v2/users/by/discord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ discordIds: [platformIds.discord] })
          });
          const discordData = await discordResponse.json();
          if (discordData.length > 0) {
            detailedPlatformData.discord = discordData[0];
            console.log("✅ Discord data retrieved");
          }
        } catch (e) {
          console.log("❌ Discord data failed:", (e as Error).message);
        }
      }
      
      // Telegram data (requires ID)
      if (platformIds.telegram) {
        try {
          const telegramResponse = await fetch("https://api.ethos.network/api/v2/users/by/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegramIds: [platformIds.telegram] })
          });
          const telegramData = await telegramResponse.json();
          if (telegramData.length > 0) {
            detailedPlatformData.telegram = telegramData[0];
            console.log("✅ Telegram data retrieved");
          }
        } catch (e) {
          console.log("❌ Telegram data failed:", (e as Error).message);
        }
      }
      
      // Farcaster data (requires ID)
      if (platformIds.farcaster) {
        try {
          const farcasterResponse = await fetch("https://api.ethos.network/api/v2/users/by/farcaster", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ farcasterIds: [platformIds.farcaster] })
          });
          const farcasterData = await farcasterResponse.json();
          if (farcasterData.length > 0) {
            detailedPlatformData.farcaster = farcasterData[0];
            console.log("✅ Farcaster data retrieved");
          }
        } catch (e) {
          console.log("❌ Farcaster data failed:", (e as Error).message);
        }
      }
      
      // Compile final result
      const result: UniversalLookupResult = {
        success: true,
        query: searchQuery,
        profileId: profileId,
        summary: {
          displayName: user.name,
          username: user.username,
          score: user.score,
          primaryAddress: user.primaryAddress
        },
        attestations: attestationsData.data.values,
        platformIds: platformIds,
        detailedPlatformData: detailedPlatformData
      };
      
      // Cache the result
      this.cache.set(searchQuery.toLowerCase(), {
        data: result,
        timestamp: Date.now()
      });
      
      console.log("🎉 Universal lookup complete!");
      return result;
      
    } catch (error) {
      console.error("❌ Universal lookup failed:", error);
      return {
        success: false,
        query: searchQuery,
        profileId: 0,
        summary: {
          displayName: "",
          username: "",
          score: 0,
          primaryAddress: ""
        },
        attestations: [],
        platformIds: {
          twitter: null,
          discord: null,
          telegram: null,
          farcaster: null
        },
        detailedPlatformData: {}
      };
    }
  }

  // Utility method to get platform-specific username by searching attestations
  static extractUsernameFromAttestations(attestations: any[], platform: string): string | null {
    const attestation = attestations.find(item => 
      item.attestation.service === platform
    );
    
    if (!attestation) return null;
    
    // Try to get username from extended data
    if (attestation.extra) {
      return attestation.extra.username || attestation.extra.name || null;
    }
    
    return null;
  }

  // Get comprehensive platform summary
  static getPlatformSummary(result: UniversalLookupResult) {
    const summary: any = {};
    
    Object.entries(result.platformIds).forEach(([platform, id]) => {
      if (id) {
        summary[platform] = {
          id: id,
          username: this.extractUsernameFromAttestations(result.attestations, 
            platform === 'twitter' ? 'x.com' : platform),
          hasDetailedData: !!result.detailedPlatformData[platform as keyof typeof result.detailedPlatformData],
          attestationHash: result.attestations.find(item => 
            item.attestation.service === (platform === 'twitter' ? 'x.com' : platform)
          )?.attestation.hash
        };
      }
    });
    
    return summary;
  }
}