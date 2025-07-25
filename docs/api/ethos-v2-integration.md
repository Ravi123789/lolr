# Ethos Protocol V2 API Integration Guide

## Overview
The Ethos Protocol V2 API provides real-time user profiles, vouch activities, and detailed user statistics. This is the primary API for current user data and vouch information.

## Base URL
```
https://api.ethos.network/api/v2
```

## Authentication
No API key required. Rate limiting applies based on IP address.

## Key Endpoints

### 1. User Profile Data
Get comprehensive user information:

```typescript
// GET /users/by/profile-id/{profileId}
// GET /users/by/address/{address}
// GET /users/by/x/{twitterHandle}
interface UserProfile {
  profileId: number;
  displayName: string;
  username: string;
  avatarUrl: string;
  description: string;
  score: number;
  status: 'active' | 'inactive' | 'suspended';
  userkeys: Array<{
    userkey: string;
    service: string;
    username: string;
    verified: boolean;
  }>;
  stats: {
    vouchesReceived: number;
    vouchesGiven: number;
    reviewsReceived: number;
    reviewsGiven: number;
    stakedEth: string; // in wei
    mutualVouches: number;
  };
  xpTotal: number;
  xpStreakDays: number;
  createdAt: string;
  updatedAt: string;
}
```

### 2. Vouch Activities
Get detailed vouch information:

```typescript
// GET /users/{userkey}/vouch-activities
interface VouchActivity {
  id: string;
  fromUserkey: string;
  toUserkey: string;
  amount: string; // in wei
  amountUSD: number;
  timestamp: string;
  transactionHash: string;
  fromProfile: {
    displayName: string;
    username: string;
    avatarUrl: string;
    score: number;
  };
  toProfile: {
    displayName: string;
    username: string;
    avatarUrl: string;
    score: number;
  };
  metadata: {
    comment?: string;
    tags?: string[];
    reciprocal: boolean;
  };
}

interface VouchActivitiesResponse {
  activities: VouchActivity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
  };
  summary: {
    totalVouchesReceived: number;
    totalVouchesGiven: number;
    totalETHReceived: string;
    totalETHGiven: string;
    averageVouchAmount: string;
  };
}
```

### 3. Search and Discovery
```typescript
// GET /search/users?query={searchTerm}&limit=20
interface SearchResult {
  users: Array<{
    profileId: number;
    displayName: string;
    username: string;
    avatarUrl: string;
    score: number;
    userkeys: string[];
    relevanceScore: number;
    activityLevel: 'high' | 'medium' | 'low' | 'inactive';
  }>;
  total: number;
  suggestions: string[];
}
```

## Implementation Examples

### Core Service Class
```typescript
class EthosV2Service {
  private baseUrl = 'https://api.ethos.network/api/v2';

  async getUserByProfileId(profileId: number): Promise<UserProfile> {
    const response = await fetch(
      `${this.baseUrl}/users/by/profile-id/${profileId}`
    );
    
    if (!response.ok) {
      throw new Error(`V2 API Error: ${response.status}`);
    }
    
    return response.json();
  }

  async getUserByAddress(address: string): Promise<UserProfile> {
    const response = await fetch(
      `${this.baseUrl}/users/by/address/${address}`
    );
    
    return response.json();
  }

  async getUserByTwitter(handle: string): Promise<UserProfile> {
    const response = await fetch(
      `${this.baseUrl}/users/by/x/${handle}`
    );
    
    return response.json();
  }

  async getVouchActivities(
    userkey: string, 
    page = 1, 
    limit = 50
  ): Promise<VouchActivitiesResponse> {
    const response = await fetch(
      `${this.baseUrl}/users/${userkey}/vouch-activities?page=${page}&limit=${limit}`
    );
    
    return response.json();
  }

  async searchUsers(query: string, limit = 20): Promise<SearchResult> {
    const response = await fetch(
      `${this.baseUrl}/search/users?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    return response.json();
  }
}
```

### React Hooks for V2 Data
```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export function useUserProfile(userkey: string, type: 'profileId' | 'address' | 'twitter') {
  return useQuery({
    queryKey: ['ethos-v2', 'user', type, userkey],
    queryFn: async () => {
      switch (type) {
        case 'profileId':
          return ethosV2Service.getUserByProfileId(Number(userkey));
        case 'address':
          return ethosV2Service.getUserByAddress(userkey);
        case 'twitter':
          return ethosV2Service.getUserByTwitter(userkey);
        default:
          throw new Error('Invalid user type');
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVouchActivities(userkey: string) {
  return useInfiniteQuery({
    queryKey: ['ethos-v2', 'vouches', userkey],
    queryFn: ({ pageParam = 1 }) => 
      ethosV2Service.getVouchActivities(userkey, pageParam, 50),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: 30 * 1000, // 30 seconds for real-time feel
  });
}

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ['ethos-v2', 'search', query],
    queryFn: () => ethosV2Service.searchUsers(query),
    enabled: query.length > 2,
    staleTime: 60 * 1000, // 1 minute
  });
}
```

## Advanced Features

### Multi-Format Userkey Resolution
```typescript
class UserResolver {
  async resolveUser(input: string): Promise<UserProfile> {
    // Try to determine the input type
    if (input.startsWith('0x') && input.length === 42) {
      // Ethereum address
      return ethosV2Service.getUserByAddress(input);
    }
    
    if (input.match(/^\d+$/)) {
      // Profile ID
      return ethosV2Service.getUserByProfileId(Number(input));
    }
    
    if (input.includes('@') || input.includes('twitter.com')) {
      // Twitter handle
      const handle = input.replace('@', '').replace('https://twitter.com/', '');
      return ethosV2Service.getUserByTwitter(handle);
    }
    
    // Fallback to search
    const searchResults = await ethosV2Service.searchUsers(input);
    if (searchResults.users.length > 0) {
      return ethosV2Service.getUserByProfileId(searchResults.users[0].profileId);
    }
    
    throw new Error('User not found');
  }
}
```

### ETH Amount Conversion
```typescript
import { ethers } from 'ethers';

class VouchAmountConverter {
  static weiToEth(weiAmount: string): number {
    return parseFloat(ethers.formatEther(weiAmount));
  }

  static async weiToUSD(weiAmount: string): Promise<number> {
    const ethAmount = this.weiToEth(weiAmount);
    const ethPrice = await this.getETHPrice();
    return ethAmount * ethPrice;
  }

  private static async getETHPrice(): Promise<number> {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum.usd;
  }

  static formatVouchAmount(weiAmount: string, includeUSD = true): string {
    const ethAmount = this.weiToEth(weiAmount);
    const formatted = `${ethAmount.toFixed(3)} ETH`;
    
    if (includeUSD) {
      // Note: For real-time USD, use async version
      return `${formatted} (~$${(ethAmount * 3000).toFixed(2)})`;
    }
    
    return formatted;
  }
}
```

### Real-time Data Updates
```typescript
class EthosV2RealtimeService extends EthosV2Service {
  private wsConnection?: WebSocket;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  subscribeToUserUpdates(userkey: string, callback: (profile: UserProfile) => void) {
    if (!this.subscribers.has(userkey)) {
      this.subscribers.set(userkey, new Set());
    }
    this.subscribers.get(userkey)!.add(callback);

    // Set up polling for real-time updates
    const interval = setInterval(async () => {
      try {
        const profile = await this.getUserByAddress(userkey);
        callback(profile);
      } catch (error) {
        console.error('Failed to fetch user update:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      this.subscribers.get(userkey)?.delete(callback);
      clearInterval(interval);
    };
  }
}
```

## Data Processing and Analytics

### Vouch Analysis
```typescript
class VouchAnalyzer {
  static analyzeVouchPattern(activities: VouchActivity[]) {
    const received = activities.filter(a => a.toUserkey === userkey);
    const given = activities.filter(a => a.fromUserkey === userkey);
    
    return {
      reciprocityRate: this.calculateReciprocityRate(activities),
      averageVouchAmount: this.calculateAverageAmount(activities),
      topVouchers: this.getTopVouchers(received),
      vouchingFrequency: this.calculateFrequency(given),
      networkDiversity: this.calculateNetworkDiversity(activities),
      trustworthiness: this.calculateTrustworthiness(activities)
    };
  }

  private static calculateReciprocityRate(activities: VouchActivity[]): number {
    const reciprocal = activities.filter(a => a.metadata.reciprocal);
    return reciprocal.length / activities.length;
  }

  private static getTopVouchers(received: VouchActivity[]) {
    const vouchers = new Map<string, { count: number; total: number; profile: any }>();
    
    received.forEach(activity => {
      const key = activity.fromUserkey;
      const existing = vouchers.get(key) || { count: 0, total: 0, profile: activity.fromProfile };
      
      vouchers.set(key, {
        count: existing.count + 1,
        total: existing.total + VouchAmountConverter.weiToEth(activity.amount),
        profile: activity.fromProfile
      });
    });

    return Array.from(vouchers.entries())
      .map(([userkey, data]) => ({ userkey, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }
}
```

### Portfolio Tracking
```typescript
interface PortfolioWallet {
  userkey: string;
  label: string;
  type: 'address' | 'profileId' | 'twitter';
  addedAt: string;
}

class PortfolioTracker {
  private wallets: PortfolioWallet[] = [];

  async getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
    const profiles = await Promise.all(
      this.wallets.map(wallet => this.getUserProfile(wallet))
    );

    return {
      totalWallets: this.wallets.length,
      averageScore: profiles.reduce((sum, p) => sum + p.score, 0) / profiles.length,
      totalStakedETH: profiles.reduce((sum, p) => 
        sum + VouchAmountConverter.weiToEth(p.stats.stakedEth), 0
      ),
      scoreDistribution: this.calculateScoreDistribution(profiles),
      riskAssessment: this.assessPortfolioRisk(profiles),
      lastUpdated: new Date().toISOString()
    };
  }

  private async getUserProfile(wallet: PortfolioWallet): Promise<UserProfile> {
    const resolver = new UserResolver();
    return resolver.resolveUser(wallet.userkey);
  }
}
```

## Error Handling and Reliability

### Comprehensive Error Handler
```typescript
interface EthosV2Error {
  code: number;
  message: string;
  userkey?: string;
  endpoint?: string;
  timestamp: string;
}

class EthosV2ErrorHandler {
  static async handleRequest<T>(
    operation: () => Promise<T>,
    context: { userkey?: string; endpoint?: string }
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const ethosError: EthosV2Error = {
        code: error.status || 500,
        message: error.message || 'Unknown error',
        userkey: context.userkey,
        endpoint: context.endpoint,
        timestamp: new Date().toISOString()
      };

      // Log error for monitoring
      console.error('Ethos V2 API Error:', ethosError);

      // Handle specific error types
      switch (ethosError.code) {
        case 404:
          throw new Error(`User not found: ${context.userkey}`);
        case 429:
          throw new Error('Rate limit exceeded. Please try again later.');
        case 500:
          throw new Error('Ethos service temporarily unavailable');
        default:
          throw new Error(`API Error: ${ethosError.message}`);
      }
    }
  }
}
```

### Fallback Strategies
```typescript
class EthosV2ResilientService extends EthosV2Service {
  async getUserWithFallback(userkey: string, type: string): Promise<UserProfile> {
    const attempts = [
      () => this.getUserByAddress(userkey),
      () => this.getUserByProfileId(Number(userkey)),
      () => this.getUserByTwitter(userkey)
    ];

    for (const attempt of attempts) {
      try {
        return await attempt();
      } catch (error) {
        console.warn('Attempt failed, trying next method:', error.message);
      }
    }

    throw new Error('All user resolution methods failed');
  }
}
```

## Testing

### Mock Data Generator
```typescript
export const generateMockUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => {
  return {
    profileId: 12345,
    displayName: 'Test User',
    username: 'testuser',
    avatarUrl: 'https://example.com/avatar.jpg',
    description: 'Test user for development',
    score: 1500,
    status: 'active',
    userkeys: [
      {
        userkey: '0x1234567890123456789012345678901234567890',
        service: 'ethereum',
        username: 'testuser.eth',
        verified: true
      }
    ],
    stats: {
      vouchesReceived: 25,
      vouchesGiven: 18,
      reviewsReceived: 12,
      reviewsGiven: 8,
      stakedEth: '1500000000000000000', // 1.5 ETH in wei
      mutualVouches: 5
    },
    xpTotal: 7500,
    xpStreakDays: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-23T00:00:00Z',
    ...overrides
  };
};
```

### Integration Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('EthosV2Service Integration', () => {
  let service: EthosV2Service;

  beforeEach(() => {
    service = new EthosV2Service();
  });

  it('should fetch user profile by address', async () => {
    const profile = await service.getUserByAddress(
      '0x1234567890123456789012345678901234567890'
    );
    
    expect(profile.profileId).toBeTypeOf('number');
    expect(profile.score).toBeGreaterThan(0);
    expect(profile.userkeys).toBeInstanceOf(Array);
  });

  it('should handle non-existent users gracefully', async () => {
    await expect(
      service.getUserByAddress('0x0000000000000000000000000000000000000000')
    ).rejects.toThrow('User not found');
  });
});
```

This comprehensive guide covers all aspects of integrating with the Ethos Protocol V2 API, including advanced features for portfolio tracking, real-time updates, and robust error handling.