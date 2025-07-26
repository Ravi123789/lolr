// Universal Ethos Lookup - Combines V1 Search, V1 Attestations, and V2 Users APIs
// This creates a comprehensive user lookup from any username/handle

async function universalEthosLookup(searchQuery) {
  console.log(`🔍 Starting universal lookup for: ${searchQuery}`);
  
  // Step 1: V1 Search API - Find user across all platforms
  console.log("Step 1: Searching across all platforms...");
  const searchResponse = await fetch("https://api.ethos.network/api/v1/search", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    params: new URLSearchParams({ query: searchQuery, limit: 1 })
  });
  
  const searchData = await searchResponse.json();
  if (!searchData.ok || searchData.data.values.length === 0) {
    throw new Error("User not found in search");
  }
  
  const user = searchData.data.values[0];
  const profileId = user.profileId;
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
    twitter: null,
    discord: null,
    telegram: null,
    farcaster: null
  };
  
  attestationsData.data.values.forEach(item => {
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
  
  const detailedData = {
    profile: user,
    platforms: {}
  };
  
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
        detailedData.platforms.twitter = twitterData[0];
        console.log("✅ Twitter data retrieved");
      }
    } catch (e) {
      console.log("❌ Twitter data failed:", e.message);
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
        detailedData.platforms.discord = discordData[0];
        console.log("✅ Discord data retrieved");
      }
    } catch (e) {
      console.log("❌ Discord data failed:", e.message);
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
        detailedData.platforms.telegram = telegramData[0];
        console.log("✅ Telegram data retrieved");
      }
    } catch (e) {
      console.log("❌ Telegram data failed:", e.message);
    }
  }
  
  // Farcaster data (can use username with special endpoint)
  if (platformIds.farcaster) {
    try {
      // First try by ID
      const farcasterResponse = await fetch("https://api.ethos.network/api/v2/users/by/farcaster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farcasterIds: [platformIds.farcaster] })
      });
      const farcasterData = await farcasterResponse.json();
      if (farcasterData.length > 0) {
        detailedData.platforms.farcaster = farcasterData[0];
        console.log("✅ Farcaster data retrieved");
      }
    } catch (e) {
      console.log("❌ Farcaster data failed:", e.message);
    }
  }
  
  // Final result
  console.log("🎉 Universal lookup complete!");
  return {
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
    detailedData: detailedData
  };
}

// Example usage:
// universalEthosLookup("cookedzera").then(result => console.log(JSON.stringify(result, null, 2)));

module.exports = { universalEthosLookup };